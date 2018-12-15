using Nextt_Gestao_Compra.Dominio.Entidades;
using System.Collections;
using System.Collections.Generic;

namespace Nextt_Gestao_Compra.Dominio.Interfaces.Repositorio.Gerenciamento
{
    public interface IRepositorioProduto : IRepositorioPadrao<Parametros>
    {
        List<IEnumerable> RetornaDadosProdutoEditar(Parametros parametros);
        List<IEnumerable> RetornaDadosCadastroProduto(Parametros parametros);
        int GravarProduto(string produtoJson);

    }
}
