using Nextt_Gestao_Compra.Aplicacao.Gerenciador.GrupoEmpresas;
using Nextt_Gestao_Compra.Aplicacao.Servicos.Interfaces.Gerenciamento;
using Nextt_Gestao_Compra.Aplicacao.ViewModel;
using System;
using System.Web.Http;

namespace Nextt_Gestao_Compra.Apresentacao.API.Controllers.Gerenciamento
{
    [RoutePrefix("api/gestaocompra/gerenciamento/grupoempresa")]
    public class GrupoEmpresaController  : PadraoController
    {
        private readonly IAppServicoGrupoEmpresa _grpEmpServico;
        public GrupoEmpresaController(IAppServicoGrupoEmpresa grpEmpServico)
        {
            _grpEmpServico = grpEmpServico;
        }
        [Authorize]
        [HttpGet]
        [Route("RecuperaDadosInicial")]
        public IHttpActionResult RecuperaDadosInicial()
        {
            try
            {
                var retorno = GerenciadorAplicacaoGrupoEmpresa.RetornaDadosFiltroInicial(_grpEmpServico);
                return Ok(retorno);
            }
            catch (Exception ex)
            {
                log.Error("Erro ao Recuperar Carga Inicial de Grupos de Empresas", ex);
                return InternalServerError(ex);
            }
        }

        [Authorize]
        [HttpPost]
        [Route("RecuperaDadosGrupoEditar")]
        public IHttpActionResult RecuperaDadosGrupoEditar(ParametrosVM parametros)
        {
            try
            {
                var retorno = GerenciadorAplicacaoGrupoEmpresa.RetornaDadosGrupoEditar(_grpEmpServico,parametros,ModelFabrica);
                return Ok(retorno);
            }
            catch (Exception ex)
            {
                log.Error("Erro ao Recuperar Dados do Grupos de Empresas a Editar", ex);
                return InternalServerError(ex);
            }
        }

        [Authorize]
        [HttpPost]
        [Route("InsereAtualizaGrupo")]
        public IHttpActionResult InsereAtualizaGrupo(GrupoEmpresaSalvarVM grupo)
        {
            try
            {

                GerenciadorAplicacaoGrupoEmpresa.GravarAtualizarGrupoEmpresas(_grpEmpServico, grupo);
                return Ok();
            }
            catch (Exception ex)
            {
                log.Error("Erro ao Cadastrar/Atualizar Dados do Grupos de Empresas", ex);
                return InternalServerError(ex);
            }
        }
        [Authorize]
        [HttpPost]
        [Route("ExcluirGrupoEmpresas")]
        public IHttpActionResult ExcluirGrupoEmpresas(ParametrosVM parametros)
        {
            try
            {
                GerenciadorAplicacaoGrupoEmpresa.ExcluirGrupoEmpresa(_grpEmpServico, parametros);
                return Ok();
            }
            catch (Exception ex)
            {
                log.Error("Erro ao Excluir Grupo de Empresas", ex);
                return InternalServerError(ex);
            }
        }
    }
}