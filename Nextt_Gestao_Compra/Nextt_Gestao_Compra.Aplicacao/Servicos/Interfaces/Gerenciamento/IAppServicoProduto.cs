using Nextt_Gestao_Compra.Dominio.Entidades;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Nextt_Gestao_Compra.Aplicacao.Servicos.Interfaces.Gerenciamento
{
   public interface IAppServicoProduto : IAppServicoPadrao<Parametros>
    {
        List<IEnumerable> RetornaDadosProdutoEditar(Parametros parametros);
        List<IEnumerable> RetornaDadosCadastroProduto(Parametros parametros);
        List<TipoLista> RetornaAtributosTipoLista(List<Atributo> _listaAttr);
        List<Atributo> RetornaAtributosCampos(List<Atributo> _listaAttr);
        List<string> RetornaDescricaoCor(List<Cor> _listaCores);
        List<GrupoTamanho> RetornaTamanhosAtivo(List<GrupoTamanho> _listaTamanho);
        List<Cor> RetornaCoresPrincipais(List<Cor> _listaCores);
        List<string> RetornaCSSCor(List<Cor> _listaCores);
        int GravarProduto(string produtoJson);

    }
}
