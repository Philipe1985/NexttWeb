using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Nextt_Gestao_Compra.Aplicacao.ViewModel
{
    public class PedidoAtributoVM
    {
        public int IDPedido { get; set; }
        public int IDTipoAtributo { get; set; }
        public string Valor { get; set; }
        public int Sequencial { get; set; }
        public string DataCadastro { get; set; }
        public PedidoAtributoVM()
        {
            DataCadastro = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"); 
        }
    }

}
