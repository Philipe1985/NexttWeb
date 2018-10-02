using Microsoft.AspNet.Identity;
using RDI_Gerenciador_Usuario.Aplicacao.Gerenciador;
using RDI_Gerenciador_Usuario.Aplicacao.ViewModel;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace Nextt_Gestao_Compra.Apresentacao.API.Controllers
{
    [RoutePrefix("api/GestaoCompra")]
    public class UsuarioController : PadraoController
    {
        #region Propriedades
        //private readonly IAppServicoUsuario _usuarioServico;
        #endregion

        #region Actions
        [Authorize(Roles = "Administrador Sistema, Administrador")]
        [Route("Cadastrar")]
        public async Task<IHttpActionResult> CadastrarUsuario(UsuarioCadastroViewModel cadastro)
        {
            try
            {
                if (!ModelState.IsValid || cadastro.Perfis.Count == 0)
                    return BadRequest(ModelState);

                var cadastrado = await GerenciamentoUsuario.CadastrarUsuario(cadastro, AppGerenciadorUsuario, AppGerenciadorPapel);

                //confirma se usuário foi cadastrado
                if (cadastrado.Result != null)
                    return RetornaErro(cadastrado.Result);
                var callbackUrl = new Uri(Url.Link("ConfirmarEmailRoute", new { usuario = cadastrado.Id, codigo = cadastrado.Codigo }));
                await GerenciamentoUsuario.EnviarEmail(AppGerenciadorUsuario, cadastrado, callbackUrl);
                Uri cabecalho = new Uri(Url.Link("RecuperarPorId", new { id = cadastrado.Id }));

                return Created(cabecalho, cadastrado);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("ConfirmarEmail", Name = "ConfirmarEmailRoute")]
        public async Task<IHttpActionResult> ConfirmarEmail(string usuario = "", string codigo = "")
        {
            try
            {
                if (string.IsNullOrWhiteSpace(usuario) || string.IsNullOrWhiteSpace(codigo))
                    return BadRequest(ModelState);

                var result = await GerenciamentoUsuario.ConfirmaEmail(AppGerenciadorUsuario, usuario, codigo);
                if (result.Succeeded)
                {
                    HttpResponseMessage responseMsg = new HttpResponseMessage(HttpStatusCode.RedirectMethod);
                    string url = ConfigurationManager.AppSettings["PrimeiroAcesso"];
                    responseMsg.Headers.Location = new Uri(url);
                    return ResponseMessage(responseMsg);
                }
                else
                    return RetornaErro(result);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [Authorize(Roles = "Administrador Sistema, Administrador")]
        [HttpGet]
        [Route("RecuperaUsuario/{id:guid}", Name = "RecuperarPorId")]
        public async Task<IHttpActionResult> RecuperaUsuario(string Id)
        {

            var usuario = await GerenciamentoUsuario.RecuperaUsuarioPorId(AppGerenciadorUsuario, Id, AppGerenciadorPapel);
            if (usuario != null)
                return Ok(usuario);
            return NotFound();
        }

        [Authorize(Roles = "Administrador Sistema, Administrador")]
        [Route("ListarUsuarios")]
        public IHttpActionResult RecuperarTodosUsuarios()
        {
            try
            {

                return Ok(GerenciamentoUsuario.RecuperaUsuarios(AppGerenciadorUsuario));
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [Authorize(Roles = "Administrador Sistema, Administrador")]
        [Route("RecuperarUsuariosFiltrado")]
        public async Task<IHttpActionResult> RecuperarUsuariosFiltrado(FiltroUsuarioVM Filtro)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);
                var retorno = await GerenciamentoUsuario.RecuperaUsuarioFiltro(AppGerenciadorUsuario, AppGerenciadorPapel, Filtro);
                return Ok(retorno);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [Authorize(Roles = "Administrador Sistema, Administrador")]
        [Route("RecuperarTodosPerfis")]
        public IHttpActionResult RecuperarTodosPerfis()
        {
            try
            {
                var retorno = GerenciadorLogin.RecuperaPerfilExistente(AppGerenciadorPapel);
                return Ok(retorno);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpPost]
        [Authorize]
        [Route("AlterarSenha")]
        public async Task<IHttpActionResult> AlterarSenha(AlteraSenhaVM alteraSenhaVM)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);
                var retorno = await GerenciamentoUsuario.MudarSenha(AppGerenciadorUsuario, alteraSenhaVM, User.Identity.GetUserId());
                if (retorno.Succeeded)
                    return Ok();
                return RetornaErro(retorno);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpPost]
        [Route("ResetarSenha/{id:guid}")]
        [Authorize(Roles = "Administrador Sistema, Administrador")]
        public async Task<IHttpActionResult> ResetarSenha(string Id)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var retorno = await GerenciamentoUsuario.RecuperaSenha(AppGerenciadorUsuario, Id);
                if (retorno.Succeeded)
                    return Ok();
                return RetornaErro(retorno);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }

        }

        [HttpPost]
        [Authorize(Roles = "Administrador Sistema, Administrador")]
        [Route("BloquearUsuario")]
        public async Task<IHttpActionResult> BloquearUsuario(BloqueioUsuarioVM usuarioBloqueioVM)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);
                var retorno = await GerenciamentoUsuario.AlteraStatusUsuario(AppGerenciadorUsuario, usuarioBloqueioVM);
                if (retorno == null)
                {
                    ModelState.AddModelError("Erro", "Usuário ainda não ativou o e-mail!");
                    return BadRequest(ModelState);
                }
                if (retorno.Succeeded)
                    return Ok();
                return RetornaErro(retorno);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }

        }

        [HttpPost]
        [Authorize(Roles = "Administrador Sistema, Administrador")]
        [Route("AtualizaUsuario")]
        public async Task<IHttpActionResult> AtualizaUsuario(UsuarioVM usuarioAtualizarVM)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);
                var retorno = await GerenciamentoUsuario.AtualizarUsuario(AppGerenciadorUsuario, usuarioAtualizarVM, AppGerenciadorPapel);
                if (retorno.Succeeded)
                    return Ok();
                return RetornaErro(retorno);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }

        }

        [HttpPost]
        [Authorize(Roles = "Administrador Sistema, Administrador")]
        [Route("CadastraPerfil")]
        public async Task<IHttpActionResult> CadastraPerfil(NovoPerfilVM usuarioAtualizarVM)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);
                var retorno = await GerenciadorLogin.CadastrarNovoPerfil(usuarioAtualizarVM, AppGerenciadorPapel);
                if (retorno.Succeeded)
                    return Ok();
                return RetornaErro(retorno);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }

        }

        [Authorize(Roles = "Administrador Sistema, Administrador")]
        [Route("AtualizarPermissaoUsuario")]
        [HttpPost]
        public async Task<IHttpActionResult> AtualizarPermissaoUsuario(PermissaoUsuarioVM usuarioPermissao)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);
                if (usuarioPermissao.Negar == null)
                    usuarioPermissao.Negar = new List<string>();
                if (usuarioPermissao.Permitir == null)
                    usuarioPermissao.Permitir = new List<string>();
                var retorno = await GerenciadorLogin.AtualizarPermissoesUsuario(usuarioPermissao, AppGerenciadorUsuario);
                if (!retorno.Succeeded)
                    return RetornaErro(retorno);

                return Ok();
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }


        #endregion

        #region Construtores
        public UsuarioController()
        {

        }
        #endregion


    }
}
