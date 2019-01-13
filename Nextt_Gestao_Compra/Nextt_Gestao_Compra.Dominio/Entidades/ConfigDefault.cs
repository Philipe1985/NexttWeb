using System;

namespace Nextt_Gestao_Compra.Dominio.Entidades
{
    public class ConfigDefault
    {
        public Int16 DataEntregaInicio { get; set; }
        public Int16 DataEntregaFinal { get; set; }
        public Int16 DataToleranciaAtrasoInicio { get; set; }
        public Int16 DataToleranciaAtrasoFinal { get; set; }
        public bool ProdutoEditavel { get; set; }
    }
}
