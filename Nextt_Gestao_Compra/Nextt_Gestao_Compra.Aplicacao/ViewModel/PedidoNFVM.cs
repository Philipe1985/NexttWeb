using Newtonsoft.Json;
using Nextt_Gestao_Compra.Aplicacao.Utils;
using System.Collections.Generic;

namespace Nextt_Gestao_Compra.Aplicacao.ViewModel
{
    public class PedidoNFVM
    {
        public List<PedidoAtributoVM> Pedidos { get; set; }

        public string RetornaJSONConsulta()
        {
            var jsonResolver = new PropertyRenameAndIgnoreSerializerContractResolver();
            var ignorarMain = new string[]{
                "IDTipoAtributo",
                "Valor",
                "Sequencial",
                "DataCadastro"
            };
            jsonResolver.IgnoreProperty(typeof(PedidoAtributoVM), ignorarMain);
            var jsonSettings = new JsonSerializerSettings() { ReferenceLoopHandling = ReferenceLoopHandling.Ignore, ContractResolver = jsonResolver };

            return JsonConvert.SerializeObject(this, jsonSettings);
        }
    }
}
