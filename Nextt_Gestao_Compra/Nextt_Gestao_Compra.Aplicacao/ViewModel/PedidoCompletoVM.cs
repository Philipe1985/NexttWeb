using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Nextt_Gestao_Compra.Aplicacao.ViewModel
{
    public class PedidoCompletoVM
    {
        public PedidoVM Pedido { get; set; }
        public NovaCondicaoPgtoVM CondicaoPagamento { get; set; }
        public List<CondicaoFormaPgtoVM> PedidoCondicaoFormaPagamento { get; set; }
        public List<ProdutoItemVM> PedidoPack { get; set; }
    }
}
