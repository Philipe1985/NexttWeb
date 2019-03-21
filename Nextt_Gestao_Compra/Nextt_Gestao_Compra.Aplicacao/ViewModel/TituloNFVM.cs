using Nextt_Gestao_Compra.Dominio.Entidades;
using System;

namespace Nextt_Gestao_Compra.Aplicacao.ViewModel
{
    public class TituloNFVM
    {
        public string IDTituloPagar { get; set; }
        public string Documento { get; set; }
        public DateTime DataVencimento { get; set; }
        public DateTime DataEmissao { get; set; }
        public string DataLiquidacao { get; set; }
        public decimal Valor { get; set; }
        public decimal ValorJuros { get; set; }
        public decimal ValorMulta { get; set; }
        public decimal ValorDesconto { get; set; }
        public decimal ValorAcrescimo { get; set; }
        public decimal ValorPagar { get; set; }
        public int Sequencial { get; set; }
        public TituloNFVM() { }
        public TituloNFVM(TituloNF tituloNF)
        {
            Sequencial = tituloNF.Sequencial;
            IDTituloPagar = tituloNF.IDTituloPagar.ToString();
            Documento = tituloNF.Documento;
            DataVencimento = tituloNF.DataVencimento;
            DataEmissao = tituloNF.DataEmissao;
            DataLiquidacao = tituloNF.DataLiquidacao.HasValue ? tituloNF.DataLiquidacao.Value.ToString("dd/MM/yyyy") : "";
            Valor = tituloNF.Valor;
            ValorAcrescimo = tituloNF.ValorAcrescimo;
            ValorDesconto = tituloNF.ValorDesconto;
            ValorJuros = tituloNF.ValorJuros;
            ValorMulta = tituloNF.ValorMulta;
            ValorPagar = Valor + ValorJuros + ValorMulta - ValorDesconto;
        }
    }
}
