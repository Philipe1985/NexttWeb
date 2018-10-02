using Nextt_Gestao_Compra.Dominio.Entidades;
using System.Collections;
using System.Collections.Generic;

namespace Nextt_Gestao_Compra.Dominio.Interfaces.Repositorio.Gerenciamento
{
    public interface IRepositorioCompra : IRepositorioPadrao<Parametros>
    {
        List<IEnumerable> BuscaProdutosFiltrados(Parametros parametros);
        List<IEnumerable> AtualizaFiltrosCadastroProduto(Parametros parametros);
        List<IEnumerable> RetornaDadosPrePedido(Parametros parametros);
        List<IEnumerable> RetornaCargaInicialFiltros();
        List<IEnumerable> RetornaGruposCadastrados();
        List<IEnumerable> RetornaFiliaisDistribuicao(Parametros parametros);
        List<IEnumerable> RetornaCargaEspeciesFiltros(string secoes);
        List<IEnumerable> RetornaCargaInicialCadNovo(Parametros parametros);
        List<IEnumerable> AtualizaCargaTamanho(Parametros parametros);
        List<FotoProduto> RetornaFotosProduto(Parametros parametros);
        FotoProduto SalvarFotosProduto(FotoProduto fotoJson);
        int GravarPedido(string pedidoJson);

    }
}
