using Nextt_Gestao_Compra.Dominio.Entidades;
using Nextt_Gestao_Compra.Dominio.Interfaces.Repositorio.Gerenciamento;
using Nextt_Gestao_Compra.Infra.Dados.Utils;
using System;
using System.Collections;
using System.Collections.Generic;

namespace Nextt_Gestao_Compra.Infra.Dados.Repositorios.Gerenciamento
{
    public class RepositorioPedido : RepositorioPadrao<Parametros>, IRepositorioPedido
    {
        public List<IEnumerable> CarregaFiltrosPesquisaPedido()
        {
            try
            {
                return _Db
                    .MultiplosResults("[dbo].[pr_carrega_filtro_pre_pedido_GESTAO_COMPRAS]")
                                    .With<Fornecedor>()
                                    .With<Marca>()
                                    .With<Segmento>()
                                    .With<Atributos>()
                                    .With<UsuarioGerenciamento>()
                                    .With<StatusPedido>()
                                    .Executar();
            }
            catch (Exception ex)
            {
                throw new Exception("RepositorioPedido.CarregaFiltrosPesquisaPedido: \n" + ex.Message, ex);
            }
        }

        public List<IEnumerable> PesquisaPedidos(Parametros parametros)
        {
            try
            {
                return _Db.MultiplosResults("[dbo].[pr_consulta_fornecedor_pre_pedido_GESTAO_COMPRAS]" +
                                    " @DataCadastroPedidoInicial = '" + parametros.DtCadInicial +
                                    "', @DataCadastroPedidoFinal = '" + parametros.DtCadFinal +
                                    "', @DataEntregaPedidoInicial = '" + parametros.DtEntregaInicial +
                                    "', @DataEntregaPedidoFinal = '" + parametros.DtEntregaFinal +
                                    "', @IDFornecedor = '" + parametros.IDFornecedor +
                                    "', @IDSegmento = '" + parametros.Segmentos+
                                    "', @CodigoProduto = '" + parametros.Codigo +
                                    "', @CodigoOriginal = '" + parametros.CodigoOriginal +//string ou int
                                    "', @ReferenciaFornecedor = '" + parametros.ReferenciaFornecedor +
                                    "', @IDPedido = '" + parametros.IDPedido + //string ou int
                                    "', @DescricaoProduto = '" + parametros.DescricaoProduto +
                                    "', @IDSecao = '" + parametros.Secoes +
                                    "', @AtributoFornecedor = '" + parametros.AttrFornecedor +
                                    "', @IDEspecie = '" + parametros.Especies +
                                    "', @IDMarca = '" + parametros.Marcas +
                                    "', @IDUsuario = '" + parametros.IDUsuarios +
                                     "', @StatusPedido = '" + parametros.Status + "'")
                                    .With<PedidoConsulta>()
                                    .Executar();
            }
            catch (Exception ex)
            {
                throw new Exception("RepositorioPedido.PesquisaPedidos: \n" + ex.Message, ex);
            }
        }

        public List<IEnumerable> RetornaPedidoSintetico(Parametros parametros)
        {
            try
            {
                return _Db
                    .MultiplosResults("[dbo].[pr_consulta_pre_pedido_GESTAO_COMPRAS] @IDPedido = " + parametros.Codigo)
                                    .With<PedidoCadastrado>()
                                    .With<Fornecedor>()
                                    .With<DadosPrePedido>()
                                    .With<ProdutoItem>()
                                    .With<GrupoFilial>()
                                    .With<FotoProduto>()
                                    .Executar();
            }
            catch (Exception ex)
            {
                throw new Exception("RepositorioPedido.RetornaPedidoSintetico: \n" + ex.Message, ex);
            }
        }

        public List<IEnumerable> RetornaPedidoAnalitico(Parametros parametros)
        {
            try
            {
                return _Db
                    .MultiplosResults("[dbo].[pr_informacao_cadastro_produto_dados_inicial_pre_pedido_GESTAO_COMPRAS] @IDPedido = " + parametros.Codigo)
                                    .With<PedidoCadastrado>()
                                    .With<ReferenciaProduto>()
                                    .With<GrupoTamanho>()
                                    .With<Cor>()
                                    .With<FormaPgto>()
                                    .With<CondicaoPgto>()
                                    .With<ClassificacaoFiscal>()
                                    .With<ProdutoItem>()
                                    .With<GrupoFilial>()
                                    .With<Grade>()
                                    .With<GrupoFilial>()
                                    .With<GrupoFilial>()
                                    .With<Atributos>()
                                    .With<Atributos>()
                                    .With<Comprador>()
                                    .With<UnidadeMedida>()
                                    .With<ResumoPedido>()
                                    .With<HistoricoPedido>()
                                    .With<ConfigDefault>()
                                    .With<PrecoGrupoEmpresa>()
                                    .Executar();
            }
            catch (Exception ex)
            {
                throw new Exception("RepositorioPedido.RetornaPedidoAnalitico: \n" + ex.Message, ex);
            }
        }

        public void AtualizaStatusPedido(Parametros parametros)
        {
            try
            {
                _Db.MultiplosResults("[dbo].[pr_altera_status_pre_pedido_GESTAO_COMPRAS]" +
                    " @IDPedido = " + parametros.Codigo +
                    ", @Status='" + parametros.Status +
                    "', @Usuario='" + parametros.IDUsuarios +
                    "' , @Observacao='" + parametros.Observacao + "'")
                      .Executar();
            }
            catch (Exception ex)
            {
                throw new Exception("RepositorioPedido.AtualizaStatusPedido: \n" + ex.Message, ex);
            }
        }

        public List<IEnumerable> ClonarPedido(Parametros parametros)
        {
            try
            {
                return _Db.MultiplosResults("[dbo].[pr_clonar_pedido_GESTAO_COMPRAS]" +
                                    " @IDUsuario = '" + parametros.IDUsuarios + "', @IDPedido = '" + parametros.Codigo + "'")
                                        .With<PedidoConsulta>()
                                        .Executar();
            }
            catch (Exception ex)
            {
                throw new Exception("RepositorioPedido.ClonarPedido: \n" + ex.Message, ex);
            }
        }
    }
}
