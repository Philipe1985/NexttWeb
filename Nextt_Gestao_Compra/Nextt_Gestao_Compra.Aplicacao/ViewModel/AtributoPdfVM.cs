using Invoicer.Helpers;
using Nextt_Gestao_Compra.Dominio.Entidades;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Nextt_Gestao_Compra.Aplicacao.ViewModel
{
    public class AtributoPdfVM
    {
        public string Descricao { get; set; }
        public string ValorDefault { get; set; }
        public int Ordem { get; set; }

        public AtributoPdfVM(AtributoElementoVM atributo)
        {
            Descricao = atributo.Descricao;
            Ordem = atributo.Ordem;
            switch (atributo.Tipo)
            {
                case "Texto":
                    ValorDefault = atributo.ValorDef;
                    break;
                case "Numerico":
                    ValorDefault = Math.Round(double.Parse(atributo.ValorDef), atributo.Precisao)
                        .ToString("0,0", CultureInfo.CreateSpecificCulture("pt-BR"));
                    break;
                case "Monetario":
                    ValorDefault = Utils.ToCurrency(decimal.Parse(atributo.ValorDef), "R$ ");
                    break;
                case "Percentual":
                    ValorDefault = (double.Parse(atributo.ValorDef) / 100)
                        .ToString("P", CultureInfo.CreateSpecificCulture("pt-BR"));
                    break;
                case "Data":
                    ValorDefault = atributo.ValorDef;
                    break;
                case "Boleano":
                    ValorDefault = atributo.ValorDef == "0" ? "Não" : "Sim";
                    break;
            }
        }
        public AtributoPdfVM(ComboAtributoVM atributo)
        {
            Descricao = atributo.Descricao;
            Ordem = atributo.Ordem;
            ValorDefault = string.Join(", ", atributo.Opcoes.Where(x => x.DadosAdicionais[0] == "1").Select(x => x.Descricao).ToArray());
        }
    }
}
