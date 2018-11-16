using Nextt_Gestao_Compra.Aplicacao.Servicos.Interfaces.Gerenciamento;
using Nextt_Gestao_Compra.Dominio.Entidades;
using Nextt_Gestao_Compra.Dominio.Interfaces.Servico.Gerenciamento;
using System.Collections;
using System.Collections.Generic;

namespace Nextt_Gestao_Compra.Aplicacao.Servicos.Gerenciamento
{
    public class AppServicoCompra : AppServicoPadrao<Parametros>, IAppServicoCompra
    {
        private readonly IServicoCompra _servicoCompra;
        public AppServicoCompra(IServicoCompra servicoCompra) : base(servicoCompra)
        {
            _servicoCompra = servicoCompra;
        }

        public List<GrupoTamanho> AtualizaCargaTamanho(Parametros parametros)
        {
            return _servicoCompra.AtualizaCargaTamanho(parametros);
        }

        public List<IEnumerable> AtualizaFiltrosCadastroProduto(Parametros parametros)
        {
            return _servicoCompra.AtualizaFiltrosCadastroProduto(parametros);
        }

        public List<IEnumerable> BuscaProdutosFiltrados(Parametros parametros)
        {
            return _servicoCompra.BuscaProdutosFiltrados(parametros);
        }

        public int GravarPedido(string pedidoJson)
        {
            return _servicoCompra.GravarPedido(pedidoJson);
        }

        public List<Atributos> RetornaAtributosCampos(List<Atributos> _listaAttr)
        {
            return _servicoCompra.RetornaAtributosCampos(_listaAttr);
        }

        public List<TipoLista> RetornaAtributosTipoLista(List<Atributos> _listaAttr)
        {
            return _servicoCompra.RetornaAtributosTipoLista(_listaAttr);
        }

        public List<IEnumerable> RetornaCargaEspeciesFiltros(string secoes)
        {
            return _servicoCompra.RetornaCargaEspeciesFiltros(secoes);
        }

        public List<IEnumerable> RetornaCargaInicialCadNovo(Parametros parametros)
        {
            return _servicoCompra.RetornaCargaInicialCadNovo(parametros);
        }

        public List<IEnumerable> RetornaCargaInicialFiltros()
        {
            return _servicoCompra.RetornaCargaInicialFiltros();
        }

        public List<Cor> RetornaCoresPrincipais(List<Cor> _listaCores)
        {
            return _servicoCompra.RetornaCoresPrincipais(_listaCores);
        }

        public List<string> RetornaCSSCor(List<Cor> _listaCores)
        {
            return _servicoCompra.RetornaCSSCor(_listaCores);
        }

        public List<IEnumerable> RetornaDadosPrePedido(Parametros parametros)
        {
            return _servicoCompra.RetornaDadosPrePedido(parametros);
        }

        public List<string> RetornaDescricaoCor(List<Cor> _listaCores)
        {
            return _servicoCompra.RetornaDescricaoCor(_listaCores);
        }

        public List<IEnumerable> RetornaFiliaisDistribuicao(Parametros parametros)
        {
            return _servicoCompra.RetornaFiliaisDistribuicao(parametros);
        }

        public List<FotoProduto> RetornaFotosProduto(Parametros parametros)
        {
            return _servicoCompra.RetornaFotosProduto(parametros);
        }

        public List<IEnumerable> RetornaGruposCadastrados()
        {
            return _servicoCompra.RetornaGruposCadastrados();
        }

        public List<IEnumerable> RetornaInformacaoFornecedorCompra(Parametros parametros)
        {
            return _servicoCompra.RetornaInformacaoFornecedorCompra(parametros);
        }

        public List<GrupoTamanho> RetornaTamanhosAtivo(List<GrupoTamanho> _listaTamanho)
        {
            return _servicoCompra.RetornaTamanhosAtivo(_listaTamanho);
        }

        public FotoProduto SalvarFotosProduto(FotoProduto fotoJson)
        {
           return _servicoCompra.SalvarFotosProduto(fotoJson);
        }
    }
}
