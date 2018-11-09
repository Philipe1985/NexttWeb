using Nextt_Gestao_Compra.Aplicacao.Servicos.Interfaces.Gerenciamento;
using Nextt_Gestao_Compra.Dominio.Entidades;
using Nextt_Gestao_Compra.Dominio.Interfaces.Servico.Gerenciamento;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Nextt_Gestao_Compra.Aplicacao.Servicos.Gerenciamento
{
    public class AppServicoMovimentacao : AppServicoPadrao<Parametros>, IAppServicoMovimentacao
    {
        private readonly IServicoMovimentacao _servicoMovimentacao;
        public AppServicoMovimentacao(IServicoMovimentacao servicoMovimentacao) : base(servicoMovimentacao)
        {
            _servicoMovimentacao = servicoMovimentacao;
        }

        public List<IEnumerable> RetornaCargaEspeciesFiltros(Parametros parametros)
        {
            return _servicoMovimentacao.RetornaCargaEspeciesFiltros(parametros);
        }

        public List<IEnumerable> RetornaCargaSecaoFiltros(Parametros parametros)
        {
            return _servicoMovimentacao.RetornaCargaSecaoFiltros(parametros);
        }

        public List<IEnumerable> RetornaSegmentoGrupos()
        {
            return _servicoMovimentacao.RetornaSegmentoGrupos();
        }
    }
}
