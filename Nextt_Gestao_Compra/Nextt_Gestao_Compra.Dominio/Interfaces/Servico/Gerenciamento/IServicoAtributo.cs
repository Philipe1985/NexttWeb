using Nextt_Gestao_Compra.Dominio.Entidades;
using System.Collections;
using System.Collections.Generic;

namespace Nextt_Gestao_Compra.Dominio.Interfaces.Servico.Gerenciamento
{
    public interface IServicoAtributo : IServicoPadrao<Parametros>
    {
        List<IEnumerable> BuscaAtributosSintetico(string atributoJson);
        List<IEnumerable> BuscaAtributoEditar(string atributoJson);
        List<IEnumerable> CarregaFiltrosPesquisa();
        void SalvarAtributo(string atributoJson);
        void ExluirAtributo(string atributoJson);
    }
}
