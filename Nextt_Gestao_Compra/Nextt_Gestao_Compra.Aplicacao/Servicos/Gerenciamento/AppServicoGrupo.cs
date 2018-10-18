using Nextt_Gestao_Compra.Aplicacao.Servicos.Interfaces.Gerenciamento;
using Nextt_Gestao_Compra.Dominio.Entidades;
using Nextt_Gestao_Compra.Dominio.Interfaces.Servico.Gerenciamento;
using System.Collections.Generic;
using System.Collections;

namespace Nextt_Gestao_Compra.Aplicacao.Servicos.Gerenciamento
{
    public class AppServicoGrupo : AppServicoPadrao<Parametros>, IAppServicoGrupo
    {
        private readonly IServicoGrupo _servicoGrupo;
        public AppServicoGrupo(IServicoGrupo servicoGrupo) : base(servicoGrupo)
        {
            _servicoGrupo = servicoGrupo;
        }

        public List<IEnumerable> BuscaFiliaisPorGrupos(Parametros parametros)
        {
            return _servicoGrupo.BuscaFiliaisPorGrupos(parametros);
        }

        public List<IEnumerable> BuscaGruposCadastrados()
        {
            return _servicoGrupo.BuscaGruposFiliaisCadastrados();
        }

        public void ExcluirGrupo(Parametros parametros)
        {
            _servicoGrupo.ExcluirGrupo(parametros);
        }

        public List<IEnumerable> ManipularGrupo(string grpJson)
        {
            return _servicoGrupo.ManipularGrupo(grpJson);
        }

    }
}
