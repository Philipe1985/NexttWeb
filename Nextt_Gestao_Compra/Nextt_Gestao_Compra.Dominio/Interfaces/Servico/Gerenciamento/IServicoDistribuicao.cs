using Nextt_Gestao_Compra.Dominio.Entidades;
using System.Collections;
using System.Collections.Generic;

namespace Nextt_Gestao_Compra.Dominio.Interfaces.Servico.Gerenciamento
{
    public interface IServicoDistribuicao : IServicoPadrao<Parametros>
    {
        List<IEnumerable> CarregaFiltrosPesquisa();
    }
}
