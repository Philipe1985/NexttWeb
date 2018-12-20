using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Nextt_Gestao_Compra.Dominio.Entidades
{
    public class StatusPedido
    {
        public string IDStatusPedido { get; set; }
        public string Descricao { get; set; }
        public bool SolicitaObservacao { get; set; }
        public string IDStatusPedidoPara { get; set; }
    }
}
