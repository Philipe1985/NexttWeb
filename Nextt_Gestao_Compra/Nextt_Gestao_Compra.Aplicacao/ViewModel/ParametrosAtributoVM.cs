using System.Collections.Generic;

namespace Nextt_Gestao_Compra.Aplicacao.ViewModel
{
    public class ParametrosAtributoVM
    {
        public string Classe { get; set; }
        public List<AtributoTipoVM> Tipos { get; set; }
        public List<SegmanetosVM> Segmentos { get; set; }
    }
}
