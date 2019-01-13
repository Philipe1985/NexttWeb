using Nextt_Gestao_Compra.Dominio.Entidades;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Nextt_Gestao_Compra.Aplicacao.ViewModel
{
    public class PedidoPdfVM
    {
        public int IDPedido { get; set; }
        public string Comprador { get; set; }
        public string Status { get; set; }

        public string FormasPagamento { get; set; }
        public string CondicaoPagamento { get; set; }
        public string DtCadastroPedido { get; set; }
        public string DataEntrega { get; set; }
        public string DataToleranciaAtraso { get; set; }

        public string CodProduto { get; set; }
        public string CodigoOriginal { get; set; }
        public string DescricaoProduto { get; set; }
        public string DescricaoReduzidaProduto { get; set; }
        public string DescricaoMarca { get; set; }
        public string DescricaoSegmentoSecaoEspecie { get; set; }

        public string ProdutoStatus { get; set; }
        public string UnidadeMedida { get; set; }
        public string DtCadastroProduto { get; set; }
        public List<AtributoPdfVM> AtributosProd { get; set; }
        public List<AtributoPdfVM> AtributosPed { get; set; }

        public string RazaoSocial { get; set; }
        public string NomeFantasia { get; set; }
        public string ReferenciaFornecedor { get; set; }
        public decimal QualidadeValor { get; set; }
        public decimal QualidadeQtde { get; set; }
        public string Observacao { get; set; }

        public decimal PrecoCusto { get; set; }
        public decimal Desconto { get; set; }
        public decimal DescontoPontualidade { get; set; }
        public decimal Acrescimo { get; set; }
        public decimal Ipi { get; set; }
        public decimal Pis { get; set; }
        public decimal Cofins { get; set; }
        public decimal Icms { get; set; }
        public int QtdeItens { get; set; }
        public decimal ValorTotal { get; set; }

        public List<PackVM> Packs { get; set; }

        public PedidoPdfVM(string idPedido, PedidoCadastrado pedidoCadastrado, ResumoPedido resumo)
        {

            IDPedido = int.Parse(idPedido);

            Packs = new List<PackVM>();
            ProdutoStatus = !pedidoCadastrado.Ativo ? "Inativo" : "Ativo";

            Observacao = pedidoCadastrado.Observacao;
            ReferenciaFornecedor = pedidoCadastrado.ReferenciaFornecedor;
            NomeFantasia = pedidoCadastrado.NomeFantasia;
            RazaoSocial = pedidoCadastrado.RazaoSocial;
            CodProduto = pedidoCadastrado.CodProduto;
            DescricaoMarca = pedidoCadastrado.DescricaoMarca;
            CodigoOriginal = pedidoCadastrado.CodigoOriginal;
            DescricaoSegmentoSecaoEspecie = pedidoCadastrado.DescricaoSegmento + "/" + pedidoCadastrado.DescricaoSecao + "/" + pedidoCadastrado.DescricaoEspecie;

            DtCadastroPedido = resumo.DataCadastro.ToString("dd/MM/yyyy hh:mm:ss");
            DtCadastroProduto = pedidoCadastrado.DataCadastroProduto.ToString("dd/MM/yyyy hh:mm:ss");
            QtdeItens = resumo.QtdeItens;
            ValorTotal = resumo.ValorTotal;
            DescricaoProduto = pedidoCadastrado.DescricaoProduto;
            DescricaoReduzidaProduto = pedidoCadastrado.DescricaoReduzidaProduto;
            PrecoCusto = pedidoCadastrado.PrecoCusto;
            Desconto = pedidoCadastrado.Desconto;
            DescontoPontualidade = pedidoCadastrado.DescontoPontualidade;
            Acrescimo = pedidoCadastrado.Acrescimo;
            Ipi = pedidoCadastrado.Ipi;
            Pis = pedidoCadastrado.Pis;
            Cofins = pedidoCadastrado.Cofins;
            Icms = pedidoCadastrado.Icms;
            QualidadeValor = pedidoCadastrado.QualidadeValor;
            QualidadeQtde = pedidoCadastrado.QualidadeQtde;
            Status = pedidoCadastrado.Status;
            AtributosPed = new List<AtributoPdfVM>();
            AtributosProd = new List<AtributoPdfVM>();
        }
        public void CarregaAtributosPedido(List<AtributoElementoVM> atributoElementos, List<ComboAtributoVM> atributoCombo)
        {
            AtributosPed.AddRange(atributoElementos.Select(x => new AtributoPdfVM(x)));
            AtributosPed.AddRange(atributoCombo.Select(x => new AtributoPdfVM(x)));
            AtributosPed = AtributosPed.OrderBy(x => x.Ordem).Select(x => x).ToList();
        }
        public void CarregaAtributosProduto(List<AtributoElementoVM> atributoElementos, List<ComboAtributoVM> atributoCombo)
        {
            AtributosProd.AddRange(atributoElementos.Select(x => new AtributoPdfVM(x)));
            AtributosProd.AddRange(atributoCombo.Select(x => new AtributoPdfVM(x)));
            AtributosProd = AtributosProd.OrderBy(x => x.Ordem).Select(x => x).ToList();
        }

    }
}
