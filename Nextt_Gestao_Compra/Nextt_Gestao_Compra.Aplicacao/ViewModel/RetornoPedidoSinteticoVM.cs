﻿using Nextt_Gestao_Compra.Dominio.Entidades;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Nextt_Gestao_Compra.Aplicacao.ViewModel
{
   public class RetornoPedidoSinteticoVM
    {
        public int IDPedido { get; set; }
        public int IDProduto { get; set; }
        public string RazaoSocial { get; set; }
        public string NomeFantasia { get; set; }
        public string CNPJ { get; set; }
        public string ReferenciaFornecedor { get; set; }
        public string DataCadastro { get; set; }
        public string DataEntregaPrazo { get; set; }
        public decimal PrecoCustoTotal { get; set; }
        public string NomeUsuario { get; set; }
        public string CodProduto { get; set; }
        public string DescricaoReduzidaProduto { get; set; }
        public string DescricaoProduto { get; set; }
        public string DescSecEsp { get; set; }
        public decimal PrecoCusto { get; set; }
        public int Qtde { get; set; }
        public string Status { get; set; }
        public string IDStatusPedidoPara { get; set; }
        public decimal PrecoVenda { get; set; }
        public List<PackVM> Packs { get; set; }
        public ImagensProdutoVM FotoProduto { get; set; }
        public RetornoPedidoSinteticoVM(PedidoCadastrado dadosPedido, Fornecedor fornecedor, DadosPrePedido dadosPrePedido, ImagensProdutoVM imagem)
        {
            Status = dadosPedido.Status;
            IDStatusPedidoPara = dadosPedido.IDStatusPedidoPara;
            IDPedido = dadosPedido.IDPedido;
            IDProduto = dadosPrePedido.IDProduto;
            RazaoSocial = fornecedor.RazaoSocial;
            NomeFantasia = fornecedor.NomeFantasia;
            CNPJ = fornecedor.CNPJ;
            ReferenciaFornecedor = fornecedor.ReferenciaFornecedor;
            DataEntregaPrazo = dadosPedido.DataEntregaInicio.ToString("dd/MM/yyyy") + " a " + dadosPedido.DataEntregaFinal.ToString("dd/MM/yyyy");
            DataCadastro = DateTime.Parse(dadosPedido.DataCadastro).ToString("dd/MM/yyyy");
            PrecoCustoTotal = dadosPedido.PrecoCusto * dadosPedido.QtdeItens;
            PrecoCusto = dadosPedido.PrecoCusto;
            Qtde = dadosPedido.QtdeItens;
            NomeUsuario = dadosPedido.NomeUsuario;
            CodProduto = dadosPrePedido.CodProduto;
            DescricaoReduzidaProduto = dadosPrePedido.DescricaoReduzida;
            DescricaoProduto = dadosPrePedido.DescricaoProduto;
            PrecoVenda = dadosPedido.PrecoVenda;
            DescSecEsp = dadosPrePedido.DescricaoSecao + "/" + dadosPrePedido.DescricaoEspecie;
            Packs = new List<PackVM>();
            FotoProduto = imagem;
        }
    }
}
