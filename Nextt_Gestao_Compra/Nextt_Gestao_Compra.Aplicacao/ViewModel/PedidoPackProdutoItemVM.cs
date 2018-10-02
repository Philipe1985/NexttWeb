namespace Nextt_Gestao_Compra.Aplicacao.ViewModel
{
    public class PedidoPackProdutoItemVM
    {
        public int IDProduto { get; set; }
        public int Item { get; set; }
        public int Qtde { get; set; }
        public int IDTamanho { get; set; }
        public string Referencia { get; set; }
        public NovaCorItemProduto Cor { get; set; }
    }
}
