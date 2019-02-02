using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Nextt_Gestao_Compra.Dominio.Entidades
{
    public class TipoLista
    {
        public bool MultiSelect { get; set; }
        public Int16 IDTipoAtributo { get; set; }
        public bool Obrigatorio { get; set; }
        public string ValorInicial { get; set; }
        public int Ordem { get; set; }
        public string Descricao { get; set; }
        public List<Atributo> OpcoesLista { get; set; }

        public TipoLista(Atributo atributo)
        {
            IDTipoAtributo = atributo.IDTipoAtributo;
            MultiSelect = atributo.MultiplaSelecao;
            Descricao = atributo.Descricao;
            ValorInicial = atributo.ValorDefault;
            Obrigatorio = atributo.Obrigatorio;
            Ordem = atributo.Ordem;
            
        }
        public TipoLista CarregaOpcoesLista(List<Atributo> _opcoesLista)
        {
            OpcoesLista = _opcoesLista;
            return this;
        }
    }
}
