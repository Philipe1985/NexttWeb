﻿using AutoMapper;
using Newtonsoft.Json;
using Nextt_Gestao_Compra.Aplicacao.Servicos.Interfaces.Gerenciamento;
using Nextt_Gestao_Compra.Aplicacao.Utils;
using Nextt_Gestao_Compra.Aplicacao.ViewModel;
using Nextt_Gestao_Compra.Dominio.Entidades;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Nextt_Gestao_Compra.Aplicacao.Gerenciador.Compra
{
    public class GerenciadorAplicacaoCompra
    {
        public static FiltrosPesquisa RetornaDadosFiltroInicial(IAppServicoCompra compraServico, FabricaViewModel fabrica)
        {
            var dados = compraServico.RetornaCargaInicialFiltros();

            var listaFornecedores = dados.ElementAt(0).Cast<Fornecedor>().OrderBy(x => x.NomeFantasia).Select(x => fabrica.Criar(x)).ToList();

            var listaMarcas = dados.ElementAt(1).Cast<Marca>().OrderBy(x => x.Nome).Select(x => fabrica.Criar(x)).ToList();

            var listaSegmentos = dados.ElementAt(2).Cast<Segmento>().OrderBy(x => x.Descricao).Select(x => fabrica.Criar(x)).ToList();
            var listaAttrForn = dados.ElementAt(3).Cast<Atributo>().OrderBy(x => x.Descricao).Select(x => fabrica.Criar(x)).ToList();
            var retorno = new FiltrosPesquisa(listaFornecedores, listaSegmentos, listaMarcas)
            {
                AttrFornecedores = listaAttrForn
            };
            return retorno;
        }
        public static List<ComboFiltroVM> RetornaGruposCadastrados(IAppServicoCompra compraServico, FabricaViewModel fabrica)
        {
            return compraServico.RetornaGruposCadastrados().ElementAt(0).Cast<GrupoFilial>().Where(x => x.Ativo == true).Select(x => fabrica.Criar(x)).ToList();
        }

        public static List<GrupoDistribuicaoVM> RetornaGruposFiliaisDistribuicao(IAppServicoCompra compraServico, ParametrosVM parametroVM)
        {
            var filtro = Mapper.Map<ParametrosVM, Parametros>(parametroVM);
            var dados = compraServico.RetornaFiliaisDistribuicao(filtro).ElementAt(0).Cast<GrupoFilial>()
                .GroupBy(x => x.IDGrupo).Select(x => x.ToList()).ToList();
            var participacaoAcrescimo = AjustaParticipacaoGrupo(dados);
            var retorno = dados.Select(x => new GrupoDistribuicaoVM(x, participacaoAcrescimo)).ToList();
            return retorno;
        }

        public static FiltrosPesquisa RetornaDadosCadInicial(IAppServicoCompra compraServico, FabricaViewModel fabrica)
        {
            var dados = compraServico.RetornaCargaInicialCadNovo(new Parametros());
            var listaStatus = dados.ElementAt(0).Cast<StatusPedido>().Select(x => fabrica.Criar(x)).ToList();
            var listaFornecedores = dados.ElementAt(1).Cast<Fornecedor>().OrderBy(x => x.NomeFantasia).Select(x => fabrica.Criar(x)).ToList();

            var listaMarcas = dados.ElementAt(2).Cast<Marca>().OrderBy(x => x.Nome).Select(x => fabrica.Criar(x)).ToList();

            var listaSegmentos = dados.ElementAt(3).Cast<Segmento>().OrderBy(x => x.Descricao).Select(x => fabrica.Criar(x)).ToList();
            var dadosCores = dados.ElementAt(6).Cast<Cor>().ToList();
            ChecaCoresSemRgb(dadosCores);
            var dadosTamanho = dados.ElementAt(5).Cast<GrupoTamanho>().ToList();

            var gruposAtivo = RetornaGruposAtivos(dados.ElementAt(11).Cast<GrupoFilial>().ToList()).Select(x => new GruposValidadosVM(x)).ToList();
            var gruposRelacionadosDesativar = RetornaGruposRelacionados(dados.ElementAt(12).Cast<GrupoFilial>().ToList(), gruposAtivo);
            var listaForma = dados.ElementAt(7).Cast<FormaPgto>().OrderBy(x => x.DescricaoFormaPagamento).Select(x => fabrica.Criar(x)).ToList();
            var condicoesOrdenadas = dados.ElementAt(8).Cast<CondicaoPgto>().OrderBy(x => x.Condicao.Split('+').Length).Select(x => x).ToList();
            var listaClassificacao = dados.ElementAt(9).Cast<ClassificacaoFiscal>().OrderBy(x => x.CodigoFiscal).Select(x => fabrica.Criar(x)).ToList();
            var listaAttrProd = dados.ElementAt(13).Cast<Atributo>().OrderBy(x => x.Ordem).ToList();
            var listaAttrPed = dados.ElementAt(14).Cast<Atributo>().OrderBy(x => x.Ordem).ToList();
            var ordemPed = listaAttrPed.Where(x => x.IDTipoAtributo == x.IDTipoAtributoKey).Select(x => x.Lista).ToList();
            var ordemProd = listaAttrProd.Where(x => x.IDTipoAtributo == x.IDTipoAtributoKey).Select(x => x.Lista).ToList();
            var listaElemPed = compraServico.RetornaAtributosCampos(listaAttrPed).Select(x => new AtributoElementoVM(x));
            var listaElemProd = compraServico.RetornaAtributosCampos(listaAttrProd).Select(x => new AtributoElementoVM(x));
            var comboAttrPed = compraServico.RetornaAtributosTipoLista(listaAttrPed).Select(x => new ComboAtributoVM(x, fabrica));
            var comboAttrProd = compraServico.RetornaAtributosTipoLista(listaAttrProd).Select(x => new ComboAtributoVM(x, fabrica));
            var listaComprador = dados.ElementAt(15).Cast<Comprador>().OrderBy(x => x.Nome).Select(x => fabrica.Criar(x)).ToList();
            var listaMedida = dados.ElementAt(16).Cast<UnidadeMedida>().OrderBy(x => x.Descricao).Select(x => fabrica.Criar(x)).ToList();
            var configPadrao = dados.ElementAt(17).Cast<ConfigDefault>().FirstOrDefault();
            var datasCargaInicial = new DadosConfigPadraoVM(configPadrao);
            var listaTabelaPrecoEmpresa = dados.ElementAt(18).Cast<PrecoGrupoEmpresa>().GroupBy(x => x.IDGrupoEmpresa).Select(x => new GrupoEmpresaPrecosVM(x)).ToList();
            var listaCondicao = ComparaCondicaoPagamento(condicoesOrdenadas).Select(x => fabrica.Criar(x)).ToList();
            var listaCompradorProduto = dados.ElementAt(19).Cast<Comprador>().ToList();

            var filtrosPesquisa = new FiltrosPesquisa(compraServico, fabrica, dadosCores, listaFornecedores, listaSegmentos, listaMarcas, dadosTamanho, datasCargaInicial)
            {
                StatusPedido = listaStatus,
                GrupoEmpresaPrecos = listaTabelaPrecoEmpresa,
                Compradores = listaComprador,
                UniMedida = listaMedida,
                OrdemPed = ordemPed,
                OrdemProd = ordemProd,
                AttrEleListaProd = listaElemProd.ToList(),
                AttrEleListaPed = listaElemPed.ToList(),
                AttrListaProd = comboAttrProd.ToList(),
                AttrListaPed = comboAttrPed.ToList(),
                FormaPgto = listaForma,
                CondicaoPgto = listaCondicao,
                Classificacao = listaClassificacao,
                RelacionamentoGrupos = gruposRelacionadosDesativar
            };
            filtrosPesquisa.CompradoresProduto = listaCompradorProduto.Count > 0 ? listaCompradorProduto.OrderBy(x => x.Nome).Select(x => fabrica.Criar(x)).ToList() : null;
          
            return filtrosPesquisa;
        }

        public static RetornoProdutosVM RetornaProdutoFiltrado(IAppServicoCompra compraServico, ParametrosVM parametroVM)
        {
            
            var filtro = Mapper.Map<ParametrosVM, Parametros>(parametroVM);
            var dados = compraServico.BuscaProdutosFiltrados(filtro);
            var produtosRetorno = dados.ElementAt(0).Cast<DadosGerenciamentoProdutoCompra>();
            var paginasRetorno = RetonaListaPagina(dados.ElementAt(1).Cast<Paginas>().ToList());
            var listaRetorno = Mapper.Map<IEnumerable<DadosGerenciamentoProdutoCompra>, IEnumerable<ProdutosFiltradosVM>>(produtosRetorno).ToList();
             
            return new RetornoProdutosVM(listaRetorno, paginasRetorno);
        }

        public static FiltrosPesquisa RetornaEspeciesFiltradas(IAppServicoCompra compraServico, ParametrosVM parametroVM, FabricaViewModel fabrica)
        {
            var filtro = Mapper.Map<ParametrosVM, Parametros>(parametroVM);
            var dados = compraServico.RetornaCargaEspeciesFiltros(filtro);
            var especiesGrupo = dados.ElementAt(0).Cast<Especie>().OrderBy(x=>x.IDSecao)
                .GroupBy(x => x.IDSecao).Select(grp => grp.ToList());
            var attrSelForn = dados.ElementAt(2).Cast<Atributo>().ToList();
            var listaAttrProd = dados.ElementAt(1).Cast<Atributo>().OrderBy(x => x.Ordem).ToList();
            var ordemProd = listaAttrProd.Where(x => x.IDTipoAtributo == x.IDTipoAtributoKey).Select(x => x.Lista).ToList();
            var listaElemProd = compraServico.RetornaAtributosCampos(listaAttrProd).Select(x => new AtributoElementoVM(x));
            var comboAttrProd = compraServico.RetornaAtributosTipoLista(listaAttrProd).Select(x => new ComboAtributoVM(x, fabrica));
            List<RetornoEspecieFiltroVM> especieFiltroVMs = new List<RetornoEspecieFiltroVM>();
            foreach (List<Especie> especiesLista in especiesGrupo)
            {
                especieFiltroVMs.Add(new RetornoEspecieFiltroVM(especiesLista, fabrica));
            }
            var filtrosPesquisa = new FiltrosPesquisa(especieFiltroVMs)
            {
                AtributoFornecedor = attrSelForn.Count > 0 ? attrSelForn.Select(x => x.IDTipoAtributoKey).FirstOrDefault().ToString() : null,
                AtributoValor = attrSelForn.Count > 0 ? string.Join(",", attrSelForn.Select(x => x.IDTipoAtributo).ToArray()) : null,
                OrdemProd = ordemProd,
                AttrEleListaProd = listaElemProd.ToList(),
                AttrListaProd = comboAttrProd.ToList()
            };

            return filtrosPesquisa;
        }

        public static FiltrosPesquisa RetornaFiltrosCadProduto(IAppServicoCompra compraServico, ParametrosVM parametroVM, FabricaViewModel fabrica)
        {
            var filtro = Mapper.Map<ParametrosVM, Parametros>(parametroVM);
            var dadosProc = compraServico.AtualizaFiltrosCadastroProduto(filtro).ElementAt(0).Cast<CadastroProdutoSecaoEspecieMarcaFornecetor>();
            var dadosFornecedor = RetornaComboFornecedor(dadosProc, fabrica);
            var dadosMarcas = RetornaComboMarca(dadosProc, fabrica);
            var dadosSecao = RetornaComboSecao(dadosProc, fabrica);
            var dadosEspecies = RetornaComboEspecie(dadosProc, fabrica);

            var retorno = new FiltrosPesquisa(dadosFornecedor, dadosSecao, dadosMarcas)
            {
                Especies = dadosEspecies
            };
            return retorno;
        }

        public static FornecedorProdDadosVM RetornaDadosCompraFornecedor(IAppServicoCompra compraServico, ParametrosVM parametroVM)
        {
            var filtro = Mapper.Map<ParametrosVM, Parametros>(parametroVM);
            var dados = compraServico.RetornaInformacaoFornecedorCompra(filtro);
            //var dadosConfig = dados.ElementAt(0).Cast<ConfigDefault>().FirstOrDefault();
            var dadosFornecedorProd = dados.ElementAt(0).Cast<DadosCompraFornecedor>().FirstOrDefault();
            var dadosPagamento = dados.ElementAt(1).Cast<DadosUltimaCompra>().ToList();
            var dadosAttrForn = dados.ElementAt(2).Cast<Atributo>().ToList();
            //var datasCargaInicial = new DadosConfigPadraoVM(dadosConfig);
            return new FornecedorProdDadosVM(dadosPagamento, dadosFornecedorProd, dadosAttrForn);
        }

        public static RetornoPrePedidoVM RetornaDadosCadPrePedido(IAppServicoCompra compraServico, ParametrosVM parametroVM, FabricaViewModel fabrica)
        {
            var filtro = Mapper.Map<ParametrosVM, Parametros>(parametroVM);
            var dadoPre = compraServico.RetornaDadosPrePedido(filtro);
            var listaStatus = dadoPre.ElementAt(0).Cast<StatusPedido>().Select(x => fabrica.Criar(x)).ToList();
            var dadosCadastro = dadoPre.ElementAt(1).Cast<DadosPrePedido>().ElementAt(0);
            var dadosReferencia = dadoPre.ElementAt(2).Cast<ReferenciaProduto>().ToList();
            var dadosTamanho = dadoPre.ElementAt(3).Cast<GrupoTamanho>().ToList();
            var dadosCores = dadoPre.ElementAt(4).Cast<Cor>().ToList();
            ChecaCoresSemRgb(dadosCores);
            var gradePadrao = dadoPre.ElementAt(8).Cast<Grade>().ToList();
            ValidaTamanhoGrade(dadosTamanho, gradePadrao);
            ValidaCorGrade(dadosCores, gradePadrao);
            ValidaReferenciaGrade(dadosReferencia, gradePadrao);

            var gruposAtivo = RetornaGruposAtivos(dadoPre.ElementAt(9).Cast<GrupoFilial>().ToList()).Select(x => new GruposValidadosVM(x)).ToList(); ;
            var gruposRelacionadosDesativar = RetornaGruposRelacionados(dadoPre.ElementAt(10).Cast<GrupoFilial>().ToList(), gruposAtivo);

            var listaForma = dadoPre.ElementAt(5).Cast<FormaPgto>().OrderBy(x => x.DescricaoFormaPagamento).Select(x => fabrica.Criar(x)).ToList();
            var listaClassificacao = dadoPre.ElementAt(7).Cast<ClassificacaoFiscal>().OrderBy(x => x.CodigoFiscal).Select(x => fabrica.Criar(x)).ToList();
            var condicoesOrdenadas = dadoPre.ElementAt(6).Cast<CondicaoPgto>().OrderBy(x => x.Condicao.Split('+').Length).Select(x => x).ToList();
            var listaCondicao = ComparaCondicaoPagamento(condicoesOrdenadas).Select(x => fabrica.Criar(x)).ToList();
            var listaAttrProd = dadoPre.ElementAt(11).Cast<Atributo>().OrderBy(x => x.Ordem).ToList();
            var listaAttrPed = dadoPre.ElementAt(12).Cast<Atributo>().OrderBy(x => x.Ordem).ToList();
            var listaFornecedores = dadoPre.ElementAt(13).Cast<Fornecedor>().OrderBy(x => x.NomeFantasia).Select(x => fabrica.Criar(x)).ToList();
            var listaComprador = dadoPre.ElementAt(14).Cast<Comprador>().OrderBy(x => x.Nome).Select(x => fabrica.Criar(x)).ToList();
            var listaMedida = dadoPre.ElementAt(15).Cast<UnidadeMedida>().OrderBy(x => x.Descricao).Select(x => fabrica.Criar(x)).ToList();
            var configPadrao = dadoPre.ElementAt(16).Cast<ConfigDefault>().FirstOrDefault();
            var datasCargaInicial = new DadosConfigPadraoVM(configPadrao);
            var listaTabelaPrecoEmpresa = dadoPre.ElementAt(17).Cast<PrecoGrupoEmpresa>().GroupBy(x => x.IDGrupoEmpresa).Select(x => new GrupoEmpresaPrecosVM(x)).ToList();
            var ordemPed = listaAttrPed.Where(x => x.IDTipoAtributo == x.IDTipoAtributoKey).Select(x => x.Lista).ToList();
            var ordemProd = listaAttrProd.Where(x => x.IDTipoAtributo == x.IDTipoAtributoKey).Select(x => x.Lista).ToList();
            var listaElemPed = compraServico.RetornaAtributosCampos(listaAttrPed).Select(x => new AtributoElementoVM(x));
            var listaElemProd = compraServico.RetornaAtributosCampos(listaAttrProd).Select(x => new AtributoElementoVM(x));
            var comboAttrPed = compraServico.RetornaAtributosTipoLista(listaAttrPed).Select(x => new ComboAtributoVM(x, fabrica));
            var comboAttrProd = compraServico.RetornaAtributosTipoLista(listaAttrProd).Select(x => new ComboAtributoVM(x, fabrica));
            var listaCompradorProduto = dadoPre.ElementAt(18).Cast<Comprador>().ToList();

            var listaMarcas = dadoPre.ElementAt(19).Cast<Marca>().ToList();
            var filtrosPesquisa = new FiltrosPesquisa(dadosCadastro, compraServico, fabrica, dadosCores, dadosTamanho, dadosReferencia, datasCargaInicial)
            {
                StatusPedido = listaStatus,
                CompradoresProduto = listaCompradorProduto.Count > 0 ? listaCompradorProduto.OrderBy(x => x.Nome).Select(x => fabrica.Criar(x)).ToList() : null,
                GrupoEmpresaPrecos = listaTabelaPrecoEmpresa,
                Compradores = listaComprador,
                UniMedida = listaMedida,
                Fornecedores = listaFornecedores,
                OrdemPed = ordemPed,
                OrdemProd = ordemProd,
                AttrEleListaProd = listaElemProd.ToList(),
                AttrEleListaPed = listaElemPed.ToList(),
                AttrListaProd = comboAttrProd.ToList(),
                AttrListaPed = comboAttrPed.ToList(),
                FormaPgto = listaForma,
                CondicaoPgto = listaCondicao,
                Classificacao = listaClassificacao,
                RelacionamentoGrupos = gruposRelacionadosDesativar
            };
            if (!dadosCadastro.Ativo)
            {
                filtrosPesquisa.Marcas = listaMarcas.OrderBy(x => x.Nome).Select(x => fabrica.Criar(x)).ToList();
            }


            return new RetornoPrePedidoVM(filtrosPesquisa, dadosCadastro, gradePadrao);
        }


        public static List<ComboFiltroVM> RetornaTamanhoDadosNovo(IAppServicoCompra compraServico, ParametrosVM parametroVM, FabricaViewModel fabrica)
        {
            var filtro = Mapper.Map<ParametrosVM, Parametros>(parametroVM);
            var dadosTamanho = compraServico.AtualizaCargaTamanho(filtro).Select(x => fabrica.Criar(x)).ToList();
            return dadosTamanho;
        }
        public static List<ImagensProdutoVM> RecuperaFotosProduto(IAppServicoCompra compraServico, ParametrosVM parametroVM)
        {
            var filtro = Mapper.Map<ParametrosVM, Parametros>(parametroVM);
            var dadosImagem = Mapper.Map<List<FotoProduto>, List<ImagensProdutoVM>>(compraServico.RetornaFotosProduto(filtro));
            return dadosImagem;
        }
        public static ImagensProdutoVM SalvarFotosProduto(IAppServicoCompra compraServico, ImagensProdutoVM imagemVM)
        {
            var fotoJson = Mapper.Map<ImagensProdutoVM, FotoProduto>(imagemVM);
            return Mapper.Map<FotoProduto, ImagensProdutoVM>(compraServico.SalvarFotosProduto(fotoJson));
        }
        public static int GravarPedido(IAppServicoCompra compraServico, PedidoCompletoVM pedidoCompleto, log4net.ILog log)
        {
            var pedidoJson = pedidoCompleto.RetornaJsonPedido(new PropertyRenameAndIgnoreSerializerContractResolver());
            log.Debug("Json Gerado - Enviando ao Banco");
            var idPedido = compraServico.GravarPedido(pedidoJson);
            log.Debug("Pedido Gerado: " + idPedido);
            return idPedido;
            //compraServico.SalvarFotosProduto(fotoJson);
        }

        #region Métodos de Manipulação de Objetos
        private static List<ComboFiltroVM> RetornaComboFornecedor(IEnumerable<CadastroProdutoSecaoEspecieMarcaFornecetor> dados, FabricaViewModel fabrica)
        {
            try
            {
                return dados.GroupBy(x => new { x.IDFornecedor, x.CNPJ, x.RazaoSocial, x.NomeFantasia })
                .Select(grp => fabrica.Criar(
                    new Fornecedor()
                    {
                        IDFornecedor = grp.Key.IDFornecedor,
                        CNPJ = grp.Key.CNPJ,
                        RazaoSocial = grp.Key.RazaoSocial,
                        NomeFantasia = grp.Key.NomeFantasia
                    })).ToList();
            }
            catch (Exception ex)
            {
                throw new Exception("GerenciadorAplicacaoCompra.RetornaComboFornecedor: \n" + ex.Message);
            }
        }
        private static List<ComboFiltroVM> RetornaComboMarca(IEnumerable<CadastroProdutoSecaoEspecieMarcaFornecetor> dados, FabricaViewModel fabrica)
        {
            try
            {
                return dados.GroupBy(x => new { x.IDMarca, x.DescricaoMarca })
                .Select(grp => fabrica.Criar(
                    new Marca()
                    {
                        IDMarca = grp.Key.IDMarca,
                        Nome = grp.Key.DescricaoMarca
                    })).ToList();
            }
            catch (Exception ex)
            {
                throw new Exception("GerenciadorAplicacaoCompra.RetornaComboMarca: \n" + ex.Message);
            }
        }
        private static List<ComboFiltroVM> RetornaComboEspecie(IEnumerable<CadastroProdutoSecaoEspecieMarcaFornecetor> dados, FabricaViewModel fabrica)
        {
            try
            {
                return dados.GroupBy(x => new { x.IDEspecie, x.DescricaoEspecie, x.DescricaoSecao })
                .Select(grp => fabrica.Criar(
                    new Especie()
                    {
                        DescricaoSecao = grp.Key.DescricaoSecao,
                        IDEspecie = grp.Key.IDEspecie,
                        DescricaoEspecie = grp.Key.DescricaoEspecie
                    })).ToList();
            }
            catch (Exception ex)
            {
                throw new Exception("GerenciadorAplicacaoCompra.RetornaComboEspecie: \n" + ex.Message);
            }
        }
        private static List<ComboFiltroVM> RetornaComboSecao(IEnumerable<CadastroProdutoSecaoEspecieMarcaFornecetor> dados, FabricaViewModel fabrica)
        {
            try
            {
                return dados.GroupBy(x => new { x.IDSecao, x.DescricaoSecao })
                .Select(grp => fabrica.Criar(
                    new Secao()
                    {
                        IDSecao = grp.Key.IDSecao,
                        Descricao = grp.Key.DescricaoSecao
                    })).ToList();
            }
            catch (Exception ex)
            {
                throw new Exception("GerenciadorAplicacaoCompra.RetornaComboSecao: \n" + ex.Message);
            }
        }
        private static List<CondicaoPgto> ComparaCondicaoPagamento(List<CondicaoPgto> condicoes)
        {
            condicoes.Sort(delegate (CondicaoPgto x, CondicaoPgto y)
            {
                var condicaoArray1 = x.Condicao.Split('+').ToList();
                var condicaoArray2 = y.Condicao.Split('+').ToList();
                if (condicaoArray1.Count > condicaoArray2.Count) return -1;
                else if (condicaoArray1.Count < condicaoArray2.Count) return 1;
                else return OrdenaCondicaoPagamento(condicaoArray1, condicaoArray2);
            });
            return condicoes;
        }
        private static int OrdenaCondicaoPagamento(List<string> condicoe1, List<string> condicoe2)
        {
            var retorno = 0;
            for (int i = 0; i < condicoe1.Count; i++)
            {
                if (int.Parse(condicoe1[i]) > int.Parse(condicoe2[i])) retorno = -1;
                else if (int.Parse(condicoe1[i]) < int.Parse(condicoe2[i])) retorno = 1;
                if (retorno != 0) break;
            }
            return retorno;
        }
        private static decimal AjustaParticipacaoGrupo(IEnumerable<List<GrupoFilial>> listaGrupo)
        {
            var participacaoTotal = listaGrupo.Sum(x => x.ElementAt(0).ParticipacaoGrupo);
            var participacaoDistribuir = listaGrupo.Count() > 0 ? (100 - participacaoTotal) / listaGrupo.Count() : 0;
            return participacaoDistribuir;
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
        private static void ValidaTamanhoGrade(List<GrupoTamanho> tamanhos, List<Grade> produtoItems)
        {
            var valido = true;
            var tamanhosPedido = produtoItems.Select(x => new { x.IDTamanho, x.DescricaoTamanho, x.Ordem }).Distinct().ToList();
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
                        Ordem = tamanhosPedido[i].Ordem,
                        ForaGrade = true
                    });
                    //throw new Exception("Tamanhos retornados no pedido é incompativel com os tamanhos disponível para escolha. \r\n Tamanho divergente:" + tamanhosPedido[i]);

                }
            }
        }
        private static void ValidaCorGrade(List<Cor> cores, List<Grade> produtoItems)
        {
            var valido = true;
            var coresPedido = produtoItems.Select(x => new { x.IDCor, x.DescricaoCor }).Distinct().ToList();
            for (int i = 0; i < coresPedido.Count; i++)
            {

                var corPaleta = cores.SingleOrDefault(x => x.Descricao.Trim().ToUpper() == coresPedido[i].DescricaoCor.Trim().ToUpper() &&
                                 x.IDCor == coresPedido[i].IDCor);
                if (corPaleta != null)
                    corPaleta.VisivelSelecao = true;
                else
                    valido = cores.Select(x => x.Descricao.Trim().ToUpper()).ToList().Contains(coresPedido[i].DescricaoCor.ToUpper());
                if (!valido)
                {
                    cores.Add(new Cor
                    {
                        IDCor = coresPedido[i].IDCor,
                        Descricao = coresPedido[i].DescricaoCor,
                        CorRGB = "gradeInvalida",
                        VisivelSelecao = true
                    });
                    // throw new Exception("Cores retornadas no pedido é incompativel com as cores disponível para escolha. \r\n Cor divergente:" + coresPedido[i]);

                }
            }
        }
        private static void ValidaReferenciaGrade(List<ReferenciaProduto> referencias, List<Grade> produtoItems)
        {
            var valido = true;
            var referenciasPedido = produtoItems.Select(x => x.Referencia.Trim()).Distinct().ToList();
            for (int i = 0; i < referenciasPedido.Count; i++)
            {
                valido = referencias.Select(x => x.Referencia.Trim().ToUpper()).ToList().Contains(referenciasPedido[i].ToUpper());
                if (!valido)
                {
                    referencias.Add(new ReferenciaProduto
                    {
                        Referencia = referenciasPedido[i]
                    });
                    //throw new Exception("Referências retornadas no pedido é incompativel com as referências disponível para escolha. \r\n Referência divergente:" + referenciasPedido[i]);

                }
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
        private static List<PaginasGridVM> RetonaListaPagina(List<Paginas> paginas)
        {
            var retorno = new List<PaginasGridVM>();
            if (paginas.Count > 1)
            {
                retorno = paginas.Select(x => new PaginasGridVM(x)).ToList();
            }
            return retorno;
        }
        #endregion
    }
}
