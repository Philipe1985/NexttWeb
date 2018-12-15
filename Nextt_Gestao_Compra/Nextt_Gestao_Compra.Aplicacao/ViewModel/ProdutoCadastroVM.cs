using System.Collections.Generic;

namespace Nextt_Gestao_Compra.Aplicacao.ViewModel
{
    public class ProdutoCadastroVM
    {
        public ProdutoVM Produto { get; set; }
        public List<PedidoPackProdutoItemVM> ProdutoItem { get; set; }
        public List<ProdutoAtributoVM> ProdutoAtributo { get; set; }
        public List<ProdutoCompradorVM> CompradorProduto { get; set; }
        public List<TabelaPrecoVM> ProdutoTabelaPreco { get; set; }
    }
}
