using Nextt_Gestao_Compra.Dominio.Entidades;
using Nextt_Gestao_Compra.Dominio.Interfaces.Repositorio.Gerenciamento;
using Nextt_Gestao_Compra.Dominio.Interfaces.Servico.Gerenciamento;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Nextt_Gestao_Compra.Dominio.Servicos.Gerenciamento
{
    public class ServicoMovimentacao : ServicoPadrao<Parametros>, IServicoMovimentacao
    {
        private readonly IRepositorioMovimentacao _movimentacaoRepositorio;
        public ServicoMovimentacao(IRepositorioMovimentacao movimentacaoRepositorio) : base(movimentacaoRepositorio)
        {
            _movimentacaoRepositorio = movimentacaoRepositorio;
        }

        public List<IEnumerable> RetornaCargaRelatorios(Parametros parametros)
        {
            return _movimentacaoRepositorio.RetornaCargaRelatorios(parametros);
        }

        public List<IEnumerable> RetornaCargaSecaoFiltros(Parametros parametros)
        {
            return _movimentacaoRepositorio.RetornaCargaSecaoFiltros(parametros);
        }

        public List<IEnumerable> RetornaSegmentoGrupos()
        {
            return _movimentacaoRepositorio.RetornaSegmentoGrupos();
        }
    }
}
