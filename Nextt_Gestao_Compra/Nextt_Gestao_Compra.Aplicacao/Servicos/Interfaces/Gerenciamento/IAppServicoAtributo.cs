using Nextt_Gestao_Compra.Dominio.Entidades;
using System.Collections;
using System.Collections.Generic;

namespace Nextt_Gestao_Compra.Aplicacao.Servicos.Interfaces.Gerenciamento
{
    public interface IAppServicoAtributo : IAppServicoPadrao<Parametros>
    {
        List<IEnumerable> BuscaAtributosSintetico(string atributoJson);
        List<IEnumerable> BuscaAtributoEditar(string atributoJson);
        List<IEnumerable> CarregaFiltrosPesquisa();
        void SalvarAtributo(string atributoJson);
        void ExluirAtributo(string atributoJson);
    }
}
