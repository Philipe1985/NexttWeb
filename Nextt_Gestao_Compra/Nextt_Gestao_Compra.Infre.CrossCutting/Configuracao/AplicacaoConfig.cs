using AutoMapper;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Nextt_Gestao_Compra.Dominio.Interfaces.Repositorio;
using Nextt_Gestao_Compra.Dominio.Interfaces.Servico;
using Nextt_Gestao_Compra.Dominio.Servicos;
using Nextt_Gestao_Compra.Infra.Dados.Repositorios;
using Nextt_Gestao_Compra.Infre.CrossCutting.Helpers.AutoMapper;
using RDI_Gerenciador_Usuario.ManagerStart;
using Microsoft.Practices.Unity;
using System.Web.Http;
using Nextt_Gestao_Compra.Aplicacao.Servicos;
using Nextt_Gestao_Compra.Aplicacao.Servicos.Interfaces;

namespace Nextt_Gestao_Compra.Infre.CrossCutting.Configuracao
{
    public class AplicacaoConfig
    {
        public static UnityResolver RetornaDIContaimer()
        {
            var container = Iniciar.RetornaContainerOwin();
            container.RegisterType(typeof(IRepositorioPadrao<>), typeof(RepositorioPadrao<>));
            container.RegisterType(typeof(IServicoPadrao<>), typeof(ServicoPadrao<>));
            container.RegisterType(typeof(IAppServicoPadrao<>), typeof(AppServicoPadrao<>));

            container.RegisterType<Aplicacao.Servicos.Interfaces.Gerenciamento.IAppServicoCompra, 
                Aplicacao.Servicos.Gerenciamento.AppServicoCompra>();
            container.RegisterType<Aplicacao.Servicos.Interfaces.Gerenciamento.IAppServicoGrupo,
                Aplicacao.Servicos.Gerenciamento.AppServicoGrupo>();
            container.RegisterType<Aplicacao.Servicos.Interfaces.Gerenciamento.IAppServicoPedido,
                Aplicacao.Servicos.Gerenciamento.AppServicoPedido>();

            container.RegisterType<Dominio.Interfaces.Servico.Gerenciamento.IServicoCompra,
                Dominio.Servicos.Gerenciamento.ServicoCompra>();
            container.RegisterType<Dominio.Interfaces.Servico.Gerenciamento.IServicoGrupo,
                Dominio.Servicos.Gerenciamento.ServicoGrupo>();
            container.RegisterType<Dominio.Interfaces.Servico.Gerenciamento.IServicoPedido,
                Dominio.Servicos.Gerenciamento.ServicoPedido>();

            container.RegisterType<Dominio.Interfaces.Repositorio.Gerenciamento.IRepositorioCompra, 
                Infra.Dados.Repositorios.Gerenciamento.RepositorioCompra>();
            container.RegisterType<Dominio.Interfaces.Repositorio.Gerenciamento.IRepositorioGrupo,
                Infra.Dados.Repositorios.Gerenciamento.RepositorioGrupo>();
            container.RegisterType<Dominio.Interfaces.Repositorio.Gerenciamento.IRepositorioPedido,
                Infra.Dados.Repositorios.Gerenciamento.RepositorioPedido>();

            return new UnityResolver(container);
        }
        public static void RegisgrarMapeamento()
        {
            Mapper.Initialize(x =>
            {
                x.AddProfile<DomainToViewModelMappingProfile>();
                x.AddProfile<ViewModelToDomainMappingProfile>();
            });
        }


        public static HttpConfiguration RegistraConfiguracaoGlobal(HttpConfiguration config)
        {
            //Remove o XML
            var formatters = config.Formatters;
            formatters.Remove(formatters.XmlFormatter);
            // Modifica a identação
            var jsonSettings = formatters.JsonFormatter.SerializerSettings;
            jsonSettings.Formatting = Formatting.Indented;
            jsonSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
            // Modifica a serialização
            formatters.JsonFormatter.SerializerSettings.PreserveReferencesHandling = PreserveReferencesHandling.None;
            return config;
        }
    }
}
