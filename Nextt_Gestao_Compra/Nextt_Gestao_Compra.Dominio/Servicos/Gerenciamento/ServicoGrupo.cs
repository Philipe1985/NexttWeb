using Nextt_Gestao_Compra.Dominio.Entidades;
using Nextt_Gestao_Compra.Dominio.Interfaces.Repositorio.Gerenciamento;
using Nextt_Gestao_Compra.Dominio.Interfaces.Servico.Gerenciamento;
using System.Collections;
using System.Collections.Generic;

namespace Nextt_Gestao_Compra.Dominio.Servicos.Gerenciamento
{
    public class ServicoGrupo : ServicoPadrao<Parametros>, IServicoGrupo
    {
        private readonly IRepositorioGrupo _grupoRepositorio;
        public ServicoGrupo(IRepositorioGrupo grupoRepositorio) : base(grupoRepositorio)
        {
            _grupoRepositorio = grupoRepositorio;
        }

        public List<IEnumerable> BuscaFiliaisPorGrupos(Parametros parametros)
        {
            return _grupoRepositorio.BuscaFiliaisPorGrupos(parametros);
        }

        public List<IEnumerable> BuscaGruposFiliaisCadastrados()
        {
            return _grupoRepositorio.BuscaGruposFiliaisExistentes();
        }

        public void ExcluirGrupo(Parametros parametros)
        {
            _grupoRepositorio.ExcluirGrupo(parametros);
        }

        public List<IEnumerable> ManipularGrupo(string grpJson)
        {
            return _grupoRepositorio.ManipularGrupo(grpJson);
        }

    }
}
