using System;

namespace Nextt_Gestao_Compra.Dominio.Entidades
{
    public class Atributo
    {
        public Int16 IDTipoAtributo { get; set; }
        public Int16 IDTipoAtributoKey { get; set; }
        public Byte CasaDecimal { get; set; }
        public Int16 Ordem { get; set; }
        public Byte Tipo { get; set; }
        public bool Ativo { get; set; }
        public bool MultiplaSelecao { get; set; }
        public bool Lista { get; set; }
        public bool Obrigatorio { get; set; }
        public string Descricao { get; set; }
        public string Classe { get; set; }
        public int ValorMinimo { get; set; }
        public int ValorMaximo { get; set; }
        public string ValorDefault { get; set; }
    }
}
