using Nextt_Gestao_Compra.Dominio.Entidades;
using System;
using static Nextt_Gestao_Compra.Dominio.Entidades.EnumAtributoTipo;

namespace Nextt_Gestao_Compra.Aplicacao.ViewModel
{
    public class AtributoElementoVM
    {
        public int IDTipoAtributo { get; set; }
        public string Descricao { get; set; }
        public string Tipo { get; set; }
        public bool Obrigatorio { get; set; }
        public string ValorDef { get; set; }
        public int Maximo { get; set; }
        public int Minimo { get; set; }
        public int Precisao { get; set; }
        public int Ordem { get; set; }
        public AtributoElementoVM(Atributos atributos)
        {
            IDTipoAtributo = atributos.IDTipoAtributo;
            Descricao = atributos.Descricao;
            Obrigatorio = atributos.Obrigatorio;
            ValorDef = atributos.ValorDefault;
            Maximo = atributos.ValorMaximo;
            Minimo = atributos.ValorMinimo;
            Precisao = atributos.CasaDecimal;
            Tipo = Enum.GetName(typeof(TipoAtributo), atributos.Tipo);
            Ordem = atributos.Ordem;

        }
    }
}
