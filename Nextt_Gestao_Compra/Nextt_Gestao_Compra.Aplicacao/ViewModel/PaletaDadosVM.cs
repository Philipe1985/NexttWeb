using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Nextt_Gestao_Compra.Aplicacao.ViewModel
{
    public class PaletaDadosVM
    {
        public List<string> Descricoes { get; set; }
        public List<string> ValoresCSS { get; set; }

        public PaletaDadosVM(List<string> _valores, List<string> _descricao)
        {
            ValoresCSS = _valores;
            Descricoes = _descricao; 
        }
    }
}
