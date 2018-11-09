using Nextt_Gestao_Compra.Aplicacao.Gerenciador.Movimentacao;
using Nextt_Gestao_Compra.Aplicacao.Servicos.Interfaces.Gerenciamento;
using Nextt_Gestao_Compra.Aplicacao.ViewModel;
using System;
using System.Web.Http;

namespace Nextt_Gestao_Compra.Apresentacao.API.Controllers.Gerenciamento
{
    [RoutePrefix("api/gestaocompra/gerenciamento/movimentacao")]
    public class MovimentacaoController : PadraoController
    {
        private readonly IAppServicoMovimentacao _movimentacaoServico;

        public MovimentacaoController(IAppServicoMovimentacao movimentacaoServico)
        {
            _movimentacaoServico = movimentacaoServico;
        }
        [Authorize]
        [HttpGet]
        [Route("RecuperaFiltrosMovimentacaoProduto")]
        public IHttpActionResult RecuperaFiltrosMovimentacaoProduto()
        {
            try
            {
                var retorno = GerenciamentoAplicacaoMovimentacao.RetornaGruposSegmentoMarca(_movimentacaoServico, ModelFabrica);
                return Ok(retorno);
            }
            catch (Exception ex)
            {
                log.Error("Erro ao Recuperar Filtros de Movimentacao", ex);
                return InternalServerError(ex);
            }
        }
        [Authorize]
        [HttpPost]
        [Route("RetornaEspecies")]
        public IHttpActionResult RetornaEspecies(ParametrosVM parametro)
        {
            try
            {
                var retorno = GerenciamentoAplicacaoMovimentacao.RetornaEspecies(_movimentacaoServico, ModelFabrica, parametro);
                return Ok(retorno);
            }
            catch (Exception ex)
            {
                log.Error("Erro ao Recuperar Especies", ex);
                return InternalServerError(ex);
            }
        }
        [Authorize]
        [HttpPost]
        [Route("RetornaSecoes")]
        public IHttpActionResult RetornaSecoes(ParametrosVM parametro)
        {
            try
            {
                var retorno = GerenciamentoAplicacaoMovimentacao.RetornaSecoes(_movimentacaoServico, ModelFabrica, parametro);
                return Ok(retorno);
            }
            catch (Exception ex)
            {
                log.Error("Erro ao Recuperar Seções", ex);
                return InternalServerError(ex);
            }
        }

    }
}