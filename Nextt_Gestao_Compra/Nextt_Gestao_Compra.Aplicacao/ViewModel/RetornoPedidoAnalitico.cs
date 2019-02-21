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
        public string IDUnidadeMedida { get; set; }
        public string TamanhosSelecionadas { get; set; }
        public string CondicaoSeleciona { get; set; }
        public string CompradoresSelecionados { get; set; }
        public string ClassificacaoSelecionada { get; set; }
        public string CodProduto { get; set; }
        public string CodigoOriginal { get; set; }
        public string DescricaoProduto { get; set; }
        public string DescricaoMarca { get; set; }
        public string ReferenciaFornecedor { get; set; }
        public string Observacao { get; set; }
        public string DtCadastroProduto { get; set; }
        public string DtCadastroPedido { get; set; }
        public string DescricaoReduzidaProduto { get; set; }
        public decimal PrecoCusto { get; set; }
        public decimal PrecoVenda { get; set; }
        public decimal Desconto { get; set; }
        public decimal DescontoPontualidade { get; set; }
        public decimal Acrescimo { get; set; }
        public decimal Ipi { get; set; }
        public decimal Pis { get; set; }
        public decimal Cofins { get; set; }
        public string IDUsuarioCadastro { get; set; }
        public decimal Icms { get; set; }
        public decimal QualidadeValor { get; set; }
        public decimal QualidadeQtde { get; set; }
        public int QtdeItens { get; set; }
        public decimal ValorTotal { get; set; }
        public string Status { get; set; }
        public string DescricaoStatus { get; set; }
        public bool ProdutoInativo { get; set; }
        public string IDStatusPedidoPara { get; set; }
        public List<PackVM> Packs { get; set; }
        public List<HistoricoPedidoVM> Historicos { get; set; }

        public RetornoPedidoAnalitico(PedidoCadastrado pedidoCadastrado, FiltrosPesquisa filtrosPesquisa,ResumoPedido resumo)
        {
            IDUsuarioCadastro = pedidoCadastrado.IDUsuarioCadastro;
            IDStatusPedidoPara = pedidoCadastrado.IDStatusPedidoPara;
            Packs = new List<PackVM>();
            ProdutoInativo = !pedidoCadastrado.Ativo;
            FiltrosPrePedido = filtrosPesquisa;
            IDProduto = pedidoCadastrado.IDProduto;
            Observacao = pedidoCadastrado.Observacao;
            ReferenciaFornecedor = pedidoCadastrado.ReferenciaFornecedor;
            ClassificacaoSelecionada = pedidoCadastrado.IDClassificacaoFiscal.ToString();
            CodProduto = pedidoCadastrado.CodProduto;
            CondicaoSeleciona = pedidoCadastrado.IDCondicaoPagamento.ToString();
            DescricaoMarca = pedidoCadastrado.DescricaoMarca;
            CodigoOriginal = pedidoCadastrado.CodigoOriginal;
            DtCadastroPedido = resumo.DataCadastro.ToString("dd/MM/yyyy HH:mm:ss");
            DtCadastroProduto = pedidoCadastrado.DataCadastroProduto.ToString("dd/MM/yyyy HH:mm:ss");
            QtdeItens = resumo.QtdeItens;
            ValorTotal = resumo.ValorTotal;
            IDUnidadeMedida = pedidoCadastrado.IDUnidadeMedida.ToString();
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
            IDUnidadeMedida = pedidoCadastrado.IDUnidadeMedida.ToString();
            Status = pedidoCadastrado.Status;
            DescricaoStatus = pedidoCadastrado.DescricaoStatusPedido;
        }
    }
}
