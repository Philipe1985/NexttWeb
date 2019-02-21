using System;

namespace Nextt_Gestao_Compra.Dominio.Entidades
{
    public class PedidoCadastrado
    { 
        public int IDMarca { get; set; }
        public int IDPedido { get; set; }
        public int IDClassificacaoFiscal { get; set; }
        public int IDProduto { get; set; }
        public DateTime DataCadastroProduto { get; set; }
        public Int16 IDSecao { get; set; }
        public Int16 IDSegmento { get; set; }
        public Int16 IDUnidadeMedida { get; set; }
        public Int16 IDCondicaoPagamento { get; set; }
        public Int16 IDGrupoTamanho { get; set; }
        public Int16 IDEspecie { get; set; }
        public Int16 IDFornecedor { get; set; }
        public string RazaoSocial { get; set; }
        public string IDComprador { get; set; }
        public string IDUsuarioCadastro { get; set; }
        public string DescricaoGrupoTamanho { get; set; }
        public string NomeFantasia { get; set; }
        public string ReferenciaFornecedor { get; set; }
        public string Observacao { get; set; }
        public string DescricaoEspecie { get; set; }
        public string DescricaoSecao { get; set; }
        public string DescricaoSegmento { get; set; }
        public string CodProduto { get; set; }
        public string CodigoOriginal { get; set; }
        public string DescricaoProduto { get; set; }
        public string DescricaoMarca { get; set; }
        public string DescricaoReduzidaProduto { get; set; }
        public int QtdeItens { get; set; }
        public string DataCadastro { get; set; }
        public string NomeUsuario { get; set; }
        public decimal PrecoCusto { get; set; }
        public decimal PrecoVenda { get; set; }
        public decimal Desconto { get; set; }
        public decimal DescontoPontualidade { get; set; }
        public decimal Acrescimo { get; set; }
        public decimal Ipi { get; set; }
        public decimal Pis { get; set; }
        public decimal Cofins { get; set; }
        public decimal Icms { get; set; }
        public decimal QualidadeValor { get; set; }
        public decimal QualidadeQtde { get; set; }
        public DateTime DataEntregaInicio { get; set; }
        public DateTime DataEntregaFinal { get; set; }
        public DateTime DataToleranciaAtrasoInicio { get; set; }
        public DateTime DataToleranciaAtrasoFinal { get; set; }
        public string Status { get; set; }
        public string DescricaoStatusPedido { get; set; }
        public string IDStatusPedidoPara { get; set; }
        public bool Ativo { get; set; }
    }
}
 