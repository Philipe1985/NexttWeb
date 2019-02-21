using Nextt_Gestao_Compra.Dominio.Entidades;
using System.Collections;
using System.Collections.Generic;

namespace Nextt_Gestao_Compra.Aplicacao.Servicos.Interfaces.Gerenciamento
{
    public interface IAppServicoDistribuicao : IAppServicoPadrao<Parametros>
    {
        List<IEnumerable> CarregaFiltrosPesquisa();
    }
}
