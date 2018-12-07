using System;

namespace Nextt_Gestao_Compra.Aplicacao.ViewModel
{
    public class PedidoVM
    {
        public int IDPedido { get; set; }
        public int IDUnidadeMedida { get; set; }
        public int IDProduto { get; set; }
        public int Codigo { get; set; } 
        public int IDFornecedor { get; set; }
        public string IDUsuarioCadastro { get; set; }
        public string IDCompradorPedido { get; set; }
        public string Observacao { get; set; }
        public decimal PrecoCusto { get; set; }
        public decimal PrecoVenda { get; set; }
        public decimal Desconto { get; set; }
        public decimal DescontoPontualidade { get; set; }
        public decimal Acrescimo { get; set; }
        public decimal Ipi { get; set; }
        public decimal Icms { get; set; }
        public decimal QualidadeValor { get; set; }
        public decimal QualidadeQtde { get; set; }
        public string DataEntregaInicio { get; set; }
        public string DataEntregaFinal { get; set; }
        public string DataToleranciaAtrasoInicio { get; set; }
        public string DataToleranciaAtrasoFinal { get; set; }
        public string ReferenciaFornecedor { get; set; }
        public string Status { get; set; }
        public string DataCadastro { get; set; }
        public int IDSecao { get; set; }
        public int IDSegmento { get; set; }
        public int IDEspecie { get; set; }
        public int IDMarca { get; set; }
        public int IDGrupoTamanho { get; set; }
        public int IDClassificacaoFiscal { get; set; }
        public string Descricao { get; set; }
        public string DescricaoReduzida { get; set; }

    }
}
