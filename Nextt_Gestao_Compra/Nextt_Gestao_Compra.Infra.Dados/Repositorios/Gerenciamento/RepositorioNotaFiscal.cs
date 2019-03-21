using Nextt_Gestao_Compra.Dominio.Entidades;
using Nextt_Gestao_Compra.Dominio.Interfaces.Repositorio.Gerenciamento;
using Nextt_Gestao_Compra.Infra.Dados.Utils;
using System;
using System.Collections;
using System.Collections.Generic;

namespace Nextt_Gestao_Compra.Infra.Dados.Repositorios.Gerenciamento
{
    public class RepositorioNotaFiscal : RepositorioPadrao<Parametros>, IRepositorioNotaFiscal
    {
        public List<IEnumerable> AtualizaStatusEntradaNF(string entradaNF)
        {
            try
            {
                return _Db.MultiplosResults("[dbo].[pr_gc_atualiza_status_nf_fornecedor]" +
                                     " @JSON = '" + entradaNF + "'")
                                     .With<EntradaNF>()
                                     .Executar();
            }
            catch (Exception ex)
            {
                throw new Exception("RepositorioNotaFiscal.BuscaEntradasFiltradas: \n" + ex.Message, ex);
            }

        }

        public List<IEnumerable> BuscaEntradaCadastrada(string idNota)
        {
            try
            {
                return _Db.MultiplosResults("[dbo].[pr_gc_carrega_dados_cadastrados_nf_fornecedor] '" + idNota + "'")
                                    .With<EntradaNF>()
                                    .With<ProdutoItem>()
                                    .With<ProdutoItem>()
                                    .With<TituloNF>()
                                    .With<DuplicataDadosPadrao>()
                                    .With<DescontoAcrescimoNF>()
                                    .With<FormaPgto>()
                                    .With<GrupoEmpresa>()
                                    .With<ProdutoItem>()
                                    .With<DescontoAcrescimoNF>()
                                    .Executar();
            }
            catch (Exception ex)
            {
                throw new Exception("RepositorioNotaFiscal.BuscaEntradaCadastrada: \n" + ex.Message, ex);
            }
        }

        public List<IEnumerable> BuscaEntradasFiltradas(string parametroJson)
        {
            try
            {
                return _Db.MultiplosResults("[dbo].[pr_gc_consulta_nf_fornecedor]" +
                                    " @JSON = '" + parametroJson + "'")
                                    .With<EntradaNF>()
                                    .Executar();
            }
            catch (Exception ex)
            {
                throw new Exception("RepositorioNotaFiscal.BuscaEntradasFiltradas: \n" + ex.Message, ex);
            }
        }

        public List<IEnumerable> BuscaPackAddPedidos(string parametroJson)
        {
            try
            {
                return _Db.MultiplosResults("[dbo].[pr_gc_carrega_pack_pedido]" +
                                    " @JSON = '" + parametroJson + "'")
                                    .With<ProdutoItem>()
                                    .Executar(true);
            }
            catch (Exception ex)
            {
                throw new Exception("RepositorioNotaFiscal.BuscaPackAddPedidos: \n" + ex.Message, ex);
            }
        }

        public List<IEnumerable> BuscaPedidosFiltrados(string parametroJson)
        {
            try
            {
                return _Db.MultiplosResults("[dbo].[pr_gc_consulta_pedido_fornecedor]" +
                                    " @JSON = '" + parametroJson + "'")
                                    .With<PedidoConsulta>()  
                                    .Executar();
            }
            catch (Exception ex)
            {
                throw new Exception("RepositorioNotaFiscal.BuscaPedidosFiltrados: \n" + ex.Message, ex);
            }
        }

        public List<IEnumerable> BuscaPedidosPack(string parametroJson)
        {
            try
            {
                return _Db.MultiplosResults("[dbo].[pr_gc_carrega_pedidos_packs]" +
                                    " @JSON = '" + parametroJson + "'")
                                    .With<ProdutoItem>()
                                    .With<ProdutoItem>()
                                    .Executar();
            }
            catch (Exception ex)
            {
                throw new Exception("RepositorioNotaFiscal.BuscaPedidosPack: \n" + ex.Message, ex);
            }
        }

        public List<IEnumerable> CarregaFiltrosCadastroNF()
        {
            try
            {
                return _Db.MultiplosResults("[dbo].[pr_gc_retorna_filtros_pesquisa_nf_fornecedor] 0")
                                    .With<Fornecedor>()
                                    .With<Segmento>()
                                    .With<GrupoFilial>()
                                    .With<StatusNF>()
                                    .With<Marca>()
                                    .With<StatusPedido>()
                                    .Executar();
            }
            catch (Exception ex)
            {
                throw new Exception("RepositorioNotaFiscal.CarregaFiltrosCadastroNF: \n" + ex.Message, ex);
            }
        }

        public List<IEnumerable> CarregaFiltrosPesquisaNF()
        {
            try
            {
                return _Db.MultiplosResults("[dbo].[pr_gc_retorna_filtros_pesquisa_nf_fornecedor]")
                                    .With<Fornecedor>()
                                    .With<Segmento>()
                                    .With<GrupoFilial>()
                                    .With<StatusNF>()
                                    .Executar();
            }
            catch (Exception ex)
            {
                throw new Exception("RepositorioNotaFiscal.CarregaFiltrosPesquisaNF: \n" + ex.Message, ex);
            }
        }

        public List<IEnumerable> ConfirmaTituloEntradaNF(string titNF)
        {
            try
            {
                return _Db.MultiplosResults("[dbo].[pr_gc_gravar_titulo_pagar_nf_fornecedor]" +
                                     " @JSON = '" + titNF + "'")
                                     .With<EntradaNF>()
                                     .Executar();
            }
            catch (Exception ex)
            {
                throw new Exception("RepositorioNotaFiscal.BuscaEntradasFiltradas: \n" + ex.Message, ex);
            }
        }

        public List<IEnumerable> GeraTituloEntradaNF(string titNF)
        {
            try
            {
                return _Db.MultiplosResults("[dbo].[pr_GC_gerar_titulo_pagar_nf_fornecedor]" +
                                     " @JSON = '" + titNF + "'")
                                     .With<TituloNF>()
                                     .Executar();
            }
            catch (Exception ex)
            {
                throw new Exception("RepositorioNotaFiscal.BuscaEntradasFiltradas: \n" + ex.Message, ex);
            }
        }

        public List<IEnumerable> GravarEntradaNF(string entradaNF)
        {
            try
            {
               return _Db.MultiplosResults("[dbo].[pr_gc_gravar_nf_fornecedor]" +
                                    " @NFFornecedor = '" + entradaNF + "'")
                                    .With<EntradaNF>()
                                    .Executar();
            }
            catch (Exception ex)
            {
                throw new Exception("RepositorioNotaFiscal.BuscaEntradasFiltradas: \n" + ex.Message, ex);
            }
        }
    }
}
