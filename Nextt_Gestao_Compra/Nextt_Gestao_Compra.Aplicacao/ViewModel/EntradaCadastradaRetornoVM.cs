using System.Collections.Generic;

namespace Nextt_Gestao_Compra.Aplicacao.ViewModel
{
    public class EntradaCadastradaRetornoVM
    {
        public EntradasNFVM DadosEntrada { get; set; }
        public List<EntradaNFPedidoPackVM> EntradaNFPedidoPacks { get; set; }
        public DadosDuplicataVM Duplicata { get; set; }
        public EntradaCadastradaRetornoVM(EntradasNFVM _dadosEntrada, List<EntradaNFPedidoPackVM> _entradaNFPedidoPacks, DadosDuplicataVM _duplicata)
        {
            Duplicata = _duplicata;
            DadosEntrada = _dadosEntrada;
            EntradaNFPedidoPacks = _entradaNFPedidoPacks;
        }
        public EntradaCadastradaRetornoVM(List<EntradaNFPedidoPackVM> _entradaNFPedidoPacks)
        {
            EntradaNFPedidoPacks = _entradaNFPedidoPacks;
        }
    }
}
