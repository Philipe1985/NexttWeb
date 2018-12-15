using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Nextt_Gestao_Compra.Aplicacao.ViewModel
{
   public class ProdutoVM
    {
        public decimal PrecoVenda { get; set; }
        public int IDUnidadeMedida { get; set; }
        public int IDProduto { get; set; }
        public int Codigo { get; set; }
        public string CodOriginal { get; set; }
        public string IDUsuarioCadastro { get; set; }
        public int IDSecao { get; set; }
        public int IDSegmento { get; set; }
        public int IDEspecie { get; set; }
        public int IDMarca { get; set; }
        public int IDGrupoTamanho { get; set; }
        public int IDClassificacaoFiscal { get; set; }
        public string Descricao { get; set; }
        public string DescricaoReduzida { get; set; }
        public string ReferenciaFornecedor { get; set; }
    }
}
