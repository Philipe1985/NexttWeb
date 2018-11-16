using Newtonsoft.Json.Linq;
using Nextt_Gestao_Compra.Aplicacao.Gerenciador.Compra;
using Nextt_Gestao_Compra.Aplicacao.Servicos.Interfaces.Gerenciamento;
using Nextt_Gestao_Compra.Aplicacao.ViewModel;
using System;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace Nextt_Gestao_Compra.Apresentacao.API.Controllers.Gerenciamento
{
    [RoutePrefix("api/gestaocompra/gerenciamento/compra")]
    public class CompraController : PadraoController
    {
        private readonly IAppServicoCompra _compraServico;
        public CompraController(IAppServicoCompra compraServico)
        {
            _compraServico = compraServico;
        }

        [Authorize]
        [HttpGet]
        [Route("RecuperaFiltrosPesquisaCompra")]
        public IHttpActionResult RecuperaFiltrosPesquisaCompra()
        {
            try
            {
                var retorno = GerenciadorAplicacaoCompra.RetornaDadosFiltroInicial(_compraServico, ModelFabrica);
                return Ok(retorno);
            }
            catch (Exception ex)
            {
                log.Error("Erro ao Recuperar Filtros da Pesquisa de Compra de Grupos", ex);
                return InternalServerError(ex);
            }
        }
        [Authorize]
        [HttpGet]
        [Route("BuscaDadosCadNovo")]
        public IHttpActionResult BuscaDadosCadNovo()
        {
            try
            {
                var retorno = GerenciadorAplicacaoCompra.RetornaDadosCadInicial(_compraServico, ModelFabrica);
                return Ok(retorno);
            }
            catch (Exception ex)
            {
                log.Error("Erro ao Recuperar Dados do Cadastro de Produto", ex);
                return InternalServerError(ex);
            }
        }
        [Authorize]
        [HttpGet]
        [Route("BuscaGruposCadastrado")]
        public IHttpActionResult BuscaGruposCadastrado()
        {
            try
            {
                var retorno = GerenciadorAplicacaoCompra.RetornaGruposCadastrados(_compraServico, ModelFabrica);
                return Ok(retorno);
            }
            catch (Exception ex)
            {
                log.Error("Erro ao Recuperar Grupos Cadastrado", ex);
                return InternalServerError(ex);
            }
        }
        [Authorize]
        [HttpPost]
        [Route("GeraDadosProdutoFiltrado")]
        public IHttpActionResult GeraDadosProdutoFiltrado(ParametrosVM parametro)
        {
            try
            {
                var retorno = GerenciadorAplicacaoCompra.RetornaProdutoFiltrado(_compraServico, parametro);
                return Ok(retorno);
            }
            catch (Exception ex)
            {
                log.Error("Erro ao Recuperar Produtos Filtrados", ex);
                return InternalServerError(ex);
            }
        }
        [Authorize]
        [HttpPost]
        [Route("BuscaEspeciesFiltradas")]
        public IHttpActionResult BuscaEspeciesFiltradas(ParametrosVM parametro)
        {
            try
            {
                var retorno = GerenciadorAplicacaoCompra.RetornaEspeciesFiltradas(_compraServico, parametro, ModelFabrica);
                return Ok(retorno);
            }
            catch (Exception ex)
            {
                log.Error("Erro ao Recuperar Espécies Filtradas", ex);
                return InternalServerError(ex);
            }
        }
        [Authorize]
        [HttpPost]
        [Route("BuscaFiliaisGrupo")]
        public IHttpActionResult BuscaFiliaisGrupo(ParametrosVM parametro)
        {
            try
            {
                var retorno = GerenciadorAplicacaoCompra.RetornaGruposFiliaisDistribuicao(_compraServico, parametro);
                return Ok(retorno);
            }
            catch (Exception ex)
            {
                log.Error("Erro ao Recuperar Filiais dos Grupos", ex);
                return InternalServerError(ex);
            }
        }
        [Authorize]
        [HttpPost]
        [Route("AtualizaFiltrosCadProdCompra")]
        public IHttpActionResult AtualizaFiltrosCadProdCompra(ParametrosVM parametro)
        {
            try
            {
                var retorno = GerenciadorAplicacaoCompra.RetornaFiltrosCadProduto(_compraServico, parametro, ModelFabrica);
                return Ok(retorno);
            }
            catch (Exception ex)
            {
                log.Error("Erro ao Atualizar Filtros do Cadastro de Compra", ex);
                return InternalServerError(ex);
            }
        }

        [Authorize]
        [HttpPost]
        [Route("BuscaDadosPrePedido")]
        public IHttpActionResult BuscaDadosPrePedido(ParametrosVM parametro)
        {
            try
            {
                var retorno = GerenciadorAplicacaoCompra.RetornaDadosCadPrePedido(_compraServico, parametro, ModelFabrica);
                return Ok(retorno);
            }
            catch (Exception ex)
            {
                log.Error("Erro ao Recuperar Dados do Cadastro de Pedido", ex);
                return InternalServerError(ex);
            }
        }
        [Authorize]
        [HttpPost]
        [Route("AtualizaDadosCompraFornecedor")]
        public IHttpActionResult AtualizaDadosCompraFornecedor(ParametrosVM parametro)
        {
            try
            {
                var retorno = GerenciadorAplicacaoCompra.RetornaDadosCompraFornecedor(_compraServico, parametro);
                return Ok(retorno);
            }
            catch (Exception ex)
            {
                log.Error("Erro ao Recuperar Dados do Cadastro de Pedido", ex);
                return InternalServerError(ex);
            }
        }
        [Authorize]
        [HttpPost]
        [Route("BuscaImagensProduto")]
        public IHttpActionResult BuscaImagensProduto(ParametrosVM parametro)
        {
            try
            {
                var retorno = GerenciadorAplicacaoCompra.RecuperaFotosProduto(_compraServico, parametro);
                return Ok(retorno);
            }
            catch (Exception ex)
            {
                log.Error("Erro ao Recuperar Imagens do Produto", ex);
                return InternalServerError(ex);
            }
        }
        [Authorize]
        [HttpPost]
        [Route("RecarregaDadosTamanho")]
        public IHttpActionResult RecarregaDadosTamanho(ParametrosVM parametro)
        {
            try
            {
                var retorno = GerenciadorAplicacaoCompra.RetornaTamanhoDadosNovo(_compraServico, parametro, ModelFabrica);
                return Ok(retorno);
            }
            catch (Exception ex)
            {
                log.Error("Erro ao Recuperar Filtros de Tamanhos", ex);
                return InternalServerError(ex);
            }
        }
        [Authorize]
        [HttpPost]
        [Route("salvarNovoPedido")]
        public IHttpActionResult SalvarNovoPedido(PedidoCompletoVM pedido)
        {
            try
            {
                pedido.Pedido.DataCadastro = DateTime.Parse(pedido.Pedido.DataCadastro).ToString("yyyy-MM-dd HH:mm:ss");
                var retorno = GerenciadorAplicacaoCompra.GravarPedido(_compraServico, pedido);
                return Ok(retorno);
            }
            catch (Exception ex)
            {
                log.Error("Erro ao Salvar o Pedido", ex);
                return InternalServerError(ex);
            }
        }
        [AllowAnonymous]
        [HttpPost]
        [Route("SalvarImagem")]
        public async Task<IHttpActionResult> SalvarImagem()
        {
            try
            {
                var dadosContent = await Request.Content.ReadAsMultipartAsync();
                var objSalvar = new ImagensProdutoVM
                {
                    Extensao = dadosContent.Contents[0].Headers.ContentType.ToString().Split(new char[] { '/' }).ToList().ElementAt(1).ToUpper(),
                    IDProduto = int.Parse(dadosContent.Contents[2].ReadAsStringAsync().Result),
                    Imagem = dadosContent.Contents[0].ReadAsByteArrayAsync().Result
                };

                var retorno = GerenciadorAplicacaoCompra.SalvarFotosProduto(_compraServico, objSalvar);
                return Ok(retorno);
            }
            catch (Exception ex)
            {
                log.Error("Erro ao Salvar Imagem", ex);
                return InternalServerError(ex);
            }
        }
        [AllowAnonymous]
        [HttpPost]
        [Route("ExcluirImagem")]
        public async Task<IHttpActionResult> ExcluirImagem()
        {
            try
            {
                var dadosContent = await Request.Content.ReadAsFormDataAsync();
                var objexcluir = new ImagensProdutoVM
                {
                    IDProduto = int.Parse(dadosContent.Get(2)),
                    IDProdutoFoto = Guid.Parse(dadosContent.Get(1)),
                };
                GerenciadorAplicacaoCompra.SalvarFotosProduto(_compraServico, objexcluir);
                return Ok(JObject.Parse("{}"));
            }
            catch (Exception ex)
            {
                log.Error("Erro ao Excluir Imagens", ex);
                return InternalServerError(ex);
            }
        }
    }
}
