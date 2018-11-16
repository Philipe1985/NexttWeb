using System;

namespace Nextt_Gestao_Compra.Dominio.Entidades
{
    public class Grade
    {
        public int IDProduto { get; set; }
        public int IDProdutoItem { get; set; }
        public Int16 IDCor { get; set; }
        public Int16 IDTamanho { get; set; }
        public Int16 IDGrupoTamanho { get; set; }
        public string DescricaoGrupoTamanho { get; set; }
        public Int16 Ordem { get; set; }
        public string Referencia { get; set; }
        public string DescricaoCor { get; set; }
        public string DescricaoTamanho { get; set; }
    }
}
