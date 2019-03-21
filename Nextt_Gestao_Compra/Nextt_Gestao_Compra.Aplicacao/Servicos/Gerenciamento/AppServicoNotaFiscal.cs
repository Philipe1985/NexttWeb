using Nextt_Gestao_Compra.Aplicacao.Servicos.Interfaces.Gerenciamento;
using Nextt_Gestao_Compra.Dominio.Entidades;
using Nextt_Gestao_Compra.Dominio.Interfaces.Servico.Gerenciamento;
using System.Collections;
using System.Collections.Generic;

namespace Nextt_Gestao_Compra.Aplicacao.Servicos.Gerenciamento
{
    public class AppServicoNotaFiscal : AppServicoPadrao<Parametros>, IAppServicoNotaFiscal
    {
        private readonly IServicoNotaFiscal _notaFiscalServico;
        public AppServicoNotaFiscal(IServicoNotaFiscal notaFiscalServico) : base(notaFiscalServico)
        {
            _notaFiscalServico = notaFiscalServico;
        }

        public List<IEnumerable> BuscaPackAddPedidos(string parametroJson)
        {
            return _notaFiscalServico.BuscaPackAddPedidos(parametroJson);
        }

        public List<IEnumerable> AtualizaStatusEntradaNF(string entradaNF)
        {
            return _notaFiscalServico.AtualizaStatusEntradaNF(entradaNF);
        }
        public List<IEnumerable> GravarEntradaNF(string entradaNF)
        {
            return _notaFiscalServico.GravarEntradaNF(entradaNF);
        }
        public List<IEnumerable> BuscaEntradaCadastrada(string idNota)
        {
            return _notaFiscalServico.BuscaEntradaCadastrada(idNota);
        }
        public List<IEnumerable> BuscaEntradasFiltradas(string parametroJson)
        {
            return _notaFiscalServico.BuscaEntradasFiltradas(parametroJson);
        }
        public List<IEnumerable> BuscaPedidosFiltrados(string parametroJson)
        {
            return _notaFiscalServico.BuscaPedidosFiltrados(parametroJson);
        }

        public List<IEnumerable> BuscaPedidosPack(string parametroJson)
        {
            return _notaFiscalServico.BuscaPedidosPack(parametroJson);
        }

        public List<IEnumerable> CarregaFiltrosCadastroNF()
        {
            return _notaFiscalServico.CarregaFiltrosCadastroNF();
        }

        public List<IEnumerable> CarregaFiltrosPesquisaNF()
        {
            return _notaFiscalServico.CarregaFiltrosPesquisaNF();
        }

        public List<IEnumerable> GeraTituloEntradaNF(string titNF)
        {
            return _notaFiscalServico.GeraTituloEntradaNF(titNF);
        }

        public List<IEnumerable> ConfirmaTituloEntradaNF(string titNF)
        {
            return _notaFiscalServico.ConfirmaTituloEntradaNF(titNF);
        }
    }
}
