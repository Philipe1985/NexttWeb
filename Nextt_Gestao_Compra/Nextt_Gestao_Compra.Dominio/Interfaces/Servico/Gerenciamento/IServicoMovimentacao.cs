using Nextt_Gestao_Compra.Dominio.Entidades;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Nextt_Gestao_Compra.Dominio.Interfaces.Servico.Gerenciamento
{
    public interface IServicoMovimentacao : IServicoPadrao<Parametros>
    {
        List<IEnumerable> RetornaSegmentoGrupos();
        List<IEnumerable> RetornaCargaSecaoFiltros(Parametros parametros);
        List<IEnumerable> RetornaCargaEspeciesFiltros(Parametros parametros);
    }
}
