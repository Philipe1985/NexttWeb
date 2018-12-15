using Nextt_Gestao_Compra.Dominio.Entidades;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Nextt_Gestao_Compra.Aplicacao.ViewModel
{
    public class PackItensVM
    {
        public string ReferenciaItem { get; set; }
        public string DescricaoCor { get; set; }
        public List<TamanhoItemVM> DadosTamanho { get; set; }
        public int TotalItens { get; set; }
        public PackItensVM(List<ProdutoItem> items,int totalItens)
        {
            ReferenciaItem = items.ElementAt(0).ReferenciaItem;
            DescricaoCor = items.ElementAt(0).DescricaoCor;
            DadosTamanho = items.Select(x => new TamanhoItemVM(x)).ToList();
            TotalItens = totalItens;
        }
    }
}
