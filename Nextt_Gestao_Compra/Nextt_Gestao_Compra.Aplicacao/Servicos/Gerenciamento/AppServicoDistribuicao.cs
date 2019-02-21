using Nextt_Gestao_Compra.Aplicacao.Servicos.Interfaces.Gerenciamento;
using Nextt_Gestao_Compra.Dominio.Entidades;
using Nextt_Gestao_Compra.Dominio.Interfaces.Servico.Gerenciamento;
using System.Collections;
using System.Collections.Generic;

namespace Nextt_Gestao_Compra.Aplicacao.Servicos.Gerenciamento
{
    public class AppServicoDistribuicao : AppServicoPadrao<Parametros>, IAppServicoDistribuicao
    {
        private readonly IServicoDistribuicao _servicoDistribuicao;
        public AppServicoDistribuicao(IServicoDistribuicao servicoDistribuicao) : base(servicoDistribuicao)
        {
            _servicoDistribuicao = servicoDistribuicao;
        }

        public List<IEnumerable> CarregaFiltrosPesquisa()
        {
            return _servicoDistribuicao.CarregaFiltrosPesquisa();
        }
    }
}
