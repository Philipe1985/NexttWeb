using Nextt_Gestao_Compra.Dominio.Entidades;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Nextt_Gestao_Compra.Aplicacao.ViewModel
{
    public class RetornoPedidoAnalitico
    {
        public FiltrosPesquisa FiltrosPrePedido { get; set; }
        public int IDProduto { get; set; }
        public string ReferenciasSelecionadas { get; set; }
        public string CoresSelecionadas { get; set; }
        public string FormasSelecionadas { get; set; }
        public string TamanhosSelecionadas { get; set; }
        public string CondicaoSeleciona { get; set; }
        public string ClassificacaoSelecionada { get; set; }
        public string CodProduto { get; set; }
        public string CodigoOriginal { get; set; }
        public string DescricaoProduto { get; set; }
        public string DescricaoMarca { get; set; }
        public string ReferenciaFornecedor { get; set; }
        public string Observacao { get; set; }
        public string DescricaoReduzidaProduto { get; set; }
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
        public List<PackVM> Packs { get; set; }

        public RetornoPedidoAnalitico(PedidoCadastrado pedidoCadastrado, FiltrosPesquisa filtrosPesquisa)
        {
            Packs = new List<PackVM>();
            FiltrosPrePedido = filtrosPesquisa;
            IDProduto = pedidoCadastrado.IDProduto;
            Observacao = pedidoCadastrado.Observacao;
            ReferenciaFornecedor = pedidoCadastrado.ReferenciaFornecedor;
            ClassificacaoSelecionada = pedidoCadastrado.IDClassificacaoFiscal.ToString();
            CodProduto = pedidoCadastrado.CodProduto;
            CondicaoSeleciona = pedidoCadastrado.IDCondicaoPagamento.ToString();
            DescricaoMarca = pedidoCadastrado.DescricaoMarca;
            CodigoOriginal = pedidoCadastrado.CodigoOriginal;
            DescricaoProduto = pedidoCadastrado.DescricaoProduto;
            DescricaoReduzidaProduto = pedidoCadastrado.DescricaoReduzidaProduto;
            PrecoCusto = pedidoCadastrado.PrecoCusto;
            PrecoVenda = pedidoCadastrado.PrecoVenda;
            Desconto = pedidoCadastrado.Desconto;
            DescontoPontualidade = pedidoCadastrado.DescontoPontualidade;
            Acrescimo = pedidoCadastrado.Acrescimo;
            Ipi = pedidoCadastrado.Ipi;
            Pis = pedidoCadastrado.Pis;
            Cofins = pedidoCadastrado.Cofins;
            Icms = pedidoCadastrado.Icms;
            QualidadeValor = pedidoCadastrado.QualidadeValor;
            QualidadeQtde = pedidoCadastrado.QualidadeQtde;
            DataEntregaInicio = pedidoCadastrado.DataEntregaInicio;
            DataEntregaFinal = pedidoCadastrado.DataEntregaFinal;
            DataToleranciaAtrasoInicio = pedidoCadastrado.DataToleranciaAtrasoInicio;
            DataToleranciaAtrasoFinal = pedidoCadastrado.DataToleranciaAtrasoFinal;
            Status = pedidoCadastrado.Status;
        }
    }
}
