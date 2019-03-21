using System.Collections.Generic;

namespace Nextt_Gestao_Compra.Aplicacao.ViewModel
{
    public class DadosDuplicataVM
    {
        public List<TituloNFVM> DocumentosTitulo { get; set; }
        public List<PackVM> PedidosDuplicata { get; set; }
        public List<ComboFiltroVM> FormaPgto { get; set; }
        public string Plano { get; set; }
        public string IDFormaPagamento { get; set; }
        public string IDGrupoEmpresaFaturamento { get; set; }
        public List<DescontoAcrescimoPadraoVM> DescontosAcrescimosPadrao { get; set; }
        public List<ComboFiltroVM> GrupoEmpresas { get; set; }
        public List<ComboFiltroVM> DescontosAcrescimos { get; set; }
        
    }
}
