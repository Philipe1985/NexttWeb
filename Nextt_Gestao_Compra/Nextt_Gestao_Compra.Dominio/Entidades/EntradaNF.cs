using System;

namespace Nextt_Gestao_Compra.Dominio.Entidades
{
    public class EntradaNF
    {
        public Int16 IDFilial { get; set; }
        public Int16 IDFornecedor { get; set; }
        public string FilialNome { get; set; }
        public string MensagemErro { get; set; }
        public decimal ValorTotal { get; set; }
        public decimal ValorBaseIcms { get; set; }
        public decimal ValorBaseIcmsST { get; set; }
        public decimal ValorIcms { get; set; }
        public decimal ValorIcmsST { get; set; }
        public decimal ValorProdutos { get; set; }
        public decimal ValorFrete { get; set; }
        public decimal ValorSeguro { get; set; }
        public decimal ValorDesconto { get; set; }
        public decimal ValorIPI { get; set; }
        public decimal ValorAproxTributos { get; set; }
        public decimal ValorOutros { get; set; }

        public int QtdeItens { get; set; }
        public Int16 QtdeVolume { get; set; }
        public string CNPJ { get; set; }
        public string Observacao { get; set; }
        public Guid IDNFFornecedor { get; set; }
        public string Status { get; set; }
        public int Numero { get; set; }
        public Byte Serie { get; set; }
        public string ChaveAcessoNfe { get; set; }
        public DateTime DataCadastro { get; set; }
        public DateTime DataEntrega { get; set; }
        public DateTime DataEmissao { get; set; }
        public DateTime DataSaida { get; set; }
        public string RazaoSocial { get; set; }
        public string NomeFantasia { get; set; }
        public string StatusDescricao { get; set; }
        public string UsuarioCadastroNome { get; set; }

    }
}
