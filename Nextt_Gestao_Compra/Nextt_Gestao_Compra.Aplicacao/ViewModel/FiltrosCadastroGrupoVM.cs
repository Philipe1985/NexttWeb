using System.Collections.Generic;

namespace Nextt_Gestao_Compra.Aplicacao.ViewModel
{
    public class FiltrosCadastroGrupoVM
    {
        
        public List<ComboFiltroVM> Grupos { get; set; }
        public List<ComboFiltroVM> Filiais { get; set; }
        public List<FilialAtualizarVM> GruposCadastrados { get; set; }
        
    }
}
