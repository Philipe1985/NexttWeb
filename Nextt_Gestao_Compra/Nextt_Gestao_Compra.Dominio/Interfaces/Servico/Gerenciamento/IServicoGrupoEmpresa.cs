using Nextt_Gestao_Compra.Dominio.Entidades;
using System.Collections;
using System.Collections.Generic;

namespace Nextt_Gestao_Compra.Dominio.Interfaces.Servico.Gerenciamento
{
    public interface IServicoGrupoEmpresa : IServicoPadrao<Parametros>
    {
        List<IEnumerable> BuscaCargaInicial();
        List<IEnumerable> BuscaMarcasGrupo(Parametros parametros);
        void GravarAtualizarGrupoEmpresa(string grpEmpJson);
        void ExcluirGrupoEmpresa(Parametros parametros);
    }
}
