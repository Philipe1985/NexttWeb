using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Nextt_Gestao_Compra.Aplicacao.ViewModel
{
    public class EntradaNFPackPedidoSalvarVM
    {
        public string IDNFFornecedorPack { get; set; }
        public string Agrupamento { get; set; }
        public string TipoPack { get; set; }
        public int QtdeEntregue { get; set; }
        public int QtdeNota { get; set; }
        public int Pack { get; set; }
        public int IDPedido { get; set; }
        public List<EntradaNFPackItensSalvarVM> NFFornecedorPackProdutoItems { get; set; }


    }
}
