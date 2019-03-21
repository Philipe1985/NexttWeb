using Nextt_Gestao_Compra.Dominio.Entidades;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Nextt_Gestao_Compra.Aplicacao.ViewModel
{
    public class PackVM
    {
        public string IDNFPack { get; set; }
        public int IDPedidoPack { get; set; }
        public int QtdeNota { get; set; }
        public int QtdeEntregue { get; set; }
        public int QtdePedido { get; set; }
        public string TipoPack { get; set; }
        public string TipoAgrupamento { get; set; }
        public string TipoPackDescricao { get; set; }
        public decimal ValorTotal { get; set; }
        public List<GrupoDistribuicaoVM> GruposDistribuir { get; set; }
        public List<PackItensVM> PackItens { get; set; }

        public PackVM(List<ProdutoItem> produtoItens, List<GrupoFilial> grupoFilials)
        {
            IDPedidoPack = produtoItens.ElementAt(0).Pack;
            var qtdItensPack = produtoItens.Sum(x => x.QtdeItens) * produtoItens.ElementAt(0).QtdePack;
            PackItens = produtoItens
                         .GroupBy(x => new { x.ReferenciaItem, x.DescricaoCor }).OrderBy(x => x.Key.ReferenciaItem)
                         .Select(x => new PackItensVM(x.Where(y => y.DescricaoCor == x.Key.DescricaoCor).ToList(), qtdItensPack)).ToList();
            var totalPack = produtoItens.ElementAt(0).QtdePack;
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
        public PackVM(ProdutoItem packPedidoItem, List<ProdutoItem> produtoItems)
        {
            TipoAgrupamento = string.IsNullOrEmpty(packPedidoItem.Agrupamento) ? "CO" : packPedidoItem.Agrupamento;
            var tipoDist = TipoAgrupamento == "CO" ? "" : " (Por " + packPedidoItem.AgrupamentoDescricao + ") ";
            IDNFPack = packPedidoItem.IDNFFornecedorPack == Guid.Empty ? Guid.NewGuid().ToString() : packPedidoItem.IDNFFornecedorPack.ToString();
            IDPedidoPack = packPedidoItem.Pack;
            QtdeNota = packPedidoItem.QtdeNota;
            QtdeEntregue = packPedidoItem.QtdeEntregue;
            TipoPack = string.IsNullOrEmpty(packPedidoItem.TipoPack) ? "DG" : packPedidoItem.TipoPack;
            QtdePedido = packPedidoItem.QtdePedido;
            TipoPackDescricao = TipoPack == "DG" ? tipoDist + "Pack " + IDPedidoPack : packPedidoItem.TipoPackDescricao + tipoDist + " Pack " + IDPedidoPack;
            var qtdItensPack = 0;
            if (packPedidoItem.IDNFFornecedorPack == Guid.Empty)
            {
                qtdItensPack = produtoItems
                .Where(x => x.IDPedidoPack == packPedidoItem.IDPedidoPack)
                .Sum(x => x.QtdePedido) * packPedidoItem.QtdePedido;
                PackItens = produtoItems.Where(x => x.IDPedidoPack == packPedidoItem.IDPedidoPack)
                             .GroupBy(x => new { x.ReferenciaItem, x.DescricaoCor }).OrderBy(x => x.Key.ReferenciaItem)
                             .Select(x => new PackItensVM(x.Where(y => y.DescricaoCor == x.Key.DescricaoCor).ToList(), qtdItensPack, TipoPack == "DG")).ToList();

            }
            else
            {
                qtdItensPack = produtoItems
                .Where(x => x.IDNFFornecedorPack == packPedidoItem.IDNFFornecedorPack)
                .Sum(x => x.QtdePedido) * packPedidoItem.QtdePedido;
                PackItens = produtoItems.Where(x => x.IDNFFornecedorPack == packPedidoItem.IDNFFornecedorPack)
                             .GroupBy(x => new { x.ReferenciaItem, x.DescricaoCor }).OrderBy(x => x.Key.ReferenciaItem)
                             .Select(x => new PackItensVM(x.Where(y => y.DescricaoCor == x.Key.DescricaoCor).ToList(), qtdItensPack, TipoPack == "DG")).ToList();

            }

        }
        public PackVM(string tipo, List<ProdutoItem> produtoItems)
        {
            IDNFPack = Guid.NewGuid().ToString();
            IDPedidoPack = 0;
            QtdeNota = 0;
            QtdeEntregue = 0;
            TipoPack = tipo;
            QtdePedido = 0;
            TipoPackDescricao = "Pack ";
            var qtdItensPack = 0;

            PackItens = produtoItems.OrderBy(x => x.TamanhoOrdem)
                         .GroupBy(x => new { x.ReferenciaItem, x.DescricaoCor })
                         .Select(x => new PackItensVM(x.Where(y => y.DescricaoCor == x.Key.DescricaoCor).ToList(), qtdItensPack, TipoPack == tipo)).ToList();


        }
        public PackVM(ProdutoItem produtoItem)
        {
            IDPedidoPack = produtoItem.IDPedido;
            TipoPack = produtoItem.TipoPack;
            ValorTotal = produtoItem.ValorTotal;
        }
        private void ValidaQtdPacksDistribuido(int qtdCompradoPack)
        {
            var qtdDistribuida = GruposDistribuir.Sum(x => x.Filiais.Sum(y => y.QtdePack));
            if (qtdDistribuida != qtdCompradoPack)
            {
                throw new Exception("Quantidade de packs retornadas no pack " + IDPedidoPack +
                  " incompativel com a quantidade de packs a distribuir. \r\n Qtd total no pack:" + qtdCompradoPack +
                  "\r\n Qtd total nos grupos:" + qtdDistribuida);
            }
        }

    }
}
