using Nextt_Gestao_Compra.Aplicacao.Servicos.Interfaces.Gerenciamento;
using Nextt_Gestao_Compra.Dominio.Entidades;
using Nextt_Gestao_Compra.Dominio.Interfaces.Servico.Gerenciamento;
using System.Collections;
using System.Collections.Generic;

namespace Nextt_Gestao_Compra.Aplicacao.Servicos.Gerenciamento
{
    public class AppServicoGrupoEmpresa : AppServicoPadrao<Parametros>, IAppServicoGrupoEmpresa
    {
        private readonly IServicoGrupoEmpresa _servicoGrupoEmpresa;
        public AppServicoGrupoEmpresa(IServicoGrupoEmpresa servicoGrupoEmpresa) : base(servicoGrupoEmpresa)
        {
            _servicoGrupoEmpresa = servicoGrupoEmpresa;
        }
        public List<IEnumerable> BuscaCargaInicial()
        {
            return _servicoGrupoEmpresa.BuscaCargaInicial();
        }

        public List<IEnumerable> BuscaMarcasGrupo(Parametros parametros)
        {
            return _servicoGrupoEmpresa.BuscaMarcasGrupo(parametros);
        }

        public void ExcluirGrupoEmpresa(Parametros parametros)
        {
            _servicoGrupoEmpresa.ExcluirGrupoEmpresa(parametros);
        }

        public void GravarAtualizarGrupoEmpresa(string grpEmpJson)
        {
            _servicoGrupoEmpresa.GravarAtualizarGrupoEmpresa(grpEmpJson);
        }
    }
}
