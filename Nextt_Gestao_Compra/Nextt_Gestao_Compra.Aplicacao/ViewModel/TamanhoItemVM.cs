using Nextt_Gestao_Compra.Dominio.Entidades;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Nextt_Gestao_Compra.Aplicacao.ViewModel
{
   public class TamanhoItemVM
    {
        public string DescricaoTamanho { get; set; }
        public int QtdeItens { get; set; }
        public int QtdePack { get; set; }
        public TamanhoItemVM(ProdutoItem item)
        {
            DescricaoTamanho = item.DescricaoTamanho;
            QtdeItens = item.QtdeItens;
            QtdePack = item.QtdePack;
        }
    }
}
