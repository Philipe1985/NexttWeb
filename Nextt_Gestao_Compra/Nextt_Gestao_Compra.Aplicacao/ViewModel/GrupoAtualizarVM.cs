using System.Collections.Generic;

namespace Nextt_Gestao_Compra.Aplicacao.ViewModel
{
    public class GrupoAtualizarVM
    {
        public int IDGrupoFilial { get; set; }
        public string Descricao { get; set; }
        public decimal ParticipacaoGrupo { get; set; }
        public bool Ativo { get; set; }
        public List<FilialAtualizarVM> Filiais { get; set; }
    }
}
