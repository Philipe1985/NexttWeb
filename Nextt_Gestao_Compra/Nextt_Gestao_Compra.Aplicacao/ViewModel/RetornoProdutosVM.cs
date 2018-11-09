using System.Collections.Generic;

namespace Nextt_Gestao_Compra.Aplicacao.ViewModel
{
    public  class RetornoProdutosVM
    {
        public List<ProdutosFiltradosVM> Produtos { get; set; }
        public List<PaginasGridVM> PaginasReferencia { get; set; }
        public RetornoProdutosVM(List<ProdutosFiltradosVM> produtos, List<PaginasGridVM> paginasGrids)
        {
            Produtos = produtos;
            PaginasReferencia = paginasGrids;
        }
    }
}
