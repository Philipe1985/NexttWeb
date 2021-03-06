﻿using AutoMapper;
using Nextt_Gestao_Compra.Aplicacao.ViewModel;
using Nextt_Gestao_Compra.Dominio.Entidades;

namespace Nextt_Gestao_Compra.Infre.CrossCutting.Helpers.AutoMapper
{
    public class ViewModelToDomainMappingProfile : Profile
    {
        public ViewModelToDomainMappingProfile()
        {
            CreateMap<ProdutosFiltradosVM, DadosGerenciamentoProdutoCompra>().ForSourceMember(x => x.Selecionado, opt => opt.Ignore());
            CreateMap<ParametrosVM, Parametros>();
            CreateMap<GrupoEmpresaVM, GrupoEmpresa>();
            CreateMap<ImagensProdutoVM, FotoProduto>();
            CreateMap<PedidosFiltradoVM, PedidoConsulta>();
            CreateMap<EntradasNFVM, EntradaNF>();
            CreateMap<GradePadraoVM, Grade>();
            CreateMap<TituloNFVM, TituloNF>();
        }
    }
}