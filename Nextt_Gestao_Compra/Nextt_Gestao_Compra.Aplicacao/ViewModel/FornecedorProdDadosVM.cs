using Nextt_Gestao_Compra.Dominio.Entidades;
using System.Collections.Generic;
using System.Linq;

namespace Nextt_Gestao_Compra.Aplicacao.ViewModel
{
    public class FornecedorProdDadosVM
    {
        public string Referencia { get; set; }
        public decimal QualidadeValor { get; set; }
        public decimal QualidadeQtde { get; set; }
        public decimal PrecoCusto { get; set; }
        public decimal PrecoVenda { get; set; }
        public decimal Desconto { get; set; }
        public decimal IPI { get; set; }
        public decimal ICMS { get; set; }
        public string Observacao { get; set; }
        public List<string> UltimaForma { get; set; }
        public string UltimaCondicao { get; set; }
        public DadosConfigPadraoVM DadosConfigPadrao { get; set; }
        public FornecedorProdDadosVM(DadosConfigPadraoVM dadosConfigPadrao, List<DadosUltimaCompra> ultimaCompras, DadosCompraFornecedor fornecedor)
        {
            if (fornecedor != null)
            {
                Referencia = fornecedor.ReferenciaFornecedor;
                QualidadeQtde = fornecedor.QualidadeQtde;
                QualidadeValor = fornecedor.QualidadeValor;
                ICMS = fornecedor.ICMS;
                Desconto = fornecedor.Desconto;
                PrecoCusto = fornecedor.PrecoCusto;
                PrecoVenda = fornecedor.PrecoVenda;
                IPI = fornecedor.IPI;
                Observacao = fornecedor.Observacao;

            }
            if (ultimaCompras.Count > 0)
            {
                UltimaCondicao = ultimaCompras.ElementAt(0).IDCondicaoPagamento.ToString();
                UltimaForma = ultimaCompras.Select(x => x.IDFormaPagamento.ToString()).ToList();
            }
            DadosConfigPadrao = dadosConfigPadrao;

        }
    }
}
