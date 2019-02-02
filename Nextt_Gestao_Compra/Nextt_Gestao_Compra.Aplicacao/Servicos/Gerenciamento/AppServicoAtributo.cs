using Nextt_Gestao_Compra.Aplicacao.Servicos.Interfaces.Gerenciamento;
using Nextt_Gestao_Compra.Dominio.Entidades;
using Nextt_Gestao_Compra.Dominio.Interfaces.Servico.Gerenciamento;
using System.Collections;
using System.Collections.Generic;

namespace Nextt_Gestao_Compra.Aplicacao.Servicos.Gerenciamento
{
    public class AppServicoAtributo : AppServicoPadrao<Parametros>, IAppServicoAtributo
    {
        private readonly IServicoAtributo _servicoAtributo;
        public AppServicoAtributo(IServicoAtributo servicoAtributo) : base(servicoAtributo)
        {
            _servicoAtributo = servicoAtributo;
        }
        public List<IEnumerable> BuscaAtributoEditar(string parametros)
        {
            return _servicoAtributo.BuscaAtributoEditar(parametros);
        }

        public List<IEnumerable> BuscaAtributosSintetico(string parametros)
        {
            return _servicoAtributo.BuscaAtributosSintetico(parametros);
        }

        public List<IEnumerable> CarregaFiltrosPesquisa()
        {
            return _servicoAtributo.CarregaFiltrosPesquisa();
        }

        public void ExluirAtributo(string atributoJson)
        {
            _servicoAtributo.ExluirAtributo(atributoJson);
        }

        public void SalvarAtributo(string atributoJson)
        {
            _servicoAtributo.SalvarAtributo(atributoJson);
        }
    }
}
