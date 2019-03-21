using System;
using System.Collections.Generic;

namespace Nextt_Gestao_Compra.Aplicacao.ViewModel
{
    public class EntradaNFSalvarVM
    {
        public int IDFilial { get; set; }
        public int IDFornecedor { get; set; }
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


        public int QtdeVolume { get; set; }

        public string Observacao { get; set; }
        public string IDNFFornecedor { get; set; }
        public string Status { get; set; }
        public int Numero { get; set; }
        public int Serie { get; set; }
        public string ChaveAcessoNfe { get; set; }
        public string DataCadastro { get; set; }
        public string DataEntrega { get; set; }
        public string DataEmissao { get; set; }
        public string DataSaida { get; set; }
        public string IDUsuarioCadastro { get; set; }

        public List<EntradaNFPackPedidoSalvarVM> NFFornecedorPacks { get; set; }
        public EntradaNFSalvarVM()
        {
            DataCadastro = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
        }
    }
}
