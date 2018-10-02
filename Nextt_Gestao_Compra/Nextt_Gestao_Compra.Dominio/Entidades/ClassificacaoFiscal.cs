namespace Nextt_Gestao_Compra.Dominio.Entidades
{
    public class ClassificacaoFiscal
    {
        public int IDClassificacaoFiscal { get; set; }
        public string DescricaoClassificacao { get; set; }
        public string CodigoFiscal { get; set; }
        public decimal Pis { get; set; }
        public decimal Confins { get; set; }
    }
}
