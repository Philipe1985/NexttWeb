using Newtonsoft.Json;
using Nextt_Gestao_Compra.Aplicacao.Utils;
using System.Collections.Generic;

namespace Nextt_Gestao_Compra.Aplicacao.ViewModel
{
    public class ParametroNotaVM
    {
        public int IDPedido { get; set; }
        public string Distribuicao { get; set; }
        public string Tipo { get; set; }
        public int Numero { get; set; }
        public string ChaveAcesso { get; set; }
        public string DataCadastroInicio { get; set; }
        public string DataCadastroFinal { get; set; }
        public string DataEntregaInicio { get; set; }
        public string DataEntregaFinal { get; set; }
        public string CodigoProduto { get; set; }
        public List<FornecedorVM> Fornecedores { get; set; }
        public List<SegmanetosVM> Segmentos { get; set; }
        public List<MarcaVinculadaVM> Marcas { get; set; }
        public List<FiliaisVM> Filiais { get; set; }
        public List<StatusNFVM> StatusNFFornecedores { get; set; }

        public string RetornaJsonParametroConsultaEntrada()
        {
            var jsonResolver = new PropertyRenameAndIgnoreSerializerContractResolver();
            var ignorarChild = new string[] {
                "Nome", "TotalItens", "TotalCusto","QtdeCarteira", "QtdeEstoque", "QtdeVenda", "QtdePack",
                "PartVendas", "PartCobertura", "PartAtualizada", "VlrMedio"
            };
            var ignorarMain = new string[] {
                "IDPedido","Distribuicao","Tipo"
            };
            jsonResolver.IgnoreProperty(typeof(FiliaisVM), ignorarChild);
            jsonResolver.IgnoreProperty(typeof(ParametroNotaVM), ignorarMain);
            var jsonSettings = new JsonSerializerSettings() { ReferenceLoopHandling = ReferenceLoopHandling.Ignore, ContractResolver = jsonResolver };
            return JsonConvert.SerializeObject(this, jsonSettings);
        }
        public string RetornaJsonParametroConsultaPedido()
        {
            var jsonResolver = new PropertyRenameAndIgnoreSerializerContractResolver();
            var ignorarChild = new string[] {
                "Nome", "TotalItens", "TotalCusto","QtdeCarteira", "QtdeEstoque", "QtdeVenda", "QtdePack",
                "PartVendas", "PartCobertura", "PartAtualizada", "VlrMedio"
            };
            var ignorarMain = new string[] {
                "Distribuicao","Tipo","Numero", "ChaveAcesso", "DataCadastroInicio","DataCadastroFinal"
            };
            jsonResolver.RenameProperty(typeof(ParametroNotaVM), "StatusNFFornecedores", "StatusPedidos");
            jsonResolver.IgnoreProperty(typeof(FiliaisVM), ignorarChild);
            jsonResolver.IgnoreProperty(typeof(ParametroNotaVM), ignorarMain);
            var jsonSettings = new JsonSerializerSettings() { ReferenceLoopHandling = ReferenceLoopHandling.Ignore, ContractResolver = jsonResolver };
            return JsonConvert.SerializeObject(this, jsonSettings);
        }
        public string RetornaJsonParametroAddPackPedido()
        {
            var jsonResolver = new PropertyRenameAndIgnoreSerializerContractResolver();

            var ignorarMain = new string[] {
                "Fornecedores","Tipo","Numero", "ChaveAcesso", "DataCadastroInicio","DataCadastroFinal",
                "Marcas","Segmentos","Filiais","StatusNFFornecedores", "DataEntregaInicio","DataEntregaFinal",
                "CodigoProduto"
            };
            jsonResolver.IgnoreProperty(typeof(ParametroNotaVM), ignorarMain);
            var jsonSettings = new JsonSerializerSettings() { ReferenceLoopHandling = ReferenceLoopHandling.Ignore, ContractResolver = jsonResolver };
            return JsonConvert.SerializeObject(this, jsonSettings);
        }

    }
}
