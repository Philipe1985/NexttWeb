using System.Collections.Generic;

namespace Nextt_Gestao_Compra.Aplicacao.ViewModel
{
    public class ComboFiltroVM
    {
        public string Valor { get; set; }
        public string Token { get; set; }
        public string Descricao { get; set; }
        public List<string> DadosAdicionais { get; set; }
    }
}