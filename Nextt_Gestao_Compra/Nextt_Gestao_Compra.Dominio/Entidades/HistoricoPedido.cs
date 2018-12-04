using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Nextt_Gestao_Compra.Dominio.Entidades
{
    public class HistoricoPedido
    {
        public int IDPedido { get; set; }
        public DateTime Data { get; set; }
        public string Detalhamento { get; set; }
        public string Nome { get; set; }
        public string Status { get; set; }
    }
}
