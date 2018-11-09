using Nextt_Gestao_Compra.Dominio.Entidades;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Nextt_Gestao_Compra.Aplicacao.Servicos.Interfaces.Gerenciamento
{
    public interface IAppServicoMovimentacao : IAppServicoPadrao<Parametros>
    {
        List<IEnumerable> RetornaSegmentoGrupos();
        List<IEnumerable> RetornaCargaSecaoFiltros(Parametros parametros);
        List<IEnumerable> RetornaCargaEspeciesFiltros(Parametros parametros);
    }
}
