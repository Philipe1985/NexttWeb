using System.Collections.Generic;

namespace Nextt_Gestao_Compra.Aplicacao.ViewModel
{
    public class GrupoEmpresaEnvio
    {
        public int IDGrupoEmpresa { get; set; }
        public string Nome { get; set; }
        public List<MarcaVinculadaVM> MarcasVinculada { get; set; }
    }
}
