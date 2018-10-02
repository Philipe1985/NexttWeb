using AutoMapper;
using Nextt_Gestao_Compra.Dominio.Entidades;
using System.Collections.Generic;
using System.Linq;

namespace Nextt_Gestao_Compra.Aplicacao.ViewModel
{
    public class RetornoPrePedidoVM
    {
        public FiltrosPesquisa FiltrosPrePedido { get; set; }
        public List<GradePadraoVM> GradePadrao { get; set; }
        public int IDProduto { get; set; }
        public string CodProduto { get; set; }
        public string CodOriginal { get; set; }
        public string Referencia { get; set; }
        public string Descricao { get; set; }
        public string DescricaoReduzida { get; set; }
        public decimal PrecoCusto { get; set; }
        public decimal PrecoVenda { get; set; }
        public decimal Desconto { get; set; }
        public decimal DescontoPontualidade { get; set; }
        //public decimal Acrescimo_UltPedido { get; set; }
        public decimal IPI { get; set; }
        public decimal ICMS { get; set; }
        public decimal QualidadeValor { get; set; }
        public decimal QualidadeQtde { get; set; }
        public List<string> ReferenciasGrade { get; set; }
        public List<string> UltimaForma { get; set; }
        public string UltimaCondicao { get; set; }
        public List<string> CoresGrade { get; set; }
        public List<string> TamanhosGrade { get; set; }

        public RetornoPrePedidoVM(FiltrosPesquisa filtrosPrePedido, DadosPrePedido dados, List<Grade> grades, List<DadosUltimaCompra> ultimaCompras)
        {
            GradePadrao = Mapper.Map<List<Grade>, List<GradePadraoVM>>(grades);
            FiltrosPrePedido = filtrosPrePedido;
            IDProduto = dados.IDProduto;
            CodOriginal = dados.CodigoOriginal;
            CodProduto = dados.CodProduto;
            Referencia = dados.ReferenciaFornecedor;
            Descricao = dados.DescricaoProduto;
            DescricaoReduzida = dados.DescricaoReduzidaProduto;
            PrecoCusto = dados.PrecoCusto_UltPedido;
            PrecoVenda = dados.PrecoVenda_UltPedido;
            Desconto = dados.Desconto_UltPedido;
            IPI = dados.IPI_UltPedido;
            ICMS = dados.ICMS_UltPedido;
            QualidadeQtde = dados.QualidadeQtde_UltPedido;
            QualidadeValor = dados.QualidadeValor_UltPedido;
            ReferenciasGrade = grades.Select(x => x.Referencia.Trim()).Distinct().ToList();
            CoresGrade = grades.Select(x => x.DescricaoCor.Trim()).Distinct().ToList();
            TamanhosGrade = grades.Select(x => x.DescricaoTamanho.Trim()).Distinct().ToList();
            UltimaCondicao = ultimaCompras.Select(x => x.IDCondicaoPagamento.ToString()).FirstOrDefault();
            UltimaForma = ultimaCompras.Select(x => x.IDFormaPagamento.ToString()).Distinct().ToList();
        }
    }
}
