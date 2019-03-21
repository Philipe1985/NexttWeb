using Nextt_Gestao_Compra.Dominio.Entidades;
using System.Collections;
using System.Collections.Generic;

namespace Nextt_Gestao_Compra.Dominio.Interfaces.Repositorio.Gerenciamento
{
    public interface IRepositorioNotaFiscal : IRepositorioPadrao<Parametros>
    {
        List<IEnumerable> CarregaFiltrosPesquisaNF();
        List<IEnumerable> CarregaFiltrosCadastroNF();
        List<IEnumerable> BuscaEntradasFiltradas(string parametroJson);
        List<IEnumerable> BuscaEntradaCadastrada(string idNota);
        List<IEnumerable> BuscaPedidosFiltrados(string parametroJson);
        List<IEnumerable> BuscaPedidosPack(string parametroJson);
        List<IEnumerable> BuscaPackAddPedidos(string parametroJson);
        List<IEnumerable> GravarEntradaNF(string entradaNF);
        List<IEnumerable> AtualizaStatusEntradaNF(string entradaNF);
        List<IEnumerable> GeraTituloEntradaNF(string titNF);
        List<IEnumerable> ConfirmaTituloEntradaNF(string titNF);
    }
}
