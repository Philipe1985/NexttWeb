using Nextt_Gestao_Compra.Dominio.Entidades;
using System.Collections;
using System.Collections.Generic;

namespace Nextt_Gestao_Compra.Aplicacao.Servicos.Interfaces.Gerenciamento
{
    public interface IAppServicoGrupoEmpresa : IAppServicoPadrao<Parametros>
    {
        List<IEnumerable> BuscaCargaInicial();
        List<IEnumerable> BuscaMarcasGrupo(Parametros parametros);
        void GravarAtualizarGrupoEmpresa(string grpEmpJson);
        void ExcluirGrupoEmpresa(Parametros parametros);
    }
}
