using Nextt_Gestao_Compra.Dominio.Entidades;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Nextt_Gestao_Compra.Dominio.Entidades.EnumAtributoTipo;

namespace Nextt_Gestao_Compra.Aplicacao.ViewModel
{
    public class AtributoCardVM
    {
        public int IDTipoAtributo { get; set; }
        public string Descricao { get; set; }
        public string Modelo { get; set; }
        public string Status { get; set; }
        public int Ordem { get; set; }
        public string Tipo { get; set; }

        public AtributoCardVM(Atributo atributos)
        {
            IDTipoAtributo = atributos.IDTipoAtributo;
            Descricao = atributos.Descricao;
            Status = atributos.Ativo ? "Ativo" : "Inativo";
            Tipo = atributos.Tipo == 0 && atributos.Lista ? "Lista" : Enum.GetName(typeof(TipoAtributo), atributos.Tipo);
            Ordem = atributos.Ordem;
            Modelo = atributos.Classe;
        }
    }
}
