using System;

namespace Nextt_Gestao_Compra.Dominio.Entidades
{
    public class FotoProduto
    {
        public int IDProduto { get; set; }
        public Guid IDProdutoFoto { get; set; }
        public Byte[] Imagem { get; set; }
        public string Extensao { get; set; }
        public bool IsCadProduto { get; set; }
    }
}
