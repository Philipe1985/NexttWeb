using Newtonsoft.Json;
using Nextt_Gestao_Compra.Aplicacao.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Nextt_Gestao_Compra.Aplicacao.ViewModel
{
    public class ObjSalvarTituloVM
    {
        public string IDNFFornecedor { get; set; }
        public string Plano { get; set; }
        public int IDFormaPagamento { get; set; }
        public int IDGrupoEmpresa { get; set; }
        public decimal ValorTotal { get; set; }
        public List<DescontoAcrescimoPadraoVM> TipoDescontosAcrescimos { get; set; }
        public List<TituloNFVM> Titulos { get; set; }

        public string RetornaJsonGeraTitulo()
        {

            var jsonResolver = new PropertyRenameAndIgnoreSerializerContractResolver();
            var ignorarMain = new string[] { "Titulos" };
            jsonResolver.IgnoreProperty(typeof(ObjSalvarTituloVM), ignorarMain);
            var jsonSettings = new JsonSerializerSettings() { ReferenceLoopHandling = ReferenceLoopHandling.Ignore, ContractResolver = jsonResolver };
            return JsonConvert.SerializeObject(this, jsonSettings);

        }
        public string RetornaJsonConfirmaTitulo()
        {
            var jsonResolver = new PropertyRenameAndIgnoreSerializerContractResolver();
            var ignorarMain = new string[] { "ValorTotal", "Plano", "TipoDescontosAcrescimos" };
            jsonResolver.IgnoreProperty(typeof(ObjSalvarTituloVM), ignorarMain);
            var jsonSettings = new JsonSerializerSettings() { ReferenceLoopHandling = ReferenceLoopHandling.Ignore, ContractResolver = jsonResolver };
            return JsonConvert.SerializeObject(this, jsonSettings);
        }
    }
}
