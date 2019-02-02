using System.Collections.Generic;

namespace Nextt_Gestao_Compra.Aplicacao.ViewModel
{
    public class AtributoSalvarVM
    {
        public int IDTipoAtributo { get; set; }
        public int Ordem { get; set; }
        public int Tipo { get; set; }
        public bool Ativo { get; set; }
        public bool MultiplaSelecao { get; set; }
        public bool Lista { get; set; }
        public bool Obrigatorio { get; set; }
        public string Descricao { get; set; }
        public string Classe { get; set; }
        public int ValorMinimo { get; set; }
        public int ValorMaximo { get; set; }
        public int CasaDecimal { get; set; }
        public string ValorDefault { get; set; }
        public List<AtributoSecaoEspecieVM> TipoAtributoEspecies { get; set; }
        public List<AtributoListaItemVM> TipoAtributoFilhos { get; set; }
    }
}
