using Nextt_Gestao_Compra.Dominio.Entidades;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Nextt_Gestao_Compra.Aplicacao.ViewModel
{
    public class PackVM
    {
        public int IDPedidoPack { get; set; }
        public List<GrupoDistribuicaoVM> GruposDistribuir { get; set; }
        public List<PackItensVM> PackItens { get; set; }
        public PackVM(List<ProdutoItem> produtoItems, List<GrupoFilial> grupoFilials)
        {
            IDPedidoPack = produtoItems.ElementAt(0).Pack;
            PackItens = produtoItems
                         .GroupBy(x => new { x.ReferenciaItem, x.DescricaoCor }).OrderBy(x => x.Key.ReferenciaItem)
                         .Select(x => new PackItensVM(x.Where(y => y.DescricaoCor == x.Key.DescricaoCor).ToList())).ToList();
            var totalPack = produtoItems.ElementAt(0).QtdePack;
            var totalParticipacaoGrupo = grupoFilials.GroupBy(x => x.IDGrupo).Sum(x => x.ElementAt(0).ParticipacaoGrupo);
            var participacaoDistribuir = (100 - totalParticipacaoGrupo) / grupoFilials
                                           .GroupBy(x => x.IDGrupo)
                                           .Select(x => x.ToList())
                                           .Count();
            GruposDistribuir = grupoFilials.OrderBy(x => x.IDGrupo).ThenBy(x => x.IDFilial).GroupBy(x => x.IDGrupo)
                                           .Select(x => x.ToList())
                                           .ToList()
                                           .Select(x => new GrupoDistribuicaoVM(x, participacaoDistribuir))
                                           .ToList();
            ValidaQtdPacksDistribuido(totalPack);
        }
        private void ValidaQtdPacksDistribuido(int qtdCompradoPack)
        {
            var qtdDistribuida = GruposDistribuir.Sum(x => x.Filiais.Sum(y => y.QtdePack));
             if (qtdDistribuida != qtdCompradoPack)
            { throw new Exception("Quantidade de packs retornadas no pack " + IDPedidoPack +
                " incompativel com a quantidade de packs a distribuir. \r\n Qtd total no pack:" + qtdCompradoPack+
                "\r\n Qtd total nos grupos:" + qtdDistribuida); }
        }

    }
}
