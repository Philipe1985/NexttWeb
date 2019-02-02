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
            container.RegisterType<Aplicacao.Servicos.Interfaces.Gerenciamento.IAppServicoMovimentacao,
                Aplicacao.Servicos.Gerenciamento.AppServicoMovimentacao>();
            container.RegisterType<Aplicacao.Servicos.Interfaces.Gerenciamento.IAppServicoProduto,
                Aplicacao.Servicos.Gerenciamento.AppServicoProduto>();
            container.RegisterType<Aplicacao.Servicos.Interfaces.Gerenciamento.IAppServicoGrupoEmpresa,
                            Aplicacao.Servicos.Gerenciamento.AppServicoGrupoEmpresa>();
            container.RegisterType<Aplicacao.Servicos.Interfaces.Gerenciamento.IAppServicoAtributo,
                                        Aplicacao.Servicos.Gerenciamento.AppServicoAtributo>();

            container.RegisterType<Dominio.Interfaces.Servico.Gerenciamento.IServicoCompra,
                Dominio.Servicos.Gerenciamento.ServicoCompra>();
            container.RegisterType<Dominio.Interfaces.Servico.Gerenciamento.IServicoGrupo,
                Dominio.Servicos.Gerenciamento.ServicoGrupo>();
            container.RegisterType<Dominio.Interfaces.Servico.Gerenciamento.IServicoPedido,
                Dominio.Servicos.Gerenciamento.ServicoPedido>();
            container.RegisterType<Dominio.Interfaces.Servico.Gerenciamento.IServicoMovimentacao,
                Dominio.Servicos.Gerenciamento.ServicoMovimentacao>();
            container.RegisterType<Dominio.Interfaces.Servico.Gerenciamento.IServicoProduto,
                Dominio.Servicos.Gerenciamento.ServicoProduto>();
            container.RegisterType<Dominio.Interfaces.Servico.Gerenciamento.IServicoGrupoEmpresa,
                            Dominio.Servicos.Gerenciamento.ServicoGrupoEmpresa>();
            container.RegisterType<Dominio.Interfaces.Servico.Gerenciamento.IServicoAtributo,
                                        Dominio.Servicos.Gerenciamento.ServicoAtributo>();

            container.RegisterType<Dominio.Interfaces.Repositorio.Gerenciamento.IRepositorioCompra, 
                Infra.Dados.Repositorios.Gerenciamento.RepositorioCompra>();
            container.RegisterType<Dominio.Interfaces.Repositorio.Gerenciamento.IRepositorioGrupo,
                Infra.Dados.Repositorios.Gerenciamento.RepositorioGrupo>();
            container.RegisterType<Dominio.Interfaces.Repositorio.Gerenciamento.IRepositorioPedido,
                Infra.Dados.Repositorios.Gerenciamento.RepositorioPedido>();
            container.RegisterType<Dominio.Interfaces.Repositorio.Gerenciamento.IRepositorioMovimentacao,
                Infra.Dados.Repositorios.Gerenciamento.RepositorioMovimentacao>();
            container.RegisterType<Dominio.Interfaces.Repositorio.Gerenciamento.IRepositorioProduto,
                Infra.Dados.Repositorios.Gerenciamento.RepositorioProduto>();
            container.RegisterType<Dominio.Interfaces.Repositorio.Gerenciamento.IRepositorioGrupoEmpresa,
                            Infra.Dados.Repositorios.Gerenciamento.RepositorioGrupoEmpresa>();
            container.RegisterType<Dominio.Interfaces.Repositorio.Gerenciamento.IRepositorioAtributo,
                                        Infra.Dados.Repositorios.Gerenciamento.RepositorioAtributo>();

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
