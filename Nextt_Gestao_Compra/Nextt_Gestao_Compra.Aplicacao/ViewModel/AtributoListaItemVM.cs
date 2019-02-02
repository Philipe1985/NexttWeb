using System.Collections.Generic;

namespace Nextt_Gestao_Compra.Aplicacao.ViewModel
{
    public class AtributoListaItemVM
    {
        public int IDTipoAtributo { get; set; }
        public int Ordem { get; set; }
        public bool Ativo { get; set; }
        public string Descricao { get; set; }
        public string ValorDefault { get; set; }
        public List<AtributoSecaoEspecieVM> TipoAtributoEspecies { get; set; }
    }
}
