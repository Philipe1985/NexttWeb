using System.Collections.Generic;

namespace Nextt_Gestao_Compra.Aplicacao.ViewModel
{
    public  class RetornoProdutosVM
    {
        public List<ProdutosFiltradosVM> Produtos { get; set; }
        public RetornoProdutosVM(List<ProdutosFiltradosVM> produtos)
        {
            Produtos = produtos;
        }
    }
}
