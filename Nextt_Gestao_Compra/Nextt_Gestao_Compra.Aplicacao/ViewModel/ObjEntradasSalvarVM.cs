using Newtonsoft.Json;
using Nextt_Gestao_Compra.Aplicacao.Utils;
using System.Collections.Generic;

namespace Nextt_Gestao_Compra.Aplicacao.ViewModel
{
    public class ObjEntradasSalvarVM
    {
        public List<EntradaNFSalvarVM> NFFornecedor { get; set; }
        public string RetornaJsonParametroAtualizaStatusEntrada()
        {
            var jsonResolver = new PropertyRenameAndIgnoreSerializerContractResolver();

            var ignorarMain = new string[] {
                "IDFilial","IDFornecedor","ValorTotal","ValorBaseIcms","ValorBaseIcmsST","ValorIcms","ValorIcmsST","ValorProdutos","ValorFrete","ValorSeguro",
                "ValorDesconto","ValorIPI","ValorAproxTributos","ValorOutros","QtdeVolume","Observacao","Numero","Serie","ChaveAcessoNfe","DataCadastro","DataEntrega",
                "DataEmissao","DataSaida"
            };
            jsonResolver.RenameProperty(typeof(EntradaNFSalvarVM), "Status", "IDStatusNFFornecedor");
            jsonResolver.RenameProperty(typeof(EntradaNFSalvarVM), "IDUsuarioCadastro", "IDUsuarioOperador");
            jsonResolver.IgnoreProperty(typeof(EntradaNFSalvarVM), ignorarMain);
            var jsonSettings = new JsonSerializerSettings() { ReferenceLoopHandling = ReferenceLoopHandling.Ignore, ContractResolver = jsonResolver };
            return JsonConvert.SerializeObject(this, jsonSettings);
        }

    }
}
