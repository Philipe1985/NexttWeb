using Nextt_Gestao_Compra.Aplicacao.Servicos.Interfaces.Gerenciamento;
using Nextt_Gestao_Compra.Dominio.Entidades;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Nextt_Gestao_Compra.Aplicacao.ViewModel
{
    public class FiltrosPesquisa
    {
        public List<ComboFiltroVM> Fornecedores { get; set; }
        public List<ComboFiltroVM> Secoes { get; set; }
        public List<ComboFiltroVM> Segmentos { get; set; }
        public List<ComboFiltroVM> GruposFiliais { get; set; }
        public List<ComboFiltroVM> Marcas { get; set; }
        public List<ComboFiltroVM> Especies { get; set; }
        public List<ComboFiltroVM> FormaPgto { get; set; }
        public List<ComboFiltroVM> CondicaoPgto { get; set; }
        public List<ComboFiltroVM> Cores { get; set; }
        public List<ComboFiltroVM> Referencias { get; set; }
        public List<ComboFiltroVM> Classificacao { get; set; }
        public List<ComboFiltroVM> Usuarios { get; set; }
        public List<ComboFiltroVM> TamanhoOpcoes { get; set; }
        public List<ComboFiltroVM> TamanhoGrupo { get; set; }
        public TamanhoGrupoVM Tamanhos { get; set; }
        public PaletaDadosVM DadosPaleta { get; set; }
        public List<GruposValidadosVM> RelacionamentoGrupos { get; set; }
        public List<bool> OrdemPed { get; set; }
        public List<bool> OrdemProd { get; set; }
        public List<ComboAtributoVM> AttrListaProd { get; set; }
        public List<ComboAtributoVM> AttrListaPed { get; set; }
        public List<AtributoElementoVM> AttrEleListaProd { get; set; }
        public List<AtributoElementoVM> AttrEleListaPed { get; set; }
        public FiltrosPesquisa(List<ComboFiltroVM> _fornecedores, List<ComboFiltroVM> _secoes, List<ComboFiltroVM> _marcas)
        {
            Fornecedores = _fornecedores;
            Secoes = _secoes;
            Marcas = _marcas;
        }

        public FiltrosPesquisa(IAppServicoCompra compraServico, FabricaViewModel fabrica, List<Cor> cores, List<ComboFiltroVM> _fornecedores,
            List<ComboFiltroVM> _secoes, List<ComboFiltroVM> _marcas, List<GrupoTamanho> tamanhos)
        {
            Fornecedores = _fornecedores;
            Secoes = _secoes;
            Marcas = _marcas;
            Tamanhos = new TamanhoGrupoVM(compraServico, fabrica, tamanhos); 
            Cores = compraServico.RetornaCoresPrincipais(cores).Select(x => fabrica.Criar(x)).ToList();
            DadosPaleta = new PaletaDadosVM(compraServico.RetornaCSSCor(cores), compraServico.RetornaDescricaoCor(cores));
        }
         
        public FiltrosPesquisa(DadosPrePedido dadosCadastro, IAppServicoCompra compraServico, FabricaViewModel fabrica, List<Cor> cores,
            List<GrupoTamanho> tamanhos, List<ReferenciaProduto> referencias)
        {
            Fornecedores = new List<ComboFiltroVM>() { fabrica.Criar(fabrica.CriarFornecedor(dadosCadastro)) };
            Marcas = new List<ComboFiltroVM>() { fabrica.Criar(fabrica.CriarMarca(dadosCadastro)) };
            Secoes = new List<ComboFiltroVM>() { fabrica.Criar(fabrica.CriarSecao(dadosCadastro)) };
            Especies = new List<ComboFiltroVM>() { fabrica.Criar(fabrica.CriarEspecie(dadosCadastro)) };
            TamanhoGrupo = new List<ComboFiltroVM>() { fabrica.Criar(
                new GrupoTamanho { IDTamanho = dadosCadastro.IDGrupoTamanho,
                                   Descricao = dadosCadastro.DescricaoGrupoTamanho,
                                   Ordem = 1
                                 }
                )};
            TamanhoOpcoes = compraServico.RetornaTamanhosAtivo(tamanhos).Select(x => fabrica.Criar(x)).ToList();
            Cores = compraServico.RetornaCoresPrincipais(cores).Select(x => fabrica.Criar(x)).ToList();
            Referencias = referencias.Select(x => fabrica.Criar(x)).ToList();
            DadosPaleta = new PaletaDadosVM(compraServico.RetornaCSSCor(cores), compraServico.RetornaDescricaoCor(cores));
        }
        public FiltrosPesquisa(PedidoCadastrado dadosCadastro, FabricaViewModel fabrica, List<Cor> cores, IAppServicoPedido pedidoServico)
        {
            Fornecedores = new List<ComboFiltroVM>() { fabrica.Criar(
                new Fornecedor { IDFornecedor = dadosCadastro.IDFornecedor,
                                 NomeFantasia = dadosCadastro.NomeFantasia,
                                 RazaoSocial = dadosCadastro.RazaoSocial,
                                 CNPJ = String.Empty
                               }
                )};
            Marcas = new List<ComboFiltroVM>() { fabrica.Criar(
                new Marca { IDMarca = dadosCadastro.IDMarca,
                            Nome = dadosCadastro.DescricaoMarca
                          }
                )};
            Secoes = new List<ComboFiltroVM>() { fabrica.Criar(
                new Secao { IDSecao = dadosCadastro.IDSecao,
                            Descricao = dadosCadastro.DescricaoSecao
                          }
                )};
            Especies = new List<ComboFiltroVM>() { fabrica.Criar(
                new Especie { IDEspecie = dadosCadastro.IDEspecie,
                              DescricaoEspecie = dadosCadastro.DescricaoEspecie,
                              DescricaoSecao = dadosCadastro.DescricaoSecao
                            }
                )};
            TamanhoGrupo = new List<ComboFiltroVM>() { fabrica.Criar(
                new GrupoTamanho { IDTamanho = dadosCadastro.IDGrupoTamanho,
                                   Descricao = dadosCadastro.DescricaoGrupoTamanho
                                 }
                )};
            Cores = pedidoServico.RetornaCoresPrincipais(cores).Select(x => fabrica.Criar(x)).ToList();
            DadosPaleta = new PaletaDadosVM(pedidoServico.RetornaCSSCor(cores), pedidoServico.RetornaDescricaoCor(cores));
        }
        public FiltrosPesquisa(List<Segmento> segmentos, FabricaViewModel fabrica)
        {
            Segmentos = segmentos.Select(x => fabrica.Criar(x)).ToList();
        }

    }
}
