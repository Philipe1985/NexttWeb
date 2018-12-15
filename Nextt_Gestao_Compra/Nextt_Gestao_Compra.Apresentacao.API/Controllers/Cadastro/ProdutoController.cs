using Nextt_Gestao_Compra.Aplicacao.Gerenciador.Compra;
using Nextt_Gestao_Compra.Aplicacao.Gerenciador.Produto;
using Nextt_Gestao_Compra.Aplicacao.Servicos.Interfaces.Gerenciamento;
using Nextt_Gestao_Compra.Aplicacao.ViewModel;
using System;
using System.Web.Http;


namespace Nextt_Gestao_Compra.Apresentacao.API.Controllers.Cadastro
{
    [RoutePrefix("api/gestaocompra/cadastro/produto")]
    public class ProdutoController : PadraoController
    {
        private readonly IAppServicoProduto _produtoServico;
        public ProdutoController(IAppServicoCompra compraServico, IAppServicoProduto produtoServico)
        {
            _produtoServico = produtoServico;
        }

        [Authorize]
        [HttpPost]
        [Route("RetornaProdutoEditar")]
        public IHttpActionResult RetornaProdutoEditar(ParametrosVM parametros)
        {
            try
            {
                var retorno = GerenciadorAplicacaoProduto.RetornaDadosProdutoEditar(_produtoServico, parametros, ModelFabrica);
                return Ok(retorno);
            }
            catch (Exception ex)
            {
                log.Error("Erro ao Recuperar Dados do Produto a Editar", ex);
                return InternalServerError(ex);
            }
        }

        [Authorize]
        [HttpPost]
        [Route("SalvarProduto")]
        public IHttpActionResult SalvarProduto(ProdutoCadastroVM produto)
        {
            try
            {
                log.Debug("Cadastro Iniciado no Servidor");
                var retorno = GerenciadorAplicacaoProduto.GravarProduto(_produtoServico, produto, log);
                return Ok(retorno);
            }
            catch (Exception ex)
            {
                log.Error("Erro ao Salvar o Pedido", ex);
                return InternalServerError(ex);
            }
        }

    }
}