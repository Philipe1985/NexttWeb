using System;

namespace Nextt_Gestao_Compra.Aplicacao.ViewModel
{
    public class ImagensProdutoVM
    {
        public int IDProduto { get; set; }
        public Byte[] Imagem { get; set; }
        public Guid IDProdutoFoto { get; set; }
        public string Extensao { get; set; }
        public bool IsCadProduto { get; set; }
    }
}
