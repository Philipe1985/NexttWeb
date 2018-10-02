using Nextt_Gestao_Compra.Dominio.Entidades;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Nextt_Gestao_Compra.Aplicacao.ViewModel
{
   public class ComboFiliaisVM
    {
        public string GrupoDescricao { get; set; }
        public List<ComboFiltroVM> ComboFilial { get; set; }
        public ComboFiliaisVM(List<GrupoFilial> filiais, FabricaViewModel fabrica)
        {
            GrupoDescricao = filiais.ElementAt(0).DescricaoGrupo.Trim();
            ComboFilial = filiais.OrderBy(x => x.NomeFilial).Select(x => fabrica.CriarComboFilial(x)).ToList();
        }
    }
}
