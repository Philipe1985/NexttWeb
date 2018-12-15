using Nextt_Gestao_Compra.Dominio.Entidades;
using System.Collections;
using System.Collections.Generic;

namespace Nextt_Gestao_Compra.Dominio.Interfaces.Servico.Gerenciamento
{
    public interface IServicoProduto : IServicoPadrao<Parametros>
    {
        List<IEnumerable> RetornaDadosProdutoEditar(Parametros parametros);
        List<IEnumerable> RetornaDadosCadastroProduto(Parametros parametros);
        List<TipoLista> RetornaAtributosTipoLista(List<Atributos> _listaAttr);
        List<Atributos> RetornaAtributosCampos(List<Atributos> _listaAttr);
        List<string> RetornaDescricaoCor(List<Cor> _listaCores);
        List<GrupoTamanho> RetornaTamanhosAtivo(List<GrupoTamanho> _listaTamanho);
        List<Cor> RetornaCoresPrincipais(List<Cor> _listaCores);
        List<string> RetornaCSSCor(List<Cor> _listaCores);
        int GravarProduto(string produtoJson);
    }
}
