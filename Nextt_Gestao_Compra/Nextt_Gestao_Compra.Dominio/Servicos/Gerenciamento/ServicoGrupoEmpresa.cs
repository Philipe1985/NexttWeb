using Nextt_Gestao_Compra.Dominio.Entidades;
using Nextt_Gestao_Compra.Dominio.Interfaces.Repositorio.Gerenciamento;
using Nextt_Gestao_Compra.Dominio.Interfaces.Servico.Gerenciamento;
using System.Collections;
using System.Collections.Generic;

namespace Nextt_Gestao_Compra.Dominio.Servicos.Gerenciamento
{
    public class ServicoGrupoEmpresa : ServicoPadrao<Parametros>, IServicoGrupoEmpresa
    {
        private readonly IRepositorioGrupoEmpresa _grupoEmpresaRepositorio;
        public ServicoGrupoEmpresa(IRepositorioGrupoEmpresa grupoEmpresaRepositorio) : base(grupoEmpresaRepositorio)
        {
            _grupoEmpresaRepositorio = grupoEmpresaRepositorio;
        }

        public List<IEnumerable> BuscaCargaInicial()
        {
            return _grupoEmpresaRepositorio.BuscaCargaInicial();
        }

        public List<IEnumerable> BuscaMarcasGrupo(Parametros parametros)
        {
            return _grupoEmpresaRepositorio.BuscaMarcasGrupo(parametros);
        }

        public void ExcluirGrupoEmpresa(Parametros parametros)
        {
            _grupoEmpresaRepositorio.ExcluirGrupoEmpresa(parametros);
        }

        public void GravarAtualizarGrupoEmpresa(string grpEmpJson)
        {
            _grupoEmpresaRepositorio.GravarAtualizarGrupoEmpresa(grpEmpJson);
        }
    }
}
