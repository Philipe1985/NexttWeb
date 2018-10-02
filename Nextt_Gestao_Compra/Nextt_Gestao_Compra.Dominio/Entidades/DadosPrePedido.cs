using System;

namespace Nextt_Gestao_Compra.Dominio.Entidades
{
    public class DadosPrePedido
    {
        public int IDMarca { get; set; }
        public int IDProduto { get; set; }
        public Int16 IDSecao { get; set; }
        public Int16 IDGrupoTamanho { get; set; }
        public Int16 IDEspecie { get; set; }
        public Int16 IDFornecedor { get; set; }
        public string RazaoSocial { get; set; }
        public string DescricaoGrupoTamanho { get; set; }
        public string NomeFantasia { get; set; }
        public string DescricaoEspecie { get; set; }
        public string DescricaoSecao { get; set; }
        public string CodProduto { get; set; }
        public string CodigoOriginal { get; set; }
        public string DescricaoProduto { get; set; }
        public string DescricaoMarca { get; set; }
        public string DescricaoReduzidaProduto { get; set; }
        public string DescricaoReduzida { get; set; }
        public string ReferenciaFornecedor { get; set; }
        public decimal PrecoCusto_UltPedido { get; set; }
        public decimal PrecoVenda_UltPedido { get; set; }
        public decimal Desconto_UltPedido { get; set; }
        //public decimal DescontoPontualidade_UltPedido { get; set; }
        //public decimal Acrescimo_UltPedido { get; set; }
        public decimal IPI_UltPedido { get; set; }
        public decimal ICMS_UltPedido { get; set; }
        public decimal QualidadeValor_UltPedido { get; set; }
        public decimal QualidadeQtde_UltPedido { get; set; }
    }
}
