using Nextt_Gestao_Compra.Dominio.Entidades;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Nextt_Gestao_Compra.Dominio.Interfaces.Repositorio.Gerenciamento
{
    public interface IRepositorioGrupo : IRepositorioPadrao<Parametros>
    {
        List<IEnumerable> BuscaGruposFiliaisExistentes();
        List<IEnumerable> BuscaFiliaisPorGrupos(Parametros parametros);
        List<IEnumerable> ManipularGrupo(string grpJson);
        void ExcluirGrupo(Parametros parametros);
    }
}
