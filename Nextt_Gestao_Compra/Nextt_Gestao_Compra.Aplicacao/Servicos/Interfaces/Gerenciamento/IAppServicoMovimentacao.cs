using Nextt_Gestao_Compra.Dominio.Entidades;
using System.Collections;
using System.Collections.Generic;

namespace Nextt_Gestao_Compra.Aplicacao.Servicos.Interfaces.Gerenciamento
{
    public interface IAppServicoMovimentacao : IAppServicoPadrao<Parametros>
    {
        List<IEnumerable> RetornaSegmentoGrupos();
        List<IEnumerable> RetornaCargaSecaoFiltros(Parametros parametros);
        List<IEnumerable> RetornaCargaRelatorios(Parametros parametros);
    }
}
