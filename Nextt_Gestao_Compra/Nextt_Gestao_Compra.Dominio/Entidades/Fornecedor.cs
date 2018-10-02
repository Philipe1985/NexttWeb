using System;

namespace Nextt_Gestao_Compra.Dominio.Entidades
{
    public class Fornecedor
    {
        public Int16 IDFornecedor { get; set; }
        public string RazaoSocial { get; set; }
        public string NomeFantasia { get; set; }
        public string CNPJ { get; set; }
        public string ReferenciaFornecedor { get; set; }
    }
}
