using Owin;
using RDI_Gerenciador_Usuario.ManagerStart;
using System;
using System.Web.Http;

namespace Nextt_Gestao_Compra.Apresentacao.API
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            try
            {
                log4net.Config.XmlConfigurator.Configure();
                var config = new HttpConfiguration();
                WebApiConfig.Register(config);
                app = Iniciar.RetornConfiguracaoSeguranca(app);
                app.UseWebApi(config);
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }
    }
}