using System;

namespace Nextt_Gestao_Compra.Dominio.Entidades
{
    public class ProdutoItem
    {
        public string ReferenciaItem { get; set; }
        public string DescricaoCor { get; set; }
        public string DescricaoTamanho { get; set; }
        public Int16 IDTamanho { get; set; }
        public Int16 IDCor { get; set; }
        public Int16 QtdeItens { get; set; }
        public Int16 QtdePack { get; set; }
        public Byte Pack { get; set; }
    }
}
