using Nextt_Gestao_Compra.Dominio.Entidades;
using System;

namespace Nextt_Gestao_Compra.Aplicacao.ViewModel
{
    public class TamanhoItemVM
    {
        public string IDPackProdutoItem { get; set; }
        public int IDProdutoItem { get; set; }
        public string DescricaoTamanho { get; set; }
        public int QtdeItens { get; set; }
        public int QtdePack { get; set; }
        public TamanhoItemVM(ProdutoItem item)
        {
            IDPackProdutoItem = item.IDNFFornecedorPackProdutoItem == Guid.Empty ? Guid.NewGuid().ToString() : item.IDNFFornecedorPackProdutoItem.ToString();
            IDProdutoItem = item.IDProdutoItem;
            DescricaoTamanho = item.DescricaoTamanho;
            QtdeItens = item.QtdePedido > 0 ? item.QtdePedido: item.QtdeItens;
            QtdePack = item.QtdePack;
        }
        public TamanhoItemVM(ProdutoItem item, bool isNota)
        {
            IDPackProdutoItem = item.IDNFFornecedorPackProdutoItem == Guid.Empty ? Guid.NewGuid().ToString() : item.IDNFFornecedorPackProdutoItem.ToString();
            IDProdutoItem = item.IDProdutoItem;
            DescricaoTamanho = item.DescricaoTamanho;
            QtdeItens = isNota ? item.QtdePedido : item.QtdeEntregue;
            QtdePack = item.QtdePack;
        }
    }
}
