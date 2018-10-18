using Nextt_Gestao_Compra.Dominio.Entidades;
using System.Collections;
using System.Collections.Generic;

namespace Nextt_Gestao_Compra.Dominio.Interfaces.Servico.Gerenciamento
{
    public interface IServicoCompra : IServicoPadrao<Parametros>
    {
        List<IEnumerable> BuscaProdutosFiltrados(Parametros parametros);
        List<IEnumerable> RetornaCargaInicialFiltros();
        List<IEnumerable> RetornaCargaEspeciesFiltros(string secoes);
        List<IEnumerable> AtualizaFiltrosCadastroProduto(Parametros parametros);
        List<IEnumerable> RetornaDadosPrePedido(Parametros parametros);
        List<IEnumerable> RetornaCargaInicialCadNovo(Parametros parametros);
        List<IEnumerable> RetornaGruposCadastrados();
        List<GrupoTamanho> AtualizaCargaTamanho(Parametros parametros);
        List<IEnumerable> RetornaFiliaisDistribuicao(Parametros parametros);
        List<string> RetornaDescricaoCor(List<Cor> _listaCores);
        List<GrupoTamanho> RetornaTamanhosAtivo(List<GrupoTamanho> _listaTamanho);
        List<Cor> RetornaCoresPrincipais(List<Cor> _listaCores);
        List<string> RetornaCSSCor(List<Cor> _listaCores);
        List<FotoProduto> RetornaFotosProduto(Parametros parametros);
        FotoProduto SalvarFotosProduto(FotoProduto fotoJson);
        int GravarPedido(string pedidoJson);
        List<TipoLista> RetornaAtributosTipoLista(List<Atributos> _listaAttr);
        List<Atributos> RetornaAtributosCampos(List<Atributos> _listaAttr);


    }
}
