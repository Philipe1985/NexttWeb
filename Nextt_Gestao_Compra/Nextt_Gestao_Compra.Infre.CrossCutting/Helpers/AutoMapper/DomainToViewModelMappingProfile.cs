using AutoMapper;
using Nextt_Gestao_Compra.Aplicacao.ViewModel;
using Nextt_Gestao_Compra.Dominio.Entidades;

namespace Nextt_Gestao_Compra.Infre.CrossCutting.Helpers.AutoMapper
{
    public class DomainToViewModelMappingProfile : Profile
    {
        public DomainToViewModelMappingProfile()
        {
            CreateMap<DadosGerenciamentoProdutoCompra, ProdutosFiltradosVM>().ForMember(x=>x.Selecionado,opt=>opt.Ignore());
            CreateMap<Parametros, ParametrosVM>();
            CreateMap<GrupoEmpresa, GrupoEmpresaVM>();
            CreateMap<FotoProduto, ImagensProdutoVM>();
            CreateMap<PedidoConsulta, PedidosFiltradoVM>();
            CreateMap<Grade, GradePadraoVM>();
        }
    }
}
