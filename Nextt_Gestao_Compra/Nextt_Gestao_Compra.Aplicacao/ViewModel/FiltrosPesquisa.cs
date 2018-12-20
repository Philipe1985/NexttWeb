using Nextt_Gestao_Compra.Aplicacao.Servicos.Interfaces.Gerenciamento;
using Nextt_Gestao_Compra.Dominio.Entidades;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Nextt_Gestao_Compra.Aplicacao.ViewModel
{
    public class FiltrosPesquisa
    {
        public string AtributoFornecedor { get; set; }
        public string AtributoValor { get; set; }
        public string MarcaSelecionada { get; set; }
        public List<ComboFiltroVM> Fornecedores { get; set; }
        public List<ComboFiltroVM> StatusPedido { get; set; }
        public List<ComboFiltroVM> AttrFornecedores { get; set; }
        public List<RetornoEspecieFiltroVM> EspeciesRecarga { get; set; }
        public List<ComboFiltroVM> Compradores { get; set; }
        public List<ComboFiltroVM> CompradoresProduto { get; set; }
        public List<ComboFiltroVM> UniMedida { get; set; }
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
        public List<GrupoEmpresaPrecosVM> GrupoEmpresaPrecos { get; set; }
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
        public DadosConfigPadraoVM DadosConfigPadrao { get; set; }
        public List<AtributoElementoVM> AttrEleListaPed { get; set; }
        public FiltrosPesquisa(List<ComboFiltroVM> _fornecedores, List<ComboFiltroVM> _segmentos, List<ComboFiltroVM> _marcas)
        {
            Fornecedores = _fornecedores;
            Segmentos = _segmentos;
            Marcas = _marcas;
        }

        public FiltrosPesquisa(IAppServicoCompra compraServico, FabricaViewModel fabrica, List<Cor> cores, List<ComboFiltroVM> _fornecedores,
            List<ComboFiltroVM> _segmentos, List<ComboFiltroVM> _marcas, List<GrupoTamanho> tamanhos, DadosConfigPadraoVM configDefault)
        {
            Fornecedores = _fornecedores;
            Segmentos = _segmentos;
            Marcas = _marcas;
            Tamanhos = new TamanhoGrupoVM(compraServico, fabrica, tamanhos);
            Cores = compraServico.RetornaCoresPrincipais(cores).Select(x => fabrica.Criar(x)).ToList();
            DadosPaleta = new PaletaDadosVM(compraServico.RetornaCSSCor(cores), compraServico.RetornaDescricaoCor(cores));
            DadosConfigPadrao = configDefault;
        }

        public FiltrosPesquisa(DadosPrePedido dadosCadastro, IAppServicoCompra compraServico, FabricaViewModel fabrica, List<Cor> cores,
            List<GrupoTamanho> tamanhos, List<ReferenciaProduto> referencias, DadosConfigPadraoVM configDefault)
        {
            if (dadosCadastro.Ativo)
                Marcas = new List<ComboFiltroVM>() { fabrica.Criar(
                new Marca { IDMarca = dadosCadastro.IDMarca,
                            Nome = dadosCadastro.DescricaoMarca
                          }
                )};
            else
            {
                MarcaSelecionada = dadosCadastro.IDMarca.ToString();
            }
            Secoes = new List<ComboFiltroVM>() { fabrica.Criar(fabrica.CriarSecao(dadosCadastro)) };
            Segmentos = new List<ComboFiltroVM>() { fabrica.Criar(fabrica.CriarSegmento(dadosCadastro)) };
            Especies = new List<ComboFiltroVM>() { fabrica.Criar(fabrica.CriarEspecie(dadosCadastro)) };
            TamanhoGrupo = new List<ComboFiltroVM>() { fabrica.Criar(
                new GrupoTamanho { IDTamanho = dadosCadastro.IDGrupoTamanho,
                                   Descricao = dadosCadastro.DescricaoGrupoTamanho,
                                   Ordem = 1
                                 }
                )};
            DadosConfigPadrao = configDefault;
            TamanhoOpcoes = compraServico.RetornaTamanhosAtivo(tamanhos).Select(x => fabrica.Criar(x)).ToList();
            Cores = compraServico.RetornaCoresPrincipais(cores).Select(x => fabrica.Criar(x)).ToList();
            Referencias = referencias.Select(x => fabrica.Criar(x)).ToList();
            DadosPaleta = new PaletaDadosVM(compraServico.RetornaCSSCor(cores), compraServico.RetornaDescricaoCor(cores));
        }
        public FiltrosPesquisa(DadosPrePedido dadosCadastro, IAppServicoProduto produtoServico, FabricaViewModel fabrica, List<Cor> cores,
            List<GrupoTamanho> tamanhos, List<ReferenciaProduto> referencias)
        {
            if (dadosCadastro.Ativo)
                Marcas = new List<ComboFiltroVM>() { fabrica.Criar(
                new Marca { IDMarca = dadosCadastro.IDMarca,
                            Nome = dadosCadastro.DescricaoMarca
                          }
                )};
            else
            {
                MarcaSelecionada = dadosCadastro.IDMarca.ToString();
            }
            Secoes = new List<ComboFiltroVM>() { fabrica.Criar(fabrica.CriarSecao(dadosCadastro)) };
            Segmentos = new List<ComboFiltroVM>() { fabrica.Criar(fabrica.CriarSegmento(dadosCadastro)) };
            Especies = new List<ComboFiltroVM>() { fabrica.Criar(fabrica.CriarEspecie(dadosCadastro)) };
            TamanhoGrupo = new List<ComboFiltroVM>() { fabrica.Criar(
                new GrupoTamanho { IDTamanho = dadosCadastro.IDGrupoTamanho,
                                   Descricao = dadosCadastro.DescricaoGrupoTamanho,
                                   Ordem = 1
                                 }
                )};
            TamanhoOpcoes = produtoServico.RetornaTamanhosAtivo(tamanhos).Select(x => fabrica.Criar(x)).ToList();
            Cores = produtoServico.RetornaCoresPrincipais(cores).Select(x => fabrica.Criar(x)).ToList();
            Referencias = referencias.Select(x => fabrica.Criar(x)).ToList();
            DadosPaleta = new PaletaDadosVM(produtoServico.RetornaCSSCor(cores), produtoServico.RetornaDescricaoCor(cores));
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
            if (dadosCadastro.Ativo)
                Marcas = new List<ComboFiltroVM>() { fabrica.Criar(
                new Marca { IDMarca = dadosCadastro.IDMarca,
                            Nome = dadosCadastro.DescricaoMarca
                          }
                )};
            else
            {
                MarcaSelecionada = dadosCadastro.IDMarca.ToString();
            }
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
            Segmentos = new List<ComboFiltroVM>() { fabrica.Criar(
                new Segmento { IDSegmento = dadosCadastro.IDSegmento,
                              Descricao = dadosCadastro.DescricaoSegmento,
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
        public FiltrosPesquisa(List<RetornoEspecieFiltroVM> especieFiltroVMs)
        {
            EspeciesRecarga = especieFiltroVMs;
        }
    }
}
