using Nextt_Gestao_Compra.Dominio.Entidades;
using System.Collections.Generic;
using System.Linq;

namespace Nextt_Gestao_Compra.Aplicacao.ViewModel
{
    public class GrupoCadastroVM
    {
        public int IDGrupo { get; set; }
        public string Descricao { get; set; }
        public List<string> Filiais { get; set; }
        public GrupoCadastroVM(List<GrupoFilial> gruposFiliais)
        {
            IDGrupo = gruposFiliais.ElementAt(0).IDGrupo;
            Descricao = gruposFiliais.ElementAt(0).DescricaoGrupo;
            Filiais = gruposFiliais.Select(x => x.IDFilial.ToString()).ToList();
        }
    }
}
