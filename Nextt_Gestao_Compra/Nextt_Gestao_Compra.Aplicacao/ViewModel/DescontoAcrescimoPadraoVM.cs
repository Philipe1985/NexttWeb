using Nextt_Gestao_Compra.Dominio.Entidades;
using System;

namespace Nextt_Gestao_Compra.Aplicacao.ViewModel
{
    public class DescontoAcrescimoPadraoVM
    {
        public Byte IDTipoDescontoAcrescimo { get; set; }
        public decimal Valor { get; set; }

        public DescontoAcrescimoPadraoVM(DescontoAcrescimoNF descontoAcrescimoNF)
        {
            IDTipoDescontoAcrescimo = descontoAcrescimoNF.IDTipoDescontoAcrescimo;
            Valor = descontoAcrescimoNF.Valor;
        }
        public DescontoAcrescimoPadraoVM() { }
    }
}
