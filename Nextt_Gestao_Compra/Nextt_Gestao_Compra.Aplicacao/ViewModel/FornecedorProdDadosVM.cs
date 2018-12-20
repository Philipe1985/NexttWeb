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
        public string AtributoFornecedor { get; set; }
        public string AtributoValor { get; set; }
        public decimal ICMS { get; set; }
        public string Observacao { get; set; }
        public List<string> UltimaForma { get; set; }
        public string UltimaCondicao { get; set; }
        public FornecedorProdDadosVM(List<DadosUltimaCompra> ultimaCompras, DadosCompraFornecedor fornecedor, List<Atributos> atributos)
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
            if (atributos.Count > 0)
            {
                AtributoFornecedor = atributos.Count > 0 ? atributos.Select(x => x.IDTipoAtributoKey).FirstOrDefault().ToString() : null;
                AtributoValor = atributos.Count > 0 ? string.Join(",", atributos.Select(x => x.IDTipoAtributo).ToArray()) : null;
            }

        }
    }
}
