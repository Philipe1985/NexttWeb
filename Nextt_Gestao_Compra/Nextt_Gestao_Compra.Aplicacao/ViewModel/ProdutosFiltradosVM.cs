using System;

namespace Nextt_Gestao_Compra.Aplicacao.ViewModel
{
    public class ProdutosFiltradosVM
    {
        public bool Selecionado { get; set; }
        public bool Ativo { get; set; }
        public int IDMarca { get; set; }
        public int IDProduto { get; set; }
        public string CodProduto { get; set; }
        public string CodOriginal { get; set; }
        public string DescricaoProduto { get; set; }
        public string DescricaoMarca { get; set; }
        public string DescricaoReduzida { get; set; }
        public string Referencia { get; set; }
        public string RazaoSocial { get; set; }
        public string CNPJ { get; set; }
        public string NomeFantasia { get; set; }
        public string IDFornecedor { get; set; }
    }
}
