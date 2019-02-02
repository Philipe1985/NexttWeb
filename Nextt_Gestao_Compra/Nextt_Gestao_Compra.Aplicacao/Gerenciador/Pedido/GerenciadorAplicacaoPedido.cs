using AutoMapper;
using Nextt_Gestao_Compra.Aplicacao.Servicos.Interfaces.Gerenciamento;
using Nextt_Gestao_Compra.Aplicacao.ViewModel;
using Nextt_Gestao_Compra.Dominio.Entidades;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Nextt_Gestao_Compra.Aplicacao.Gerenciador.Pedido
{
    public class GerenciadorAplicacaoPedido
    {
        public static FiltrosPesquisa RetornaFiltroInicial(IAppServicoPedido pedidoServico, FabricaViewModel fabrica)
        {
            var dados = pedidoServico.CarregaFiltrosPesquisaPedido();

            var listaFornecedores = dados.ElementAt(0).Cast<Fornecedor>().OrderBy(x => x.NomeFantasia).Select(x => fabrica.Criar(x)).ToList();

            var listaMarcas = dados.ElementAt(1).Cast<Marca>().OrderBy(x => x.Nome).Select(x => fabrica.Criar(x)).ToList();

            var listaSegmetos = dados.ElementAt(2).Cast<Segmento>().OrderBy(x => x.Descricao).Select(x => fabrica.Criar(x)).ToList();
            var listaUsuarios = dados.ElementAt(4).Cast<UsuarioGerenciamento>().OrderBy(x => x.NomeUsuario).Select(x => fabrica.Criar(x)).ToList();
            var listaAttrForn = dados.ElementAt(3).Cast<Atributo>().OrderBy(x => x.Descricao).Select(x => fabrica.Criar(x)).ToList();
            var listaStatus = dados.ElementAt(5).Cast<StatusPedido>().Select(x => fabrica.Criar(x)).ToList();
            var retorno = new FiltrosPesquisa(listaFornecedores, listaSegmetos, listaMarcas)
            {
                StatusPedido = listaStatus,
                Usuarios = listaUsuarios,
                AttrFornecedores = listaAttrForn
            };
            return retorno;
        }
        public static List<PedidosFiltradoVM> RetornaPedidosFiltrado(IAppServicoPedido pedidoServico, ParametrosVM parametroVM)
        {
            var filtro = Mapper.Map<ParametrosVM, Parametros>(parametroVM);
            var dados = pedidoServico.PesquisaPedidos(filtro).ElementAt(0).Cast<PedidoConsulta>();
            var listaRetorno = Mapper.Map<IEnumerable<PedidoConsulta>, IEnumerable<PedidosFiltradoVM>>(dados).ToList();
            return listaRetorno;
        }
        public static void AtualizaPedido(IAppServicoPedido pedidoServico, ParametrosVM parametroVM)
        {
            var filtro = Mapper.Map<ParametrosVM, Parametros>(parametroVM);
            pedidoServico.AtualizaStatusPedido(filtro);
            //CriarArquivo.GerarPDFPedido(int.Parse(filtro.Codigo));


        }
        public static int ClonarPedido(IAppServicoPedido pedidoServico, ParametrosVM parametroVM)
        {
            var filtro = Mapper.Map<ParametrosVM, Parametros>(parametroVM);
            var pedidoClonado = pedidoServico.ClonarPedido(filtro).ElementAt(0).Cast<PedidoConsulta>().FirstOrDefault().IDPedido;
            return pedidoClonado;
        }
        public static RetornoPedidoSinteticoVM RetornaPedidoSintetico(IAppServicoPedido pedidoServico, ParametrosVM parametroVM)
        {
            var filtro = Mapper.Map<ParametrosVM, Parametros>(parametroVM);
            var dados = pedidoServico.RetornaPedidoSintetico(filtro);
            var dadosPedido = dados.ElementAt(0).Cast<PedidoCadastrado>().FirstOrDefault();
            var dadosFornecedor = dados.ElementAt(1).Cast<Fornecedor>().FirstOrDefault();
            var dadosProduto = dados.ElementAt(2).Cast<DadosPrePedido>().FirstOrDefault();
            var dadosImagem = Mapper.Map<FotoProduto, ImagensProdutoVM>(dados.ElementAt(5).Cast<FotoProduto>().FirstOrDefault());

            var retorno = new RetornoPedidoSinteticoVM(dadosPedido, dadosFornecedor, dadosProduto, dadosImagem);
            var listaItensPackAgrupado = dados.ElementAt(3).Cast<ProdutoItem>().OrderBy(x => x.Pack).GroupBy(x => x.Pack).Select(x => x.ToList());
            var listaDistribuicaoPackAgrupado = dados.ElementAt(4).Cast<GrupoFilial>().OrderBy(x => x.Pack).GroupBy(x => x.Pack).Select(x => x.ToList());

            for (int i = 0; i < listaItensPackAgrupado.Count(); i++)
            {
                retorno.Packs.Add(new PackVM(listaItensPackAgrupado.ElementAt(i), listaDistribuicaoPackAgrupado.ElementAt(i)));
            }
            
            return retorno;
        }
        public static RetornoPedidoAnalitico RetornaPedidoAnalitico(IAppServicoPedido pedidoServico, ParametrosVM parametroVM, FabricaViewModel fabrica)
        {
            var filtro = Mapper.Map<ParametrosVM, Parametros>(parametroVM);
            var dados = pedidoServico.RetornaPedidoAnalitico(filtro);
            var dadosPedido = dados.ElementAt(0).Cast<PedidoCadastrado>().FirstOrDefault();
            var dadosReferenciaProduto = dados.ElementAt(1).Cast<ReferenciaProduto>().ToList();
            var dadosTamanho = pedidoServico.RetornaTamanhosAtivo(dados.ElementAt(2).Cast<GrupoTamanho>().ToList());
            var dadosCores = dados.ElementAt(3).Cast<Cor>().ToList();
            ChecaCoresSemRgb(dadosCores);
            var listaItensPackAgrupado = dados.ElementAt(7).Cast<ProdutoItem>().OrderBy(x => x.Pack).GroupBy(x => x.Pack).Select(x => x.ToList());
            ValidaTamanhoPedido(dadosTamanho, listaItensPackAgrupado.ElementAt(0));
            ValidaCorPedido(dadosCores, listaItensPackAgrupado.ElementAt(0));
            ValidaReferenciaPedido(dadosReferenciaProduto, listaItensPackAgrupado.ElementAt(0));
            var listaAttrProd = dados.ElementAt(12).Cast<Atributo>().OrderBy(x => x.Ordem).ToList();
            var listaAttrPed = dados.ElementAt(13).Cast<Atributo>().OrderBy(x => x.Ordem).ToList();
            var listaElemPed = pedidoServico.RetornaAtributosCampos(listaAttrPed).Select(x => new AtributoElementoVM(x));
            var listaElemProd = pedidoServico.RetornaAtributosCampos(listaAttrProd).Select(x => new AtributoElementoVM(x));
            var comboAttrPed = pedidoServico.RetornaAtributosTipoLista(listaAttrPed).Select(x => new ComboAtributoVM(x, fabrica));
            var comboAttrProd = pedidoServico.RetornaAtributosTipoLista(listaAttrProd).Select(x => new ComboAtributoVM(x, fabrica));
            var ordemPed = listaAttrPed.Where(x => x.IDTipoAtributo == x.IDTipoAtributoKey).Select(x => x.Lista).ToList();
            var ordemProd = listaAttrProd.Where(x => x.IDTipoAtributo == x.IDTipoAtributoKey).Select(x => x.Lista).ToList();
            var listaForma = dados.ElementAt(4).Cast<FormaPgto>().OrderBy(x => x.DescricaoFormaPagamento).Select(x => x).ToList();
            var condicoesOrdenadas = dados.ElementAt(5).Cast<CondicaoPgto>().OrderBy(x => x.Condicao.Split('+').Length).Select(x => fabrica.Criar(x)).ToList();
            var listaClassificacao = dados.ElementAt(6).Cast<ClassificacaoFiscal>().OrderBy(x => x.CodigoFiscal).Select(x => fabrica.Criar(x)).ToList();
            var listaComprador = dados.ElementAt(14).Cast<Comprador>().OrderBy(x => x.Nome).Select(x => fabrica.Criar(x)).ToList();
            var listaMedida = dados.ElementAt(15).Cast<UnidadeMedida>().OrderBy(x => x.Descricao).Select(x => fabrica.Criar(x)).ToList();
            var listaDistribuicaoPackAgrupado = dados.ElementAt(8).Cast<GrupoFilial>().OrderBy(x => x.Pack).GroupBy(x => x.Pack).Select(x => x.ToList());
            var dadosGrade = dados.ElementAt(9).Cast<Grade>().ToList();
            var gruposAtivo = RetornaGruposAtivos(dados.ElementAt(10).Cast<GrupoFilial>().ToList()).Select(x => new GruposValidadosVM(x)).ToList();
            var gruposRelacionadosDesativar = RetornaGruposRelacionados(dados.ElementAt(11).Cast<GrupoFilial>().ToList(), gruposAtivo);
            var resumoPedido = dados.ElementAt(16).Cast<ResumoPedido>().FirstOrDefault();
            var historicoPedido = dados.ElementAt(17).Cast<HistoricoPedido>().Select(x => new HistoricoPedidoVM(x)).ToList();
            var compradoresSel = dadosPedido.IDComprador;
            var configPadrao = dados.ElementAt(18).Cast<ConfigDefault>().FirstOrDefault();
            var listaTabelaPrecoEmpresa = dados.ElementAt(19).Cast<PrecoGrupoEmpresa>().GroupBy(x => x.IDGrupoEmpresa).Select(x => new GrupoEmpresaPrecosVM(x)).ToList();
            var listaCompradorProduto = dados.ElementAt(20).Cast<Comprador>().ToList();
            var listaStatus = dados.ElementAt(22).Cast<StatusPedido>().Select(x => fabrica.Criar(x)).ToList();
            var datasCargaInicial = new DadosConfigPadraoVM(configPadrao)
            {
                DataEntregaInicio = dadosPedido.DataEntregaInicio,
                DataEntregaFinal = dadosPedido.DataEntregaFinal,
                DataToleranciaAtrasoInicio = dadosPedido.DataToleranciaAtrasoInicio,
                DataToleranciaAtrasoFinal = dadosPedido.DataToleranciaAtrasoFinal
            };

            var filtrosPesquisa = new FiltrosPesquisa(dadosPedido, fabrica, dadosCores, pedidoServico)
            {
                StatusPedido = listaStatus,
                CompradoresProduto = listaCompradorProduto.Count > 0 ? listaCompradorProduto.OrderBy(x => x.Nome).Select(x => fabrica.Criar(x)).ToList() : null,
                GrupoEmpresaPrecos = listaTabelaPrecoEmpresa,
                Compradores = listaComprador,
                UniMedida = listaMedida,
                OrdemPed = ordemPed,
                OrdemProd = ordemProd,
                AttrEleListaProd = listaElemProd.ToList(),
                AttrEleListaPed = listaElemPed.ToList(),
                AttrListaProd = comboAttrProd.ToList(),
                AttrListaPed = comboAttrPed.ToList(),
                Referencias = dadosReferenciaProduto.Select(x => fabrica.Criar(x)).ToList(),
                TamanhoOpcoes = dadosTamanho.Select(x => fabrica.Criar(x)).ToList(),
                FormaPgto = listaForma.Select(x => fabrica.Criar(x)).ToList(),
                Classificacao = listaClassificacao,
                CondicaoPgto = condicoesOrdenadas,
                RelacionamentoGrupos = gruposRelacionadosDesativar,
                DadosConfigPadrao = datasCargaInicial
            };
            if (!dadosPedido.Ativo)
                filtrosPesquisa.Marcas = dados.ElementAt(21).Cast<Marca>().OrderBy(x => x.Nome).Select(x => fabrica.Criar(x)).ToList();

            var retorno = new RetornoPedidoAnalitico(dadosPedido, filtrosPesquisa, resumoPedido)
            {
                Historicos = historicoPedido,
                CompradoresSelecionados = compradoresSel,
                CoresSelecionadas = String.Join(",", listaItensPackAgrupado.ElementAt(0).Select(x => x.DescricaoCor.Trim()).Distinct().ToList()),
                ReferenciasSelecionadas = String.Join(",", listaItensPackAgrupado.ElementAt(0).Select(x => x.ReferenciaItem.Trim()).Distinct().ToList()),
                FormasSelecionadas = String.Join(",", listaForma.Where(x => x.ContemPedido == true).Select(x => x.IDFormaPagamento).ToList()),
                TamanhosSelecionadas = String.Join(",", listaItensPackAgrupado.ElementAt(0).Select(x => x.DescricaoTamanho.Trim()).Distinct().ToList())
            };
            for (int i = 0; i < listaItensPackAgrupado.Count(); i++)
            {
                retorno.Packs.Add(new PackVM(listaItensPackAgrupado.ElementAt(i), listaDistribuicaoPackAgrupado.ElementAt(i)));
            }
            //Criando pdf
            //var fichaDados = new PedidoPdfVM(filtro.Codigo, dadosPedido, resumoPedido)
            //{
            //    UnidadeMedida = listaMedida.Where(x => x.Valor == dadosPedido.IDUnidadeMedida.ToString()).Select(x => x.Descricao).FirstOrDefault(),
            //    CondicaoPagamento = condicoesOrdenadas.Where(x => x.Valor == dadosPedido.IDCondicaoPagamento.ToString()).Select(x => x.Descricao).FirstOrDefault(),
            //    FormasPagamento = string.Join(", ", listaForma.Where(x => x.ContemPedido == true).Select(x => x.DescricaoFormaPagamento).ToList()),
            //    Packs = retorno.Packs,
            //    Comprador = listaComprador.Where(x => x.Valor == dadosPedido.IDComprador).Select(x => x.Descricao).FirstOrDefault()
            //};
            //var listaAtributosEleProd = listaElemProd.Where(x => !string.IsNullOrEmpty(x.ValorDef)).ToList();
            //var listaAtributosComboProd = comboAttrProd.Where(x => x.Opcoes.Where(y => y.DadosAdicionais[0] == "1").Count() > 0).ToList();
            //fichaDados.CarregaAtributosProduto(listaAtributosEleProd, listaAtributosComboProd);
            //var listaAtributosElePed = listaElemPed.Where(x => !string.IsNullOrEmpty(x.ValorDef)).ToList();
            //var listaAtributosComboPed = comboAttrPed.Where(x => x.Opcoes.Where(y => y.DadosAdicionais[0] == "1").Count() > 0).ToList();
            //fichaDados.CarregaAtributosPedido(listaAtributosElePed, listaAtributosComboPed);
            //CriarArquivo.GerarPDFPedido(fichaDados);
            return retorno;
        }
        #region Métodos de Manipulação de Objetos
        private static void ValidaTamanhoPedido(List<GrupoTamanho> tamanhos, List<ProdutoItem> produtoItems)
        {
            var valido = true;
            var tamanhosPedido = produtoItems.Select(x => new { x.IDTamanho, x.DescricaoTamanho }).Distinct().ToList();
            for (int i = 0; i < tamanhosPedido.Count; i++)
            {
                valido = tamanhos.Select(x => x.Descricao.Trim().ToUpper()).ToList().Contains(tamanhosPedido[i].DescricaoTamanho.Trim().ToUpper());
                if (!valido)
                {
                    tamanhos.Add(new GrupoTamanho
                    {
                        Ativo = true,
                        Descricao = tamanhosPedido[i].DescricaoTamanho.Trim(),
                        IDTamanho = tamanhosPedido[i].IDTamanho,
                        Ordem = 0
                    });
                    //throw new Exception("Tamanhos retornados no pedido é incompativel com os tamanhos disponível para escolha. \r\n Tamanho divergente:" + tamanhosPedido[i]);

                }
            }
        }
        private static void ValidaCorPedido(List<Cor> cores, List<ProdutoItem> produtoItems)
        {
            var valido = true;
            var coresPedido = produtoItems.Select(x => x.DescricaoCor.Trim().ToUpper()).Distinct().ToList();
            for (int i = 0; i < coresPedido.Count; i++)
            {
                valido = cores.Select(x => x.Descricao.Trim().ToUpper()).ToList().Contains(coresPedido[i]);
                if (!valido)
                {
                    throw new Exception("Cores retornadas no pedido é incompativel com as cores disponível para escolha. \r\n Cor divergente:" + coresPedido[i]);

                }
            }
        }
        private static void ValidaReferenciaPedido(List<ReferenciaProduto> referencias, List<ProdutoItem> produtoItems)
        {
            var valido = true;
            var referenciasPedido = produtoItems.Select(x => x.ReferenciaItem.Trim().ToUpper()).Distinct().ToList();
            for (int i = 0; i < referenciasPedido.Count; i++)
            {
                valido = referencias.Select(x => x.Referencia.Trim().ToUpper()).ToList().Contains(referenciasPedido[i]);
                if (!valido)
                {
                    throw new Exception("Referências retornadas no pedido é incompativel com as referências disponível para escolha. \r\n Referência divergente:" + referenciasPedido[i]);

                }
            }
        }
        private static void ChecaCoresSemRgb(List<Cor> cores)
        {
            var coresSemRgb = cores.Where(x => x.CorRGB.Length == 0).ToList();

            if (coresSemRgb.Count() > 0)
            {
                throw new Exception("Exitem cores retornadas que não possuem RGB. \r\n Cores sem rgb:" +
                     String.Join(", ", coresSemRgb.Select(x => x.Descricao).ToList()));

            }

        }
        private static List<short> RetornaGruposAtivos(List<GrupoFilial> dadoPre)
        {
            return dadoPre.Where(x => x.Ativo == true).Select(x => x.IDGrupoFilial).ToList();
        }
        private static List<GruposValidadosVM> RetornaGruposRelacionados(List<GrupoFilial> dadoPre, List<GruposValidadosVM> gruposAtivo)
        {
            dadoPre.GroupBy(x => x.IDFilial).Where(x => x.Count() > 1)
                  .Select(x => x.ToList().Select(gp => gp.IDGrupoFilial)
                  .ToList()).Select(x => RetornaGruposTratados(gruposAtivo, x))
                  .ToList();
            return gruposAtivo;
        }
        private static List<GruposValidadosVM> RetornaGruposTratados(List<GruposValidadosVM> retorno, List<Int16> ids)
        {
            for (int i = 0; i < retorno.Count; i++)
                if (ids.Any(x => x.ToString() == retorno[i].IDGrupo))
                    for (int j = 0; j < ids.Count; j++)
                        if (retorno[i].IDGrupo != ids[j].ToString())
                            if (!retorno[i].IDGrupoDesativar.Contains(ids[j].ToString()))
                                retorno[i].IDGrupoDesativar.Add(ids[j].ToString());

            return retorno;
        }

        #endregion
    }
}
