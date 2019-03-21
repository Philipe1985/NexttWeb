using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Nextt_Gestao_Compra.Aplicacao.ViewModel
{
   public class EntradaNFPackItensSalvarVM
   {
        public string IDNFFornecedorPackProdutoItem { get; set; }
        public int IDProdutoItem { get; set; }
        public int QtdeEntregue { get; set; }
        public int QtdeNota { get; set; }
    }
}
