using Nextt_Gestao_Compra.Aplicacao.Gerenciador.NF;
using Nextt_Gestao_Compra.Aplicacao.Servicos.Interfaces.Gerenciamento;
using Nextt_Gestao_Compra.Aplicacao.ViewModel;
using System;
using System.Web.Http;

namespace Nextt_Gestao_Compra.Apresentacao.API.Controllers.Gerenciamento
{
    [RoutePrefix("api/gestaocompra/gerenciamento/entradaNF")]
    public class EntradaNFController : PadraoController
    {
        private readonly IAppServicoNotaFiscal _notaFiscalServico;
        public EntradaNFController(IAppServicoNotaFiscal notaFiscalServico)
        {
            _notaFiscalServico = notaFiscalServico;
        }

        [Authorize]
        [HttpGet]
        [Route("RecuperaFiltrosPesquisaNF")]
        public IHttpActionResult RecuperaFiltrosPesquisa()
        {
            try
            {
                var retorno = GerenciadorAplicacaoNF.RetornaDadosFiltroInicial(_notaFiscalServico, ModelFabrica);
                return Ok(retorno);
            }
            catch (Exception ex)
            {
                log.Error("Erro ao Recuperar Filtros da Pesquisa de Entradas de NF", ex);
                return InternalServerError(ex);
            }
        }

        [Authorize]
        [HttpGet]
        [Route("RecuperaFiltrosCadastroNF")]
        public IHttpActionResult RecuperaFiltrosCadastroNF()
        {
            try
            {
                var retorno = GerenciadorAplicacaoNF.RetornaCadastroFiltroInicial(_notaFiscalServico, ModelFabrica);
                return Ok(retorno);
            }
            catch (Exception ex)
            {
                log.Error("Erro ao Recuperar Filtros da Pesquisa de Entradas de NF", ex);
                return InternalServerError(ex);
            }
        }

        [Authorize]
        [HttpPost]
        [Route("RecuperaEntradasFiltradas")]
        public IHttpActionResult RecuperaEntradasFiltradas(ParametroNotaVM parametro)
        {
            try
            {
                var retorno = GerenciadorAplicacaoNF.RetornaEntradasFiltradas(_notaFiscalServico, parametro);
                return Ok(retorno);
            }
            catch (Exception ex)
            {
                log.Error("Erro ao Recuperar Entradas de NF Filtradas", ex);
                return InternalServerError(ex);
            }
        }
        [Authorize]
        [HttpGet]
        [Route("RecuperaEntradaCadastrada/{id:guid}", Name = "RecuperaEntradaCadastrada")]
        public IHttpActionResult RecuperaEntradaCadastrada(string Id)
        {
            try
            {
                var retorno = GerenciadorAplicacaoNF.RetornaEntradaCadastrada(_notaFiscalServico, Id, ModelFabrica);
                return Ok(retorno);
            }
            catch (Exception ex)
            {
                log.Error("Erro ao Recuperar Entrada de NF Cadastrada", ex);
                return InternalServerError(ex);
            }
        }
        [Authorize]
        [HttpPost]
        [Route("RecuperaPedidosFiltrados")]
        public IHttpActionResult RecuperaPedidosFiltrados(ParametroNotaVM parametro)
        {
            try
            {
                var retorno = GerenciadorAplicacaoNF.RetornaPedidosFiltrados(_notaFiscalServico, parametro);
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
        [Route("RecuperaPackAddPedido")]
        public IHttpActionResult RecuperaPackAddPedido(ParametroNotaVM parametro)
        {
            try
            {
                var retorno = GerenciadorAplicacaoNF.RetornaPacksPedidoAdd(_notaFiscalServico, parametro);
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
        [Route("GravarEntradaNF")]
        public IHttpActionResult GravarEntradaNF(ObjEntradasSalvarVM parametro)
        {
            try
            {
                var retorno = GerenciadorAplicacaoNF.GravarEntradaNF(_notaFiscalServico, parametro);
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
        [Route("AtualizaStatusEntradaNF")]
        public IHttpActionResult AtualizaStatusEntradaNF(ObjEntradasSalvarVM parametro)
        {
            try
            {
                var retorno = GerenciadorAplicacaoNF.AtualizaStatusEntrada(_notaFiscalServico, parametro);
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
        [Route("GeraTitulosEntradaNF")]
        public IHttpActionResult GeraTitulosEntradaNF(ObjSalvarTituloVM parametro)
        {
            try
            {
                var retorno = GerenciadorAplicacaoNF.GeraTitulosEntrada(_notaFiscalServico, parametro);
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
        [Route("ConfirmaTitulosEntradaNF")]
        public IHttpActionResult ConfirmaTitulosEntradaNF(ObjSalvarTituloVM parametro)
        {
            try
            {
                var retorno = GerenciadorAplicacaoNF.ConfirmarTitulosEntrada(_notaFiscalServico, parametro);
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
        [Route("RecuperaPacksPedidos")]
        public IHttpActionResult RecuperaPacksPedidos(PedidoNFVM parametro)
        {
            try
            {
                var retorno = GerenciadorAplicacaoNF.RetornaPacksPedido(_notaFiscalServico, parametro);
                return Ok(retorno);
            }
            catch (Exception ex)
            {
                log.Error("Erro ao Recuperar Pedidos Filtrados", ex);
                return InternalServerError(ex);
            }
        }
    }
}
