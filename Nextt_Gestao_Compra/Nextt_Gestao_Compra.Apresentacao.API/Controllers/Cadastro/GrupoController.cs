using Nextt_Gestao_Compra.Aplicacao.Gerenciador.Grupo;
using Nextt_Gestao_Compra.Aplicacao.Servicos.Interfaces.Gerenciamento;
using Nextt_Gestao_Compra.Aplicacao.ViewModel;
using System;
using System.Web.Http;

namespace Nextt_Gestao_Compra.Apresentacao.API.Controllers.Cadastro
{
    [RoutePrefix("api/gestaocompra/cadastro/grupo")]
    public class GrupoController : PadraoController
    {
        private readonly IAppServicoGrupo _grupoServico;
        public GrupoController(IAppServicoGrupo grupoServico)
        {
            _grupoServico = grupoServico;
        }

        [Authorize]
        [HttpGet]
        [Route("RecuperaFiltrosCadastroGrupo")]
        public IHttpActionResult RecuperaFiltrosCadastroGrupo()
        {
            try
            {
                var retorno = GerenciamentoAplicacaoGrupo.RetornaGruposFiliais(_grupoServico, ModelFabrica);
                return Ok(retorno);
            }
            catch (Exception ex)
            {
                log.Error("Erro ao Recuperar Filtros do Cadastro de Grupos", ex);
                return InternalServerError(ex);
            }
        }

        [Authorize]
        [HttpPost]
        [Route("RecuperaFiliaisPorGrupo")]
        public IHttpActionResult RecuperaFiliaisPorGrupo(ParametrosVM parametrosVM)
        {
            try
            {
                var retorno = GerenciamentoAplicacaoGrupo.RetornaFiliaisPorGrupo(_grupoServico, parametrosVM);
                return Ok(retorno);
            }
            catch (Exception ex)
            {
                log.Error("Erro ao Recupera Filiais por Grupo", ex);
                return InternalServerError(ex);
            }
        }

        [Authorize]
        [HttpPost]
        [Route("AtualizarGrupos")]
        public IHttpActionResult AtualizarGrupos(ObjGruposAtualizarVM gruposAtualizarVM)
        {
            try
            {
                GerenciamentoAplicacaoGrupo.AtualizarGruposCadastrados(_grupoServico, gruposAtualizarVM);
                return Ok();
            }
            catch (Exception ex)
            {
                log.Error("Erro ao Atualizar Grupo", ex);
                return InternalServerError(ex);
            }
        }
        [Authorize]
        [HttpPost]
        [Route("CadastrarGrupo")]
        public IHttpActionResult CadastrarGrupo(GrupoAtualizarVM grupoCadastrarVM)
        {
            try
            {
                var retorno = GerenciamentoAplicacaoGrupo.SalvarGrupoNovo(_grupoServico, grupoCadastrarVM);
                return Ok(retorno);
            }
            catch (Exception ex)
            {
                log.Error("Erro ao Cadastrar Grupo", ex);
                return InternalServerError(ex);
            }
        }
    }
}