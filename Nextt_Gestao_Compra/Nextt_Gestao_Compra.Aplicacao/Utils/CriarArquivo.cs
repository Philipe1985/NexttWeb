using Invoicer.Models;
using Invoicer.Services;
using Nextt_Gestao_Compra.Aplicacao.ViewModel;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.Globalization;
using System.IO;
using System.Linq;

namespace Nextt_Gestao_Compra.Aplicacao.Servicos.Utils
{
    public class CriarArquivo
    {
        private static readonly string pastaArquivos = AppDomain.CurrentDomain.BaseDirectory + @"Arquivos_Salvos\Pedidos";
        private static readonly string imagemLogo = AppDomain.CurrentDomain.BaseDirectory + @"ImagensArquivos\nexttLogo.png";
        private static readonly string diretorioImagemFicha = AppDomain.CurrentDomain.BaseDirectory + "ImagensArquivos";
        public static void GerarPDFPedido(PedidoPdfVM Pedido)
        {
            Directory.CreateDirectory(pastaArquivos);
            var arquivoNome = "PED-" + Pedido.IDPedido.ToString("000000") + ".pdf";
            string nomeImagem = null;

            var imagensProduto = new List<ImagemProdutoArquivo>();
            //if (Pedido.FotoProduto != null)
                //using (Image image = Image.FromStream(new MemoryStream(Pedido.FotoProduto.Imagem)))
                //{
                //    var caminhoImagem = Path.Combine(diretorioImagemFicha, Pedido.FotoProduto.IDProdutoFoto.ToString() + "." + Pedido.FotoProduto.Extensao.ToLower());
                //    image.Save(caminhoImagem, RetornaImagemFormato(Pedido.FotoProduto.Extensao));
                //    imagensProduto.Add(ImagemProdutoArquivo.Criar(caminhoImagem));
                //    imagensProduto.Add(ImagemProdutoArquivo.Criar(caminhoImagem));
                //    imagensProduto.Add(ImagemProdutoArquivo.Criar(caminhoImagem));
                //    imagensProduto.Add(ImagemProdutoArquivo.Criar(caminhoImagem));
                //    imagensProduto.Add(ImagemProdutoArquivo.Criar(caminhoImagem));
                //    imagensProduto.Add(ImagemProdutoArquivo.Criar(caminhoImagem));
                //    imagensProduto.Add(ImagemProdutoArquivo.Criar(caminhoImagem));
                //    imagensProduto.Add(ImagemProdutoArquivo.Criar(caminhoImagem));
                //    imagensProduto.Add(ImagemProdutoArquivo.Criar(caminhoImagem));
                //    imagensProduto.Add(ImagemProdutoArquivo.Criar(caminhoImagem));
                //}

            new InvoicerApi(SizeOption.A4, OrientationOption.Landscape, "R$ ")
               .TextColor("#337ab7")
               .BackColor("#bcd9e1")
               .Titulo("Pedido nº " + Pedido.IDPedido.ToString("0,0", CultureInfo.CreateSpecificCulture("pt-BR")))
               .Logo(imagemLogo, 83, 30)
               .CodigoPedido(Pedido.IDPedido.ToString("0,0", CultureInfo.CreateSpecificCulture("pt-BR")))
               .Comprador(Pedido.Comprador)
               .StatusPedido(Pedido.Status)
               .Produto(Dados.Criar("Produto", new string[] {
                   "Cod. Produto: " + Pedido.CodProduto,
                   "Cod. Original: " + Pedido.CodigoOriginal,
                   Pedido.DescricaoSegmentoSecaoEspecie,
                   "Descrição: " + Pedido.DescricaoProduto,
                   "Desc. Resumida: " + Pedido.DescricaoReduzidaProduto}))
               .Fornecedor(Dados.Criar("Fornecedor", new string[] {
                   "Razão Social: " + Pedido.RazaoSocial,
                   "Nome Fantasia: " + Pedido.NomeFantasia,
                   "Qlde. Nota: " + (Pedido.QualidadeValor /100).ToString("P", CultureInfo.CreateSpecificCulture("pt-BR")),
                   "Qtde. Nota: " + (Pedido.QualidadeQtde/100).ToString("P", CultureInfo.CreateSpecificCulture("pt-BR")),
                   "Referencia do Fornecedor: " + Pedido.ReferenciaFornecedor}))
               .ImagensProduto(imagensProduto)
               .Items(Pedido.Packs.Select(x => new Pack
               {
                   IDPedidoPack = x.IDPedidoPack,
                   PackItens = x.PackItens.Select(item => ItemRow.Criar(
                      item.ReferenciaItem,
                      item.DescricaoCor,
                      item.DadosTamanho.Select(t => new TamanhosPack { DescricaoTamanho = t.DescricaoTamanho, QtdeItens = t.QtdeItens }).ToList(),
                      item.TotalItens,
                      x.PackItens.ElementAt(0).DadosTamanho.ElementAt(0).QtdePack)).ToList()
               }).ToList())
               .Distribuicoes(Pedido.Packs.Select(x => 
               RetornaDistribuicaoPack(x.GruposDistribuir,Pedido.PrecoCusto,x.PackItens.ElementAt(0).TotalItens,x.IDPedidoPack)).ToList())
               .Footer("http://www.nexttsolucoes.com.br")
               .Save(Path.Combine(pastaArquivos, arquivoNome));

            if (nomeImagem != null)
                File.Delete(diretorioImagemFicha);
        }
        private static ImageFormat RetornaImagemFormato(string formato)
        {
            var retorno = ImageFormat.Jpeg;
            if (formato.ToLower() != "jpg" && formato.ToLower() != "jpeg")
                retorno = ImageFormat.Png;
            return retorno;
        }
        private static DetailRow RetornaDistribuicaoPack(List<GrupoDistribuicaoVM> grupos, decimal custo, int itensPack, int idPack)
        {
            var titulo = "Distribuição do Pack " + idPack;
            var listaDistPack = new List<DistribuicaoFilial>();
            foreach (var grupo in grupos)
                foreach (var item in grupo.Filiais)
                    listaDistPack.Add(new DistribuicaoFilial(
                            item.IDFilial,
                            item.QtdePack * itensPack,
                            grupo.Descricao,
                            item.Nome,
                            item.QtdePack * itensPack * custo,
                            item.QtdePack
                            ));
            return DetailRow.Criar(titulo, listaDistPack); ;
        }
    }
}
