using Nextt_Gestao_Compra.Dominio.Entidades;
using Nextt_Gestao_Compra.Dominio.Interfaces.Repositorio.Gerenciamento;
using Nextt_Gestao_Compra.Dominio.Interfaces.Servico.Gerenciamento;
using System.Collections;
using System.Collections.Generic;

namespace Nextt_Gestao_Compra.Dominio.Servicos.Gerenciamento
{
    public class ServicoNotaFiscal : ServicoPadrao<Parametros>, IServicoNotaFiscal
    {
        private readonly IRepositorioNotaFiscal _notaFiscalRepositorio;
        public ServicoNotaFiscal(IRepositorioNotaFiscal notaFiscalRepositorio) : base(notaFiscalRepositorio)
        {
            _notaFiscalRepositorio = notaFiscalRepositorio;
        }

        public List<IEnumerable> BuscaEntradaCadastrada(string idNota)
        {
            return _notaFiscalRepositorio.BuscaEntradaCadastrada(idNota);
        }

        public List<IEnumerable> BuscaPedidosPack(string parametroJson)
        {
            return _notaFiscalRepositorio.BuscaPedidosPack(parametroJson);
        }

        public List<IEnumerable> BuscaEntradasFiltradas(string parametroJson)
        {
            return _notaFiscalRepositorio.BuscaEntradasFiltradas(parametroJson);
        }

        public List<IEnumerable> BuscaPedidosFiltrados(string parametroJson)
        {
            return _notaFiscalRepositorio.BuscaPedidosFiltrados(parametroJson);
        }

        public List<IEnumerable> CarregaFiltrosCadastroNF()
        {
            return _notaFiscalRepositorio.CarregaFiltrosCadastroNF();
        }

        public List<IEnumerable> CarregaFiltrosPesquisaNF()
        {
            return _notaFiscalRepositorio.CarregaFiltrosPesquisaNF();
        }

        public List<IEnumerable> BuscaPackAddPedidos(string parametroJson)
        {
            return _notaFiscalRepositorio.BuscaPackAddPedidos(parametroJson);
        }

        public List<IEnumerable> GravarEntradaNF(string entradaNF)
        {
            return _notaFiscalRepositorio.GravarEntradaNF(entradaNF);
        }

        public List<IEnumerable> AtualizaStatusEntradaNF(string entradaNF)
        {
            return _notaFiscalRepositorio.AtualizaStatusEntradaNF(entradaNF);
        }

        public List<IEnumerable> GeraTituloEntradaNF(string titNF)
        {
            return _notaFiscalRepositorio.GeraTituloEntradaNF(titNF);
        }

        public List<IEnumerable> ConfirmaTituloEntradaNF(string titNF)
        {
            return _notaFiscalRepositorio.ConfirmaTituloEntradaNF(titNF);
        }
    }
}
