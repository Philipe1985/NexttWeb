using Nextt_Gestao_Compra.Dominio.Entidades;
using System.Collections;
using System.Collections.Generic;

namespace Nextt_Gestao_Compra.Dominio.Interfaces.Servico.Gerenciamento
{
    public interface IServicoNotaFiscal : IServicoPadrao<Parametros>
    {
        List<IEnumerable> CarregaFiltrosPesquisaNF();
        List<IEnumerable> BuscaEntradasFiltradas(string parametroJson);
        List<IEnumerable> BuscaPedidosFiltrados(string parametroJson);
        List<IEnumerable> CarregaFiltrosCadastroNF();
        List<IEnumerable> BuscaEntradaCadastrada(string idNota);
        List<IEnumerable> BuscaPedidosPack(string parametroJson);
        List<IEnumerable> BuscaPackAddPedidos(string parametroJson);
        List<IEnumerable> GravarEntradaNF(string entradaNF);
        List<IEnumerable> AtualizaStatusEntradaNF(string entradaNF);
        List<IEnumerable> GeraTituloEntradaNF(string titNF);
        List<IEnumerable> ConfirmaTituloEntradaNF(string titNF);
    }
}
