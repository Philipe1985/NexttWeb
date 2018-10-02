using System;

namespace Nextt_Gestao_Compra.Dominio.Entidades
{
    public class Cor
    {
        public Int16 IDCor { get; set; }
        public string Descricao { get; set; }
        public string CorRGB { get; set; }
        public bool VisivelSelecao { get; set; }
        public bool ContemPedido { get; set; }
    }
}
