using Nextt_Gestao_Compra.Dominio.Entidades;

namespace Nextt_Gestao_Compra.Aplicacao.ViewModel
{
    public class FiliaisVM
    {
        public int IDFilial { get; set; }
        public string Nome { get; set; }
        public int TotalItens { get; set; }
        public decimal TotalCusto{ get; set; }
        public decimal PartVendas { get; set; }
        public decimal PartCobertura { get; set; }
        public decimal PartAtualizada { get; set; }
        public decimal VlrMedio { get; set; }
        public int QtdeCarteira { get; set; }
        public int QtdeEstoque { get; set; }
        public int QtdeVenda { get; set; }
        public int QtdePack { get; set; }

        public FiliaisVM(GrupoFilial filial,decimal acrescimo)
        {
            IDFilial = filial.IDFilial;
            Nome = filial.NomeFilial;
            PartVendas = filial.ParticipacaoVendas + acrescimo;
            PartCobertura = filial.ParticipacaoCobertura;
            VlrMedio = filial.VlrMedio;
            QtdeCarteira = filial.QtdeCarteira;
            QtdeEstoque = filial.QtdeEstoque;
            PartAtualizada = 0;
            QtdeVenda = filial.QtdeVenda;
            QtdePack = filial.QtdeItensDistribuido;
        }
        public FiliaisVM()
        {

        }

    }
}
