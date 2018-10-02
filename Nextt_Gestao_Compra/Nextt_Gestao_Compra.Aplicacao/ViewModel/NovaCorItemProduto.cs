using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Nextt_Gestao_Compra.Aplicacao.ViewModel
{
    public class NovaCorItemProduto
    {
        public int IDCor { get; set; }
        public string Descricao { get; set; }
        public string CorRGB { get; set; }
        public bool VisivelSelecao { get; set; }
    }
}
