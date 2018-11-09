using Nextt_Gestao_Compra.Dominio.Entidades;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Nextt_Gestao_Compra.Aplicacao.ViewModel
{
   public class PaginasGridVM
    {
        public int PaginaNum { get; set; }
        public string IDReferencias { get; set; }
        public PaginasGridVM(Paginas pagina)
        {
            PaginaNum = pagina.Paginacao;
            IDReferencias = pagina.IDProdutoConcatenado;
        }
    }
}
