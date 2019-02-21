using Nextt_Gestao_Compra.Aplicacao.Gerenciador.Distribuicoes;
using Nextt_Gestao_Compra.Aplicacao.Servicos.Interfaces.Gerenciamento;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Nextt_Gestao_Compra.Apresentacao.API.Controllers.Gerenciamento
{
    [RoutePrefix("api/gestaocompra/gerenciamento/distribuicao")]
    public class DistribuicaoController : PadraoController
    {
        private readonly IAppServicoDistribuicao _distribuicaoServico;
        public DistribuicaoController(IAppServicoDistribuicao distribuicaoServico)
        {
            _distribuicaoServico = distribuicaoServico;
        }

        [Authorize]
        [HttpGet]
        [Route("RecuperaFiltrosDistribuicao")]
        public IHttpActionResult RecuperaFiltrosDistribuicao()
        {
            try
            {
                var retorno = GerenciadorAplicacaoDistribuicao.RetornaDadosFiltroInicial(_distribuicaoServico, ModelFabrica);
                return Ok(retorno);
            }
            catch (Exception ex)
            {
                log.Error("Erro ao Recuperar Filtros de Distribuição", ex);
                return InternalServerError(ex);
            }
        }
    }
}
