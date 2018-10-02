using System.Collections.Generic;

namespace Nextt_Gestao_Compra.Aplicacao.ViewModel
{
    public class ProdutoItemVM
    {
        public int IDPedido { get; set; }
        public int Pack { get; set; }
        public int Qtde { get; set; }
        public List<PedidoPackDistribuicaoVM> PedidoPackDistribuicao { get; set; }
        public List<PedidoPackProdutoItemVM> PedidoPackProdutoItem { get; set; }
    }
}
