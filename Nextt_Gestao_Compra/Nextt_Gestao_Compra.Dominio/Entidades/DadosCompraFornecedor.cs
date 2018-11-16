namespace Nextt_Gestao_Compra.Dominio.Entidades
{
    public class DadosCompraFornecedor
    {
        public string ReferenciaFornecedor { get; set; }
        public decimal QualidadeValor { get; set; }
        public decimal QualidadeQtde { get; set; }
        public decimal PrecoCusto { get; set; }
        public decimal PrecoVenda { get; set; }
        public decimal Desconto { get; set; }
        public decimal IPI { get; set; }
        public decimal ICMS { get; set; }
        public string Observacao { get; set; }
    }
}
