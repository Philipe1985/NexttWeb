﻿using System;

namespace Nextt_Gestao_Compra.Aplicacao.ViewModel
{
    public class PedidosFiltradoVM
    {
        public int IDPedido { get; set; }
        public string CodProduto { get; set; }
        public string CodigoOriginal { get; set; }
        public int IDProduto { get; set; }
        public string DescricaoProduto { get; set; }
        public string NomeFantasia { get; set; }
        public string CNPJ { get; set; }
        public string DescricaoMarca { get; set; }
        public DateTime DataCadastro { get; set; }
        public DateTime DataEntregaInicio { get; set; }
        public DateTime DataEntregaFinal { get; set; }
        public int QtdePacks { get; set; }
        public int QtdeItens { get; set; }
        public decimal PrecoCusto { get; set; }
        public string Usuario { get; set; }
        public string Status { get; set; }
        public string IDStatusPedidoPara { get; set; }
        public string ProdutoReferenciaFornecedor { get; set; }
        public string FornecedorRazaoSocial { get; set; }
        public int Ordem { get; set; }
    }
}
