using System;

namespace Nextt_Gestao_Compra.Dominio.Entidades
{
    public class DadosUltimaCompra
    {
        public Int16 IDCondicaoPagamento { get; set; }
        public Int16 IDFormaPagamento { get; set; }
        public int IDProduto { get; set; }
        public int IDPedido { get; set; }
    }
}
