using Nextt_Gestao_Compra.Dominio.Entidades;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Nextt_Gestao_Compra.Dominio.Interfaces.Repositorio.Gerenciamento
{
    public interface IRepositorioGrupoEmpresa : IRepositorioPadrao<Parametros>
    {
        List<IEnumerable> BuscaCargaInicial();
        List<IEnumerable> BuscaMarcasGrupo(Parametros parametros);
        void GravarAtualizarGrupoEmpresa(string grpEmpJson);
        void ExcluirGrupoEmpresa(Parametros parametros);
    }
}
