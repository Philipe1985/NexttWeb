using System;

namespace Nextt_Gestao_Compra.Dominio.Entidades
{
    public class DadosGerenciamentoProdutoCompra
    {
        public int IDMarca { get; set; }
        public int IDProduto { get; set; }
        public string CodProduto { get; set; }
        public string CodOriginal { get; set; }
        public string DescricaoProduto { get; set; }
        public string DescricaoMarca { get; set; }
        public string DescricaoReduzida { get; set; }
        public string Referencia { get; set; }
    }
}
