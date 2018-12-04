using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Nextt_Gestao_Compra.Dominio.Entidades
{
    public class ResumoPedido
    {
        public DateTime DataCadastro { get; set; }
        public int QtdeItens { get; set; }
        public decimal ValorTotal { get; set; }

    }
}
