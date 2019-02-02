using Nextt_Gestao_Compra.Aplicacao.Gerenciador.Atributos;
using Nextt_Gestao_Compra.Aplicacao.Servicos.Interfaces.Gerenciamento;
using Nextt_Gestao_Compra.Aplicacao.ViewModel;
using System;
using System.Web.Http;

namespace Nextt_Gestao_Compra.Apresentacao.API.Controllers.Gerenciamento
{
    [RoutePrefix("api/gestaocompra/gerenciamento/atributo")]
    public class AtributoController : PadraoController
    {
        private readonly IAppServicoAtributo _atributoServico;
        public AtributoController(IAppServicoAtributo atributoServico)
        {
            _atributoServico = atributoServico;
        }
        [Authorize]
        [HttpPost]
        [Route("RecuperaAtributosFiltrados")]
        public IHttpActionResult RecuperaAtributosFiltrados(ParametrosJsonVM parametro)
        {
            try
            {
                var retorno = GerenciadorAplicacaoAtributo.RetornaAtributosFiltrados(_atributoServico, parametro);
                return Ok(retorno);
            }
            catch (Exception ex)
            {
                log.Error("Erro ao Recuperar Atributos Filtrados", ex);
                return InternalServerError(ex);
            }
        }
        [Authorize]
        [HttpPost]
        [Route("RecuperaAtributoEditar")]
        public IHttpActionResult RecuperaAtributoEditar(AtributoJsonVM atributoJson)
        {
            try
            {
                var retorno = GerenciadorAplicacaoAtributo.RetornaAtributoEditar(_atributoServico, atributoJson, ModelFabrica);
                return Ok(retorno);
            }
            catch (Exception ex)
            {
                log.Error("Erro ao Recuperar Dados do Atributo a Editar", ex);
                return InternalServerError(ex);
            }
        }
        [Authorize]
        [HttpGet]
        [Route("RecuperaFiltrosAtributo")]
        public IHttpActionResult RecuperaFiltrosAtributo()
        {
            try
            {
                var retorno = GerenciadorAplicacaoAtributo.RetornaFiltroPesquisa(_atributoServico, ModelFabrica);
                return Ok(retorno);
            }
            catch (Exception ex)
            {
                log.Error("Erro ao Recuperar Dados de Filtros para Atributo", ex);
                return InternalServerError(ex);
            }
        }
        [Authorize]
        [HttpPost]
        [Route("SalvarAtributo")]
        public IHttpActionResult SalvarAtributo(AtributoJsonVM atributoJson)
        {
            try
            {
                GerenciadorAplicacaoAtributo.SalvarAtributo(_atributoServico, atributoJson);
                return Ok();
            }
            catch (Exception ex)
            {
                log.Error("Erro ao Salvar Atributo", ex);
                return InternalServerError(ex);
            }
        }
        [Authorize]
        [HttpPost]
        [Route("ExcluirAtributo")]
        public IHttpActionResult ExcluirAtributo(AtributoSalvarVM atributoJson)
        {
            try
            {
                GerenciadorAplicacaoAtributo.ExcluirAtributo(_atributoServico, atributoJson);
                return Ok();
            }
            catch (Exception ex)
            {
                log.Error("Erro ao Excluir Atributo", ex);
                return InternalServerError(ex);
            }
        }
    }
}
