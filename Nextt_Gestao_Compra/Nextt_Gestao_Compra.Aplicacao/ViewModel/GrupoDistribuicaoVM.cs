using Nextt_Gestao_Compra.Dominio.Entidades;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Nextt_Gestao_Compra.Aplicacao.ViewModel
{
    public class GrupoDistribuicaoVM
    {
        public int IDGrupo { get; set; }
        public string Descricao { get; set; }
        public decimal ParticipacaoGrupo { get; set; }
        public int QtdGrupoCadastrada { get; set; }
        public List<FiliaisVM> Filiais { get; set; }
        public GrupoDistribuicaoVM(List<GrupoFilial> grupos, decimal acrescimo)
        {

            IDGrupo = grupos.ElementAt(0).IDGrupo;
            var totalParticipacaoFilial = grupos.Sum(x => x.ParticipacaoVendas);
            var acrescimoFilial = (100 - totalParticipacaoFilial) / grupos.Count;
            Descricao = grupos.ElementAt(0).DescricaoGrupo;
            ParticipacaoGrupo = grupos.ElementAt(0).ParticipacaoGrupo + acrescimo;
            Filiais = grupos.Select(x => new FiliaisVM(x,acrescimoFilial)).ToList();
            QtdGrupoCadastrada = Filiais.Sum(x => x.QtdePack);
        }
    }
}
