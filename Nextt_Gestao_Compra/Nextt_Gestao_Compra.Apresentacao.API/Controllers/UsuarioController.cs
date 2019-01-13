using Microsoft.AspNet.Identity;
using RDI_Gerenciador_Usuario.Aplicacao.Gerenciador;
using RDI_Gerenciador_Usuario.Aplicacao.ViewModel;
using RDI_Gerenciador_Usuario.Aplicacao.ViewModels;
using RDI_Gerenciador_Usuario.Infra.CrossCutting.Helpers;
using RDI_Gerenciador_Usuario.ManagerStart;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
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
        [FiltroAutorizacaoCustom(PermissaoTipo = "Cadastrar Usuário", PermissaoValor = "1")]
        [Route("Cadastrar")]
        public async Task<IHttpActionResult> CadastrarUsuario(UsuarioCadastroViewModel cadastro)
        {
            try
            {
                var teste = Request.Headers.GetCookies();
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
                log.Error("Erro ao Cadastrar Usuário", ex);
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

        [Authorize]
        [HttpGet]
        [Route("RecuperaUsuario/{id:guid}", Name = "RecuperarPorId")]
        public async Task<IHttpActionResult> RecuperaUsuario(string Id)
        {

            var usuario = await GerenciamentoUsuario.RecuperaUsuarioPorId(AppGerenciadorUsuario, Id, AppGerenciadorPapel);
            if (usuario != null)
                return Ok(usuario);
            return NotFound();
        }

        [FiltroAutorizacaoCustom(PermissaoTipo = "Gerenciar Usuários", PermissaoValor = "1")]
        [Route("ListarUsuarios")]
        public IHttpActionResult RecuperarTodosUsuarios()
        {
            try
            {

                return Ok(GerenciamentoUsuario.RecuperaUsuarios(AppGerenciadorUsuario));
            }
            catch (Exception ex)
            {
                log.Error("Erro ao Recuperar Usuários Cadastrados", ex);
                return InternalServerError(ex);
            }
        }
        [FiltroAutorizacaoCustom(PermissaoTipo = "Gerenciar Usuários", PermissaoValor = "1")]
        [Route("ListarUsuariosNextt")]
        public IHttpActionResult RecuperarTodosUsuariosNextt()
        {
            try
            {
                return Ok(GerenciamentoUsuario.RecuperaUsuariosNextt());
            }
            catch (Exception ex)
            {
                log.Error("Erro ao Recuperar Usuários Nextt", ex);
                return InternalServerError(ex);
            }
        }

        [FiltroAutorizacaoCustom(PermissaoTipo = "Gerenciar Usuários", PermissaoValor = "1")]
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
                log.Error("Erro ao Filtrar Usuários", ex);
                return InternalServerError(ex);
            }
        }

        [FiltroAutorizacaoCustom(PermissaoTipo = "Gerenciar Usuários", PermissaoValor = "1")]
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
                log.Error("Erro ao Recuperar Perfis Cadastrados", ex);
                return InternalServerError(ex);
            }
        }

        [FiltroAutorizacaoCustom(PermissaoTipo = "Gerenciar Usuários", PermissaoValor = "1")]
        [Route("RecuperarPermissaoPorPerfil")]
        public IHttpActionResult RecuperarPermissaoPorPerfil(PapelRetornoModel papelRetorno)
        {
            try
            {
                var retorno = GerenciadorLogin.RetonaPermissoesPorPerfil(papelRetorno, AppGerenciadorPapel);
                return Ok(retorno);
            }
            catch (Exception ex)
            {
                log.Error("Erro ao Recuperar Permissões do perfil "+papelRetorno.Id+":", ex);
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
                log.Error("Erro ao Alterar Senha:", ex);
                return InternalServerError(ex);
            }
        }

        [HttpPost]
        [Route("ResetarSenha/{id:guid}")]
        [FiltroAutorizacaoCustom(PermissaoTipo = "Redefinir Senha", PermissaoValor = "1")]
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
                log.Error("Erro ao Redefinir Senha:", ex);
                return InternalServerError(ex);
            }

        }

        [HttpPost]
        [FiltroAutorizacaoCustom(PermissaoTipo = "Bloquear/Desbloquear Usuário", PermissaoValor = "1")]
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
                log.Error("Erro ao Bloquear/Desbloquear Usuário:", ex);
                return InternalServerError(ex);
            }

        }

        [HttpPost]
        [FiltroAutorizacaoCustom(PermissaoTipo = "Editar Usuário", PermissaoValor = "1")]
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
                log.Error("Erro ao Atualizar Usuário:", ex);
                return InternalServerError(ex);
            }

        }

        [HttpPost]
        [FiltroAutorizacaoCustom(PermissaoTipo = "Cadastrar Perfil", PermissaoValor = "1")]
        [Route("CadastraPerfil")]
        public async Task<IHttpActionResult> CadastraPerfil(NovoPerfilVM usuarioAtualizarVM)
        {
            try
            {

                if (!ModelState.IsValid)
                    return BadRequest(ModelState);
                var retorno = await GerenciadorLogin.CadastrarNovoPerfil(usuarioAtualizarVM, AppGerenciadorPapel);
                if (retorno.Succeeded)
                {
                    var permissaoNova = GerenciadorLogin.RecuperaPerfilExistente(AppGerenciadorPapel);
                    return Ok(permissaoNova);
                }

                return RetornaErro(retorno);
            }
            catch (Exception ex)
            {
                log.Error("Erro ao Cadastrar Perfil:", ex);
                return InternalServerError(ex);
            }
        }
        [HttpPost]
        [FiltroAutorizacaoCustom(PermissaoTipo = "Editar Perfil", PermissaoValor = "1")]
        [Route("AtualizarPerfil")]
        public async Task<IHttpActionResult> AtualizarPerfil(NovoPerfilVM perfilAtualizarVM)
        {
            try
            {

                if (!ModelState.IsValid)
                    return BadRequest(ModelState);
                var retorno = await GerenciadorLogin.AtualizarPerfilCadastrado(perfilAtualizarVM, AppGerenciadorPapel);
                if (retorno.Succeeded)
                {
                    var permissaoNova = GerenciadorLogin.RecuperaPerfilExistente(AppGerenciadorPapel);
                    return Ok(permissaoNova);
                }

                return RetornaErro(retorno);
            }
            catch (Exception ex)
            {
                log.Error("Erro ao Atualizar Perfil:", ex);
                return InternalServerError(ex);
            }
        }

        [FiltroAutorizacaoCustom(PermissaoTipo = "Editar Usuário", PermissaoValor = "1")]
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
                log.Error("Erro ao Atualizar Permissões do Usuário:", ex);
                return InternalServerError(ex);
            }
        }

        [FiltroAutorizacaoCustom(PermissaoTipo = "Cadastra Permissao", PermissaoValor = "1")]
        [Route("CadastraPermissao")]
        [HttpPost]
        public async Task<IHttpActionResult> CadastraPermissao(PermissoesVM permissoesAdd)
        {
            try
            {
                if (!ModelState.IsValid || permissoesAdd.Descricoes.Count == 0)
                    return BadRequest(ModelState);

                var retorno = await SetupImplantacao.CadastrarFuncoesAplicacao(AppGerenciadorPapel, permissoesAdd);
                if (retorno != null)
                    return Ok(retorno);
                return BadRequest();
            }
            catch (Exception ex)
            {
                log.Error("Erro ao Cadastrar Permissões:", ex);
                return InternalServerError(ex);
            }
        }

        [AllowAnonymous]
        [Route("ValidarPrimeiroAcesso")]
        [HttpGet]
        public IHttpActionResult ValidarPrimeiroAcesso()
        {
            try
            {
                SetupImplantacao.CadastrarNovasPermissoes(AppGerenciadorPapel);

                var retorno = SetupImplantacao.PrimeiroAcesso();

                var resp = new HttpResponseMessage();
                if (retorno)
                {

                    DateTime sourceDate = DateTime.Now.AddMinutes(20);
                    DateTimeOffset targetTime;

                    DateTime localTime = DateTime.SpecifyKind(sourceDate, DateTimeKind.Local);
                    targetTime = new DateTimeOffset(localTime, TimeZoneInfo.Local.GetUtcOffset(localTime));
                    //DateTimeOffset firstDate = new DateTimeOffset(DateTime.Now,
                    //                                              new TimeSpan(0, -1, 0));
                    var cookieRetorno = new CookieHeaderValue("session-id", "tempGuest")
                    {
                        Expires = targetTime,
                        Domain = Request.RequestUri.Host,//ConfigurationManager.AppSettings["ProvedorIP"],
                        Path = "/"

                        //Path = "/gerenciamento/configuracao.cshtml"
                    };
                    resp.Headers.AddCookies(new CookieHeaderValue[] { cookieRetorno });
                    return Ok(resp);
                }



                return Ok();

            }
            catch (Exception ex)
            {
                log.Error("Erro ao Validar Setup:", ex);
                return InternalServerError(ex);
            }
        }
        #endregion

        [FiltroAutorizacaoCustom(PermissaoTipo = "Gerenciar Usuários", PermissaoValor = "1")]
        [Route("RetornaPermissoesCadastradas")]
        [HttpPost]
        public IHttpActionResult RetornaPermissoesCadastradas()
        {
            try
            {


                var retorno = GerenciamentoPermissoes.RetornaPermissoesCadastradas();
                if (retorno.Count() > 0)
                    return Ok(retorno);
                return NotFound();
            }
            catch (Exception ex)
            {
                log.Error("Erro ao Consultar Permissões Cadastradas:", ex);
                return InternalServerError(ex);
            }
        }
        #region Construtores
        public UsuarioController()
        {

        }
        #endregion


    }
}
