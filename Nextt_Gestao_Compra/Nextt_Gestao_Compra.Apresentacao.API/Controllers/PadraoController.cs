using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Nextt_Gestao_Compra.Aplicacao.ViewModel;
using RDI_Gerenciador_Usuario.Aplicacao.Gerenciador;
using System;
using System.Net.Http;
using System.Web.Http;

namespace Nextt_Gestao_Compra.Apresentacao.API.Controllers
{
    public class PadraoController : ApiController
    {
        private GerenciadorUsuarioAplicacao _AppGerenciadorUsuario = null;
        private GerenciadorFuncoesAplicacao _AppGerenciadorPerfil = null;
        private GerenciadorPermissaoAplicacao _AppGerenciadorPermissao = null; 

        public static readonly log4net.ILog log = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        private GerenciadorLoginAplicacao _AppGerenciadorLogin = null;
        private FabricaViewModel _modelFabrica;


        protected FabricaViewModel ModelFabrica
        {
            get
            {
                if (_modelFabrica == null)
                {
                    _modelFabrica = new FabricaViewModel(Request, AppGerenciadorUsuario);
                }
                return _modelFabrica;
            }
        }
        protected GerenciadorUsuarioAplicacao AppGerenciadorUsuario
        {
            get
            {
                return _AppGerenciadorUsuario ?? Request.GetOwinContext().GetUserManager<GerenciadorUsuarioAplicacao>();
            }
        }
        protected GerenciadorFuncoesAplicacao AppGerenciadorPapel
        {
            get
            {
                return _AppGerenciadorPerfil ?? Request.GetOwinContext().GetUserManager<GerenciadorFuncoesAplicacao>();
            }
        }
        protected GerenciadorLoginAplicacao AppGerenciadorLogin
        {
            get
            {
                return _AppGerenciadorLogin ?? Request.GetOwinContext().GetUserManager<GerenciadorLoginAplicacao>();
            }
        }
        protected GerenciadorPermissaoAplicacao AppGerenciadorPermissao
        {
            get
            {
                return _AppGerenciadorPermissao ?? Request.GetOwinContext().GetUserManager<GerenciadorPermissaoAplicacao>();
            }
        }
        #region Construtor de resposta de erros
        protected IHttpActionResult RetornaErro(IdentityResult result)
        {
            if (result == null)
            {
                return InternalServerError();
            }

            if (!result.Succeeded)
            {
                if (result.Errors != null)
                { 
                    foreach (string error in result.Errors)
                    {
                        ModelState.AddModelError("motivo", error);
                    }
                }

                if (ModelState.IsValid)
                {
                    // Nenhum erro retornado, retornará um badrequest vazio
                    return BadRequest();
                }

                return BadRequest(ModelState);
            }

            return null;
        }

        protected IHttpActionResult RetornaErro(Exception ex)
        {
            //if (ex.)
            //{

            //}

            return null;
        }

        #endregion

    }
}
