using Nextt_Gestao_Compra.Aplicacao.Gerenciador.Compra;
using Nextt_Gestao_Compra.Aplicacao.Gerenciador.Pedido;
using Nextt_Gestao_Compra.Aplicacao.Servicos.Interfaces.Gerenciamento;
using Nextt_Gestao_Compra.Aplicacao.ViewModel;
using System;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace Nextt_Gestao_Compra.Apresentacao.API.Controllers.Cadastro
{
    [RoutePrefix("api/gestaocompra/cadastro/pedido")]
    public class PedidoController : PadraoController
    {
        private readonly IAppServicoPedido _pedidoServico;
        // GET: Compra
        public PedidoController(IAppServicoPedido pedidoServico)
        {
            _pedidoServico = pedidoServico;
        }
        [Authorize]
        [HttpGet]
        [Route("CarregaFiltrosPesquisa")]
        public IHttpActionResult CarregaFiltrosPesquisa()
        {
            try
            {
                var retorno = GerenciadorAplicacaoPedido.RetornaFiltroInicial(_pedidoServico, ModelFabrica);
                return Ok(retorno);
            }
            catch (Exception ex)
            {
                log.Error("Erro ao Recuperar Filtros da Pesquisa de Pedidos", ex);
                return InternalServerError(ex);
            }
        }
        [Authorize]
        [HttpPost]
        [Route("RetornaPedidosFiltrados")]
        public IHttpActionResult RetornaPedidosFiltrados(ParametrosVM parametros)
        {
            try
            {
              var retorno = GerenciadorAplicacaoPedido.RetornaPedidosFiltrado(_pedidoServico, parametros);
                return Ok(retorno);
            }
            catch (Exception ex)
            {
                log.Error("Erro ao Recuperar Pedidos Filtrados", ex);
                return InternalServerError(ex);
            }
        }
        [Authorize]
        [HttpPost]
        [Route("RetornaPedidoClonado")]
        public IHttpActionResult RetornaPedidoClonado(ParametrosVM parametros)
        {
            try
            {
                var retorno = GerenciadorAplicacaoPedido.ClonarPedido(_pedidoServico, parametros);
                return Ok(retorno);
            }
            catch (Exception ex)
            {
                log.Error("Erro ao Clonar Pedido", ex);
                return InternalServerError(ex);
            }
        }
        [Authorize]
        [HttpPost]
        [Route("RetornaPedidoSintetico")]
        public IHttpActionResult RetornaPedidoSintetico(ParametrosVM parametros)
        {
            try
            {
                var retorno = GerenciadorAplicacaoPedido.RetornaPedidoSintetico(_pedidoServico, parametros);
                return Ok(retorno);
            }
            catch (Exception ex)
            {
                log.Error("Erro ao Recuperar Dados do Pedido Sintético", ex);
                return InternalServerError(ex);
            }
        }
        [Authorize]
        [HttpPost]
        [Route("RetornaPedidoAnalitico")]
        public IHttpActionResult RetornaPedidoAnalitico(ParametrosVM parametros)
        {
            try
            {
                var retorno = GerenciadorAplicacaoPedido.RetornaPedidoAnalitico(_pedidoServico, parametros, ModelFabrica);
                return Ok(retorno);
            }
            catch (Exception ex)
            {
                log.Error("Erro ao Recuperar Dados do Pedido Analítico", ex);
                return InternalServerError(ex);
            }
        }
        [Authorize]
        [HttpPost]
        [Route("AtualizaStatusPedido")]
        public IHttpActionResult AtualizaStatusPedido(ParametrosVM parametros)
        {
            try
            {
                GerenciadorAplicacaoPedido.AtualizaPedido(_pedidoServico, parametros);
                return Ok();
            }
            catch (Exception ex)
            {
                log.Error("Erro ao Recuperar Dados do Pedido Analítico", ex);
                return InternalServerError(ex);
            }
        }
    }
}