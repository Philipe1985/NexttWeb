using Nextt_Gestao_Compra.Dominio.Entidades;
using System.Collections;
using System.Collections.Generic;

namespace Nextt_Gestao_Compra.Dominio.Interfaces.Repositorio.Gerenciamento
{
    public interface IRepositorioAtributo : IRepositorioPadrao<Parametros>
    {
        List<IEnumerable> BuscaAtributosSintetico(string atributoJson);
        List<IEnumerable> BuscaAtributoEditar(string atributoJson);
        void SalvarAtributo(string atributoJson);
        void ExluirAtributo(string atributoJson);
        List<IEnumerable> CarregaFiltrosPesquisa();
    }
}
