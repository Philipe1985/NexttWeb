using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Nextt_Gestao_Compra.Dominio.Entidades
{
   public class TituloNF
    {
        public Byte Sequencial { get; set; }
        public Guid IDTituloPagar { get; set; }
        public string Documento { get; set; }
        public DateTime DataVencimento { get; set; }
        public DateTime DataEmissao { get; set; }
        public DateTime? DataLiquidacao { get; set; }
        public decimal Valor { get; set; }
        public decimal ValorJuros { get; set; }
        public decimal ValorMulta { get; set; }
        public decimal ValorDesconto { get; set; }
        public decimal ValorAcrescimo { get; set; }
        
    }
}
