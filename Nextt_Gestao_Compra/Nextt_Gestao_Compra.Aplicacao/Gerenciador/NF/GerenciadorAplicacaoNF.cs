using AutoMapper;
using Newtonsoft.Json;
using Nextt_Gestao_Compra.Aplicacao.Servicos.Interfaces.Gerenciamento;
using Nextt_Gestao_Compra.Aplicacao.Utils;
using Nextt_Gestao_Compra.Aplicacao.ViewModel;
using Nextt_Gestao_Compra.Dominio.Entidades;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Nextt_Gestao_Compra.Aplicacao.Gerenciador.NF
{
    public class GerenciadorAplicacaoNF
    {
        public static FiltrosPesquisa RetornaDadosFiltroInicial(IAppServicoNotaFiscal nfServico, FabricaViewModel fabrica)
        {
            var dados = nfServico.CarregaFiltrosPesquisaNF();

            var listaFornecedores = dados.ElementAt(0).Cast<Fornecedor>().OrderBy(x => x.NomeFantasia).Select(x => fabrica.Criar(x)).ToList();
            var listaSegmentos = dados.ElementAt(1).Cast<Segmento>().OrderBy(x => x.Descricao).Select(x => fabrica.Criar(x)).ToList();
            var listaFiliais = dados.ElementAt(2).Cast<GrupoFilial>().Select(x => fabrica.CriarComboFilial(x)).ToList();
            var listaStatus = dados.ElementAt(3).Cast<StatusNF>().OrderBy(x => x.Descricao).Select(x => fabrica.Criar(x)).ToList();
            var retorno = new FiltrosPesquisa()
            {
                Fornecedores = listaFornecedores,
                Filiais = listaFiliais,
                Segmentos = listaSegmentos,
                StatusNota = listaStatus
            };
            return retorno;
        }
        public static FiltrosPesquisa RetornaCadastroFiltroInicial(IAppServicoNotaFiscal nfServico, FabricaViewModel fabrica)
        {
            var dados = nfServico.CarregaFiltrosCadastroNF();

            var listaFornecedores = dados.ElementAt(0).Cast<Fornecedor>().OrderBy(x => x.NomeFantasia).Select(x => fabrica.Criar(x)).ToList();
            var listaSegmentos = dados.ElementAt(1).Cast<Segmento>().OrderBy(x => x.Descricao).Select(x => fabrica.Criar(x)).ToList();
            var listaFiliais = dados.ElementAt(2).Cast<GrupoFilial>().Select(x => fabrica.CriarComboFilial(x)).ToList();
            var listaStatusNF = dados.ElementAt(3).Cast<StatusNF>().OrderBy(x => x.Descricao).Select(x => fabrica.Criar(x)).ToList();
            var listaMarcas = dados.ElementAt(4).Cast<Marca>().OrderBy(x => x.Nome).Select(x => fabrica.Criar(x)).ToList();

            var listaStatus = dados.ElementAt(5).Cast<StatusPedido>().OrderBy(x => x.Descricao).Select(x => fabrica.Criar(x)).ToList();
            var retorno = new FiltrosPesquisa()
            {
                Fornecedores = listaFornecedores,
                Filiais = listaFiliais,
                Segmentos = listaSegmentos,
                StatusPedido = listaStatus,
                Marcas = listaMarcas,
                StatusNota = listaStatusNF
            };
            return retorno;
        }
        public static List<EntradasNFVM> RetornaEntradasFiltradas(IAppServicoNotaFiscal nfServico, ParametroNotaVM parametro)
        {
            var json = parametro.RetornaJsonParametroConsultaEntrada();
            return nfServico.BuscaEntradasFiltradas(json).ElementAt(0).Cast<EntradaNF>().Select(x => Mapper.Map<EntradaNF, EntradasNFVM>(x)).ToList();
        }
        public static List<PedidosFiltradoVM> RetornaPedidosFiltrados(IAppServicoNotaFiscal nfServico, ParametroNotaVM parametro)
        {
            var json = parametro.RetornaJsonParametroConsultaPedido();
            return nfServico.BuscaPedidosFiltrados(json).ElementAt(0).Cast<PedidoConsulta>().OrderBy(x => x.Ordem).Select(x => Mapper.Map<PedidoConsulta, PedidosFiltradoVM>(x)).ToList();
        }
        public static List<TituloNFVM> GeraTitulosEntrada(IAppServicoNotaFiscal nfServico, ObjSalvarTituloVM parametro)
        {
            var json = parametro.RetornaJsonGeraTitulo(); 
            return nfServico.GeraTituloEntradaNF(json).ElementAt(0).Cast<TituloNF>().OrderBy(x => x.Sequencial).Select(x => new TituloNFVM(x)).ToList();
        }
        public static string ConfirmarTitulosEntrada(IAppServicoNotaFiscal nfServico, ObjSalvarTituloVM parametro)
        {
            var json = parametro.RetornaJsonConfirmaTitulo();
            return nfServico.ConfirmaTituloEntradaNF(json).ElementAt(0).Cast<EntradaNF>().FirstOrDefault().MensagemErro;
        }
        public static EntradaCadastradaRetornoVM RetornaEntradaCadastrada(IAppServicoNotaFiscal nfServico, string idNota, FabricaViewModel fabrica)
        {
            var dados = nfServico.BuscaEntradaCadastrada(idNota);
            var entradaRetorno = dados.ElementAt(0).Cast<EntradaNF>().Select(x => Mapper.Map<EntradaNF, EntradasNFVM>(x)).FirstOrDefault();
            var listaItensPackEntrada = dados.ElementAt(2).Cast<ProdutoItem>().ToList();
            var valPadraoDuplicata = dados.ElementAt(4).Cast<DuplicataDadosPadrao>().FirstOrDefault();
            var listaPedidoPackAgrupado = dados.ElementAt(1).Cast<ProdutoItem>()
                .OrderBy(x => x.IDPedido).ThenBy(x => x.Pack)
                .GroupBy(x => x.IDPedido).Select(x => new EntradaNFPedidoPackVM(x.ToList(), listaItensPackEntrada));
            var duplicata = new DadosDuplicataVM
            {
                DescontosAcrescimosPadrao = dados.ElementAt(9).Cast<DescontoAcrescimoNF>().Select(x => new DescontoAcrescimoPadraoVM(x)).ToList(),
                Plano = valPadraoDuplicata.PlanoDefault,
                IDFormaPagamento = valPadraoDuplicata.IDFormaPagamentoDefault.ToString(),
                IDGrupoEmpresaFaturamento = valPadraoDuplicata.IDGrupoEmpresaDefault.ToString(),
                GrupoEmpresas = dados.ElementAt(7).Cast<GrupoEmpresa>().OrderBy(x => x.IDGrupoEmpresa).Select(x => fabrica.Criar(x)).ToList(),
                PedidosDuplicata = dados.ElementAt(8).Cast<ProdutoItem>().OrderBy(x => x.IDPedido).Select(x => new PackVM(x)).ToList(),
                DescontosAcrescimos = dados.ElementAt(5).Cast<DescontoAcrescimoNF>().Where(x => x.Ativo).Select(x => fabrica.Criar(x)).ToList(),
                DocumentosTitulo = dados.ElementAt(3).Cast<TituloNF>().OrderBy(x => x.Sequencial).Select(x => new TituloNFVM(x)).ToList(),
                FormaPgto = dados.ElementAt(6).Cast<FormaPgto>().OrderBy(x => x.DescricaoFormaPagamento).Select(x => fabrica.Criar(x)).ToList()
            };
            return new EntradaCadastradaRetornoVM(entradaRetorno, listaPedidoPackAgrupado.ToList(), duplicata);
        }
        public static EntradaCadastradaRetornoVM RetornaPacksPedido(IAppServicoNotaFiscal nfServico, PedidoNFVM pedido)
        {
            var pedidoJson = pedido.RetornaJSONConsulta();


            var dados = nfServico.BuscaPedidosPack(pedidoJson);
            //var entradaRetorno = dados.ElementAt(0).Cast<EntradaNF>().Select(x => Mapper.Map<EntradaNF, EntradasNFVM>(x)).FirstOrDefault();
            var listaItensPackEntrada = dados.ElementAt(1).Cast<ProdutoItem>().ToList();
            var listaPedidoPackAgrupado = dados.ElementAt(0).Cast<ProdutoItem>()
                .OrderBy(x => x.IDPedido).ThenBy(x => x.Pack)
                .GroupBy(x => x.IDPedido).Select(x => new EntradaNFPedidoPackVM(x.ToList(), listaItensPackEntrada));

            return new EntradaCadastradaRetornoVM(listaPedidoPackAgrupado.ToList());
        }
        public static string GravarEntradaNF(IAppServicoNotaFiscal nfServico, ObjEntradasSalvarVM parametro)
        {
            if (string.IsNullOrEmpty(parametro.NFFornecedor.ElementAt(0).IDNFFornecedor))
                parametro.NFFornecedor.ElementAt(0).IDNFFornecedor = Guid.NewGuid().ToString();
            var entradaJson = JsonConvert.SerializeObject(parametro);
            return nfServico.GravarEntradaNF(entradaJson).ElementAt(0).Cast<EntradaNF>().FirstOrDefault().MensagemErro;
        }
        public static string AtualizaStatusEntrada(IAppServicoNotaFiscal nfServico, ObjEntradasSalvarVM parametro)
        {

            var entradaJson = parametro.RetornaJsonParametroAtualizaStatusEntrada();
            return nfServico.AtualizaStatusEntradaNF(entradaJson).ElementAt(0).Cast<EntradaNF>().FirstOrDefault().MensagemErro;
        }
        
        public static List<PackVM> RetornaPacksPedidoAdd(IAppServicoNotaFiscal nfServico, ParametroNotaVM parametro)
        {
            var packJson = parametro.RetornaJsonParametroAddPackPedido();


            var dados = nfServico.BuscaPackAddPedidos(packJson);
            var listaRetorno = new List<PackVM>();
            foreach (var item in dados)
            {
                var listaItens = item.Cast<ProdutoItem>().ToList();
                if (listaItens.Count > 0)
                    listaRetorno.Add(new PackVM(parametro.Tipo, listaItens));
            }

            return listaRetorno;
        }
    }
}