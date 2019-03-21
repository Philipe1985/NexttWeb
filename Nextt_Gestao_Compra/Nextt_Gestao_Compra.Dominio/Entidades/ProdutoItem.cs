using System;

namespace Nextt_Gestao_Compra.Dominio.Entidades
{
    public class ProdutoItem
    {
        public Guid IDNFFornecedorPackProdutoItem { get; set; }
        public Guid IDNFFornecedorPack { get; set; }
        public Guid IDPedidoPackProdutoItem { get; set; }
        public Guid IDPedidoPack { get; set; }
        public decimal ValorUnitario { get; set; }
        public double PerIcms { get; set; }
        public double PerPis { get; set; }
        public double PerCofins { get; set; }
        public double PerIcmsST { get; set; }
        public int IDProdutoItem { get; set; }
        public string ReferenciaItem { get; set; }
        public decimal ValorTotal { get; set; }
        public string TipoPack { get; set; }
        public string TipoPackDescricao { get; set; }
        public string DescricaoCor { get; set; }
        public string DescricaoTamanho { get; set; }
        public string ProdutoDescricao { get; set; }
        public string EspecieDescricao { get; set; }
        public string Agrupamento { get; set; }
        public string AgrupamentoDescricao { get; set; }
        public string SecaoDescricao { get; set; }
        public string SegmentoDescricao { get; set; }
        public string UnidadeMedidaDescricao { get; set; }
        public string MarcaNome { get; set; }
        public string DescricaoClassificacao { get; set; }
        public string CodigoProduto { get; set; }
        public string ReferenciaFornecedor { get; set; }
        public string CodigoOriginal { get; set; }
        public string CompradorNome { get; set; }
        public string DescricaoEspecie { get; set; }
        public string DescricaoSecao { get; set; }
        public string DescricaoSegmento { get; set; }
        public DateTime DataEntregaInicio { get; set; }
        public DateTime DataEntregaFinal { get; set; }
        public DateTime DataCadastro { get; set; }
        public Int16 IDTamanho { get; set; }
        public Int16 IDCor { get; set; }
        public Int16 TamanhoOrdem { get; set; }
        public Int16 QtdeItens { get; set; }
        public Int16 QtdePedido { get; set; }
        public Int16 QtdeEntregue { get; set; }
        public Int16 QtdeNota { get; set; }
        public Int16 QtdePack { get; set; }
        public Byte Pack { get; set; }
        public Byte[] Imagem { get; set; }
        public string Extensao { get; set; }
        public int IDPedido { get; set; }
    }
}
