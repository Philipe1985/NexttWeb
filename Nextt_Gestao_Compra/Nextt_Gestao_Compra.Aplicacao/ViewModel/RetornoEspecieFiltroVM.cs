using Nextt_Gestao_Compra.Dominio.Entidades;
using System.Collections.Generic;
using System.Linq;

namespace Nextt_Gestao_Compra.Aplicacao.ViewModel
{
    public class RetornoEspecieFiltroVM
    {
        public string GrupoDescricao { get; set; }
        public List<ComboFiltroVM> FiltroEspecies { get; set; }
        public RetornoEspecieFiltroVM(List<Especie> especies, FabricaViewModel fabrica)
        {
            GrupoDescricao = especies.ElementAt(0).DescricaoSecao.Trim();
            FiltroEspecies = especies.OrderBy(x => x.DescricaoEspecie).Select(x => fabrica.Criar(x)).ToList();
        }
    }
}
