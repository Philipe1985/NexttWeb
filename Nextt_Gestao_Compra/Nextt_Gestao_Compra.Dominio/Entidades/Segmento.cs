using System;

namespace Nextt_Gestao_Compra.Dominio.Entidades
{
    public class Segmento
    {
        public Int16 IDSegmento { get; set; }
        public string Descricao { get; set; }
        public bool Ativo { get; set; }
        public int Ordem { get; set; }
    }
}
