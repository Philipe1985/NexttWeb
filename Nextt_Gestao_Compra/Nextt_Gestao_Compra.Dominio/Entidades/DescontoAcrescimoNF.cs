using System;

namespace Nextt_Gestao_Compra.Dominio.Entidades
{
    public class DescontoAcrescimoNF
    {
        public Byte IDTipoDescontoAcrescimo { get; set; }
        public string Descricao { get; set; }
        public string Tipo { get; set; }
        public decimal Valor { get; set; }
        public bool Ativo { get; set; }
    }
}
