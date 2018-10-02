using System;

namespace Nextt_Gestao_Compra.Dominio.Entidades
{
    public class FormaPgto
    {
        public Int16 IDFormaPagamento { get; set; }
        public string DescricaoFormaPagamento { get; set; }
        public bool ContemPedido { get; set; }
    }
}
