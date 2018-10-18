using System;

namespace Nextt_Gestao_Compra.Aplicacao.ViewModel
{
    public class ProdutoAtributoVM
    {
        public int IDPedido { get; set; }
        public int IDProduto { get; set; }
        public int IDTipoAtributo { get; set; }
        public string Valor { get; set; }
        public int Sequencial { get; set; }
        public string DataCadastro { get; set; }
        public ProdutoAtributoVM()
        {
            DataCadastro = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
        }
    }
}
