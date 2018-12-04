using System;

namespace Nextt_Gestao_Compra.Dominio.Entidades
{
    public class DadosPrePedido
    {
        public int IDMarca { get; set; }
        public int IDProduto { get; set; }
        public Int16 IDSecao { get; set; }
        public Int16 IDGrupoTamanho { get; set; }
        public Int16 IDEspecie { get; set; }
        public string DescricaoGrupoTamanho { get; set; }
        public string DescricaoEspecie { get; set; }
        public string DescricaoSecao { get; set; }
        public string CodProduto { get; set; }
        public string CodigoOriginal { get; set; }
        public string DescricaoProduto { get; set; }
        public string DescricaoMarca { get; set; }
        public string DescricaoReduzidaProduto { get; set; }
        public string DescricaoReduzida { get; set; }
        public DateTime DataCadastroProduto { get; set; }
        public int IDClassificacaoFiscal { get; set; }
      
    }
}
