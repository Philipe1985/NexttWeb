using System.Collections.Generic;

namespace Nextt_Gestao_Compra.Aplicacao.ViewModel
{
    public class PedidoCompletoVM
    {
        public PedidoVM Pedido { get; set; }
        public NovaCondicaoPgtoVM CondicaoPagamento { get; set; }
        public List<CondicaoFormaPgtoVM> PedidoCondicaoFormaPagamento { get; set; }
        public List<ProdutoItemVM> PedidoPack { get; set; }
        public List<PedidoAtributoVM> PedidoAtributo { get; set; }
        public List<ProdutoAtributoVM> ProdutoAtributo { get; set; }
    }
}
