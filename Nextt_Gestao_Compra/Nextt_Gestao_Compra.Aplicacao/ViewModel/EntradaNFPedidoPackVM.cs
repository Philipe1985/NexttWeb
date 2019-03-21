using Nextt_Gestao_Compra.Dominio.Entidades;
using System.Collections.Generic;
using System.Linq;

namespace Nextt_Gestao_Compra.Aplicacao.ViewModel
{
    public class EntradaNFPedidoPackVM
    {
        public RetornoPedidoSinteticoVM PedidoDados { get; set; }
        public List<PackVM> PacksEntradaNF { get; set; }
        public EntradaNFPedidoPackVM(List<ProdutoItem> packPedidoItens, List<ProdutoItem> produtoItems)
        {
            PedidoDados = new RetornoPedidoSinteticoVM(packPedidoItens.FirstOrDefault());
            PacksEntradaNF = packPedidoItens.Select(x => new PackVM(x, produtoItems)).ToList();
        }
    }
}
