using AutoMapper;
using Newtonsoft.Json;
using Nextt_Gestao_Compra.Aplicacao.Servicos.Interfaces.Gerenciamento;
using Nextt_Gestao_Compra.Aplicacao.ViewModel;
using Nextt_Gestao_Compra.Dominio.Entidades;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Nextt_Gestao_Compra.Aplicacao.Gerenciador.Produto
{
    public class GerenciadorAplicacaoProduto
    {
        public static RetornoPrePedidoVM RetornaDadosProdutoEditar(IAppServicoProduto produtoServico, ParametrosVM parametroVM, FabricaViewModel fabrica)
        {
            var filtro = Mapper.Map<ParametrosVM, Parametros>(parametroVM);
            var dadoProd = produtoServico.RetornaDadosProdutoEditar(filtro);
            var dadosCadastro = dadoProd.ElementAt(0).Cast<DadosPrePedido>().ElementAt(0);
            var dadosReferencia = dadoProd.ElementAt(1).Cast<ReferenciaProduto>().ToList();
            var dadosTamanho = dadoProd.ElementAt(2).Cast<GrupoTamanho>().ToList();
            var dadosCores = dadoProd.ElementAt(3).Cast<Cor>().ToList();
            ChecaCoresSemRgb(dadosCores);
            var gradePadrao = dadoProd.ElementAt(5).Cast<Grade>().ToList();
            ValidaTamanhoGrade(dadosTamanho, gradePadrao);
            ValidaCorGrade(dadosCores, gradePadrao);
            ValidaReferenciaGrade(dadosReferencia, gradePadrao);


            var listaClassificacao = dadoProd.ElementAt(4).Cast<ClassificacaoFiscal>().OrderBy(x => x.CodigoFiscal).Select(x => fabrica.Criar(x)).ToList();
            var listaAttrProd = dadoProd.ElementAt(6).Cast<Atributos>().OrderBy(x => x.Ordem).ToList();
            var listaComprador = dadoProd.ElementAt(7).Cast<Comprador>().OrderBy(x => x.Nome).Select(x => fabrica.Criar(x)).ToList();
            var listaMedida = dadoProd.ElementAt(8).Cast<UnidadeMedida>().OrderBy(x => x.Descricao).Select(x => fabrica.Criar(x)).ToList();
            var ordemProd = listaAttrProd.Where(x => x.IDTipoAtributo == x.IDTipoAtributoKey).Select(x => x.Lista).ToList();
            var listaElemProd = produtoServico.RetornaAtributosCampos(listaAttrProd).Select(x => new AtributoElementoVM(x));
            var comboAttrProd = produtoServico.RetornaAtributosTipoLista(listaAttrProd).Select(x => new ComboAtributoVM(x, fabrica));
            var listaTabelaPrecoEmpresa = dadoProd.ElementAt(9).Cast<PrecoGrupoEmpresa>().GroupBy(x => x.IDGrupoEmpresa).Select(x => new GrupoEmpresaPrecosVM(x)).ToList();

            var filtrosPesquisa = new FiltrosPesquisa(dadosCadastro, produtoServico, fabrica, dadosCores, dadosTamanho, dadosReferencia)
            {
                GrupoEmpresaPrecos=listaTabelaPrecoEmpresa,
                Compradores = listaComprador,
                UniMedida = listaMedida,
                OrdemProd = ordemProd,
                AttrEleListaProd = listaElemProd.ToList(),
                AttrListaProd = comboAttrProd.ToList(),
                Classificacao = listaClassificacao,
            };


            return new RetornoPrePedidoVM(filtrosPesquisa, dadosCadastro, gradePadrao);
        }
        
        public static int GravarProduto(IAppServicoProduto produtoServico, ProdutoCadastroVM produtoCompleto, log4net.ILog log)
        {
            var produtoJson = JsonConvert.SerializeObject(produtoCompleto);
            log.Debug("Json Gerado - Enviando ao Banco");
            var idProduto = produtoServico.GravarProduto(produtoJson);
            log.Debug("Produto Gerado: " + idProduto);
            return idProduto;
            //compraServico.SalvarFotosProduto(fotoJson);
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
        private static void ChecaCoresSemRgb(List<Cor> cores)
        {
            var coresSemRgb = cores.Where(x => x.CorRGB.Length == 0).ToList();

            if (coresSemRgb.Count() > 0)
            {
                throw new Exception("Exitem cores retornadas que não possuem RGB. \r\n Cores sem rgb:" +
                     String.Join(", ", coresSemRgb.Select(x => x.Descricao).ToList()));

            }

        }

    }
}
