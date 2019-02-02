using Nextt_Gestao_Compra.Dominio.Entidades;
using System;

namespace Nextt_Gestao_Compra.Aplicacao.ViewModel
{
    public class DadosConfigPadraoVM
    {
        public DateTime DataEntregaInicio { get; set; }
        public DateTime DataEntregaFinal { get; set; }
        public DateTime DataToleranciaAtrasoInicio { get; set; }
        public DateTime DataToleranciaAtrasoFinal { get; set; }
        public bool ProdutoBloqueado { get; set; }

        public DadosConfigPadraoVM(ConfigDefault config)
        {
            if (config != null)
            {
                DataEntregaInicio = DateTime.Now.AddDays(config.DataEntregaInicio);
                DataEntregaFinal = DateTime.Now.AddDays(config.DataEntregaFinal);
                DataToleranciaAtrasoInicio = DateTime.Now.AddDays(config.DataToleranciaAtrasoInicio);
                DataToleranciaAtrasoFinal = DateTime.Now.AddDays(config.DataToleranciaAtrasoFinal);
                ProdutoBloqueado = config.ProdutoPossuiPedido;
            }
           
        }
    }
    
}
