using Newtonsoft.Json;
using Nextt_Gestao_Compra.Aplicacao.Utils;
using System.Collections.Generic;

namespace Nextt_Gestao_Compra.Aplicacao.ViewModel
{
    public class PedidoCompletoVM
    {
        public PedidoVM Pedido { get; set; }
        public NovaCondicaoPgtoVM CondicaoPagamento { get; set; }
        public List<CondicaoFormaPgtoVM> PedidoCondicaoFormaPagamento { get; set; }
        public List<ProdutoItemVM> PedidoPack { get; set; }
        public List<PedidoAtributoVM> PedidoAtributo { get; set; }
        public List<ProdutoAtributoVM> ProdutoAtributo { get; set; }
        public List<TabelaPrecoVM> ProdutoTabelaPreco { get; set; }
        public ParametrosVM Parametros { get; set; }

        public string RetornaJsonPedido(PropertyRenameAndIgnoreSerializerContractResolver jsonResolver)
        {
            var ignorar = new string[] { "Parametros" };
            jsonResolver.IgnoreProperty(typeof(PedidoCompletoVM), ignorar);
            var jsonSettings = new JsonSerializerSettings() { ReferenceLoopHandling = ReferenceLoopHandling.Ignore, ContractResolver = jsonResolver };
            return JsonConvert.SerializeObject(this, jsonSettings);
        }
    }
}
