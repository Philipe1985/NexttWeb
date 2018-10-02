using AutoMapper;
using Nextt_Gestao_Compra.Aplicacao.Servicos.Interfaces.Gerenciamento;
using Nextt_Gestao_Compra.Aplicacao.ViewModel;
using Nextt_Gestao_Compra.Dominio.Entidades;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Nextt_Gestao_Compra.Aplicacao.Gerenciador.Pedido
{
    public class GerenciadorAplicacaoPedido
    {
        public static FiltrosPesquisa RetornaFiltroInicial(IAppServicoPedido pedidoServico, FabricaViewModel fabrica)
        {
            var dados = pedidoServico.CarregaFiltrosPesquisaPedido();

            var listaFornecedores = dados.ElementAt(0).Cast<Fornecedor>().OrderBy(x => x.NomeFantasia).Select(x => fabrica.Criar(x)).ToList();

            var listaMarcas = dados.ElementAt(1).Cast<Marca>().OrderBy(x => x.Nome).Select(x => fabrica.Criar(x)).ToList();

            var listaSecoes = dados.ElementAt(2).Cast<Secao>().OrderBy(x => x.Descricao).Select(x => fabrica.Criar(x)).ToList();
            var listaUsuarios = dados.ElementAt(3).Cast<UsuarioGerenciamento>().OrderBy(x => x.NomeUsuario).Select(x => fabrica.Criar(x)).ToList();
            var retorno = new FiltrosPesquisa(listaFornecedores, listaSecoes, listaMarcas)
            {
                Usuarios = listaUsuarios
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

            var listaForma = dados.ElementAt(4).Cast<FormaPgto>().OrderBy(x => x.DescricaoFormaPagamento).Select(x => x).ToList();
            var condicoesOrdenadas = dados.ElementAt(5).Cast<CondicaoPgto>().OrderBy(x => x.Condicao.Split('+').Length).Select(x => fabrica.Criar(x)).ToList();
            var listaClassificacao = dados.ElementAt(6).Cast<ClassificacaoFiscal>().OrderBy(x => x.CodigoFiscal).Select(x => fabrica.Criar(x)).ToList();
            var listaDistribuicaoPackAgrupado = dados.ElementAt(8).Cast<GrupoFilial>().OrderBy(x => x.Pack).GroupBy(x => x.Pack).Select(x => x.ToList());
            var dadosGrade = dados.ElementAt(9).Cast<Grade>().ToList();
            var filtrosPesquisa = new FiltrosPesquisa(dadosPedido, fabrica, dadosCores, pedidoServico)
            {
                Referencias = dadosReferenciaProduto.Select(x => fabrica.Criar(x)).ToList(),
                TamanhoOpcoes = dadosTamanho.Select(x => fabrica.Criar(x)).ToList(),
                FormaPgto = listaForma.Select(x => fabrica.Criar(x)).ToList(),
                Classificacao = listaClassificacao,
                CondicaoPgto = condicoesOrdenadas
            };
            var retorno = new RetornoPedidoAnalitico(dadosPedido, filtrosPesquisa)
            {
                CoresSelecionadas = String.Join(",", listaItensPackAgrupado.ElementAt(0).Select(x => x.DescricaoCor.Trim()).Distinct().ToList()),
                ReferenciasSelecionadas = String.Join(",", listaItensPackAgrupado.ElementAt(0).Select(x => x.ReferenciaItem.Trim()).Distinct().ToList()),
                FormasSelecionadas = String.Join(",", listaForma.Where(x => x.ContemPedido == true).Select(x => x.IDFormaPagamento).ToList()),
                TamanhosSelecionadas = String.Join(",", listaItensPackAgrupado.ElementAt(0).Select(x => x.DescricaoTamanho.Trim()).Distinct().ToList())
            };
            for (int i = 0; i < listaItensPackAgrupado.Count(); i++)
            {
                retorno.Packs.Add(new PackVM(listaItensPackAgrupado.ElementAt(i), listaDistribuicaoPackAgrupado.ElementAt(i)));
            }
            return retorno;
        }
        private static void ValidaTamanhoPedido(List<GrupoTamanho> tamanhos, List<ProdutoItem> produtoItems)
        {
            var valido = true;
            var tamanhosPedido = produtoItems.Select(x => x.DescricaoTamanho.Trim().ToUpper()).Distinct().ToList();
            for (int i = 0; i < tamanhosPedido.Count; i++)
            {
                valido = tamanhos.Select(x => x.Descricao.Trim().ToUpper()).ToList().Contains(tamanhosPedido[i]);
                if (!valido)
                {
                    throw new Exception("Tamanhos retornados no pedido é incompativel com os tamanhos disponível para escolha. \r\n Tamanho divergente:" + tamanhosPedido[i]);

                }
            }
        }
        private static void ValidaCorPedido(List<Cor> cores, List<ProdutoItem> produtoItems)
        {
            var valido = true;
            var coresPedido = produtoItems.Select(x => x.DescricaoCor.Trim().ToUpper()).Distinct().ToList();
            for (int i = 0; i < coresPedido.Count; i++)
            {
                valido = cores.Where(x => x.VisivelSelecao == true).Select(x => x.Descricao.Trim().ToUpper()).ToList().Contains(coresPedido[i]);
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
    }
}
