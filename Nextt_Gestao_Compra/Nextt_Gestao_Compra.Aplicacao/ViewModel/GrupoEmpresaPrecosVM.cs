using Nextt_Gestao_Compra.Dominio.Entidades;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Nextt_Gestao_Compra.Aplicacao.ViewModel
{
   public class GrupoEmpresaPrecosVM
    {
        public string DescricaoGrupo { get; set; }
        public List<PrecoVendaVM> Precos { get; set; }

        public GrupoEmpresaPrecosVM(IEnumerable<PrecoGrupoEmpresa> precoGrupoEmpresa)
        {
            DescricaoGrupo = precoGrupoEmpresa.ElementAt(0).GrupoEmpresaNome;
            Precos = precoGrupoEmpresa.Select(x => new PrecoVendaVM() { IDTabelaPreco = x.IDTabelaPreco, Descricao = x.TabelaPrecoDescricao, Valor = x.Preco }).ToList();
        }
    }
}
