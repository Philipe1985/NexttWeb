using System;
using System.Collections.Generic;

namespace Nextt_Gestao_Compra.Aplicacao.ViewModel
{
    public class GruposValidadosVM
    {
        public string IDGrupo { get; set; }
        public List<string> IDGrupoDesativar { get; set; }
        public GruposValidadosVM(Int16 id)
        {
            IDGrupo = id.ToString();
            IDGrupoDesativar = new List<string>();
        }
    }
}
