using Nextt_Gestao_Compra.Infre.CrossCutting.Configuracao;
using System.Web.Http;

namespace Nextt_Gestao_Compra.Apresentacao.API
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
            config.DependencyResolver = AplicacaoConfig.RetornaDIContaimer();
            // Rotas da API da Web
            AplicacaoConfig.RegisgrarMapeamento();
            config = AplicacaoConfig.RegistraConfiguracaoGlobal(config);
        }
    }
}
