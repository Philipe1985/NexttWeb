using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Nextt_Gestao_Compra.Dominio.Entidades
{
    public class PrecoGrupoEmpresa
    {
        public Int16 IDTabelaPreco { get; set; }
        public Int16 IDGrupoEmpresa { get; set; }
        public string TabelaPrecoDescricao { get; set; }
        public string GrupoEmpresaNome { get; set; }
        public decimal Preco { get; set; }
    }
}
