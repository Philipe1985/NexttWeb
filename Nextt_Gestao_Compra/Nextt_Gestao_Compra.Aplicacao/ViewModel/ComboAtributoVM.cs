using Nextt_Gestao_Compra.Dominio.Entidades;
using System.Collections.Generic;
using System.Linq;

namespace Nextt_Gestao_Compra.Aplicacao.ViewModel
{
    public class ComboAtributoVM
    {
        public int IDTipoAtributo { get; set; }
        public string Descricao { get; set; }
        public bool Obrigatorio { get; set; }
        public string ValorDef { get; set; }
        public bool Multiplo { get; set; }
        public int Ordem { get; set; }
        public List<ComboFiltroVM> Opcoes { get; set; }
        public ComboAtributoVM(TipoLista tipoLista, FabricaViewModel fabrica)
        {
            IDTipoAtributo = tipoLista.IDTipoAtributo;
            Descricao = tipoLista.Descricao;
            Obrigatorio = tipoLista.Obrigatorio;
            Multiplo = tipoLista.MultiSelect;
            ValorDef = tipoLista.ValorInicial;
            Opcoes = tipoLista.OpcoesLista.Select(x => fabrica.Criar(x)).ToList();
            Ordem = tipoLista.Ordem;
        }
    }
}
