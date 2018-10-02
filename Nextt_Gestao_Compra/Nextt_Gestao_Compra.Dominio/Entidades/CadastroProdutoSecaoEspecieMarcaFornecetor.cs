using System;

namespace Nextt_Gestao_Compra.Dominio.Entidades
{
    public class CadastroProdutoSecaoEspecieMarcaFornecetor
    {
        public Int16 IDFornecedor { get; set; }
        public Int16 IDSecao { get; set; }
        public Int16 IDEspecie { get; set; }
        public int IDMarca { get; set; }
        public string RazaoSocial { get; set; }
        public string NomeFantasia { get; set; }
        public string CNPJ { get; set; }
        public string DescricaoMarca { get; set; }
        public string DescricaoEspecie { get; set; }
        public string DescricaoSecao { get; set; }
    }
}
