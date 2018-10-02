using Nextt_Gestao_Compra.Dominio.Entidades;
using Nextt_Gestao_Compra.Dominio.Interfaces.Repositorio.Gerenciamento;
using Nextt_Gestao_Compra.Dominio.Interfaces.Servico.Gerenciamento;
using System.Collections;
using System.Collections.Generic;
using System.Linq;

namespace Nextt_Gestao_Compra.Dominio.Servicos.Gerenciamento
{
    public class ServicoCompra : ServicoPadrao<Parametros>, IServicoCompra
    {
        private readonly IRepositorioCompra _compraRepositorio;
        public ServicoCompra(IRepositorioCompra compraRepositorio) : base(compraRepositorio)
        {
            _compraRepositorio = compraRepositorio;
        }

        public List<IEnumerable> AtualizaCargaTamanho(Parametros parametros)
        {
            return _compraRepositorio.AtualizaCargaTamanho(parametros);
        }

        public List<IEnumerable> AtualizaFiltrosCadastroProduto(Parametros parametros)
        {
            return _compraRepositorio.AtualizaFiltrosCadastroProduto(parametros);
        }

        public List<IEnumerable> BuscaProdutosFiltrados(Parametros parametros)
        {
            return _compraRepositorio.BuscaProdutosFiltrados(parametros);
        }

        public List<IEnumerable> RetornaCargaEspeciesFiltros(string secoes)
        {
            return _compraRepositorio.RetornaCargaEspeciesFiltros(secoes);
        }

        public List<IEnumerable> RetornaCargaInicialCadNovo(Parametros parametros)
        {
            return _compraRepositorio.RetornaCargaInicialCadNovo(parametros);
        }

        public List<IEnumerable> RetornaCargaInicialFiltros()
        {
            return _compraRepositorio.RetornaCargaInicialFiltros();
        }

        public List<Cor> RetornaCoresPrincipais(List<Cor> _listaCores)
        {
            return _listaCores.OrderBy(x => x.Descricao).Where(x => x.VisivelSelecao == true).ToList();
        }

        public List<string> RetornaCSSCor(List<Cor> _listaCores)
        {
            return _listaCores.OrderBy(x => x.Descricao).Where(x => x.CorRGB.Split('/').Count() < 2).Select(x => "rgb(" + x.CorRGB + ")").ToList();
        }

        public List<IEnumerable> RetornaDadosPrePedido(Parametros parametros)
        {
            return _compraRepositorio.RetornaDadosPrePedido(parametros);
        }

        public List<string> RetornaDescricaoCor(List<Cor> _listaCores)
        {
            return _listaCores.OrderBy(x => x.Descricao).Where(x => x.CorRGB.Split('/').Count() < 2).Select(x => x.Descricao).ToList();
        }

        public List<IEnumerable> RetornaGruposCadastrados()
        {
            return _compraRepositorio.RetornaGruposCadastrados();
        }

        public List<GrupoTamanho> RetornaTamanhosAtivo(List<GrupoTamanho> _listaTamanho)
        {
            return _listaTamanho.OrderBy(x => x.Ordem).Where(x => x.Ativo == true).ToList();
        }



        public List<IEnumerable> RetornaFiliaisDistribuicao(Parametros parametros)
        {
            return _compraRepositorio.RetornaFiliaisDistribuicao(parametros);
        }

        public List<FotoProduto> RetornaFotosProduto(Parametros parametros)
        {
            return _compraRepositorio.RetornaFotosProduto(parametros);
        }

        public FotoProduto SalvarFotosProduto(FotoProduto fotoJson)
        {
           return _compraRepositorio.SalvarFotosProduto(fotoJson);
        }

        public int GravarPedido(string pedidoJson)
        {
            return _compraRepositorio.GravarPedido(pedidoJson);
        }
    }
}
