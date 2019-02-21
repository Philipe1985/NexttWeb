using Nextt_Gestao_Compra.Dominio.Entidades;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Nextt_Gestao_Compra.Aplicacao.ViewModel
{
   public class HistoricoPedidoVM
    {

        public int IDPedido { get; set; }
        public string Data { get; set; }
        public string Detalhamento { get; set; }
        public string Nome { get; set; }
        public string Status { get; set; }
        public HistoricoPedidoVM(HistoricoPedido historicoPedido)
        {
            IDPedido = historicoPedido.IDPedido;
            Data = historicoPedido.Data.ToString("dd/MM/yyyy HH:mm:ss");
            Detalhamento = historicoPedido.Detalhamento;
            Nome = historicoPedido.Nome;
            Status = historicoPedido.Status;
        }
    }
}
