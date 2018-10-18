using Nextt_Gestao_Compra.Dominio.Entidades;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Nextt_Gestao_Compra.Dominio.Interfaces.Servico.Gerenciamento
{
    public interface IServicoGrupo : IServicoPadrao<Parametros>
    {
        List<IEnumerable> BuscaGruposFiliaisCadastrados();
        List<IEnumerable> BuscaFiliaisPorGrupos(Parametros parametros);
        List<IEnumerable> ManipularGrupo(string grpJson);
        void ExcluirGrupo(Parametros parametros);
    }
}
