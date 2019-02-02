using System;

namespace Nextt_Gestao_Compra.Dominio.Entidades
{
    public class TipoAtributoSecaoEspecie
    {
        public Int16 IDTipoAtributo { get; set; }
        public Int16? IDSegmento { get; set; }
        public Int16? IDSecao { get; set; }
        public Int16? IDEspecie { get; set; }
        public string DescricaoSegmento { get; set; }
        public string DescricaoSecao { get; set; }
    }
}
