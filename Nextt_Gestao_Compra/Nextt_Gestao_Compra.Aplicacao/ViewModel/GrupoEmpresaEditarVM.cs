using AutoMapper;
using Nextt_Gestao_Compra.Dominio.Entidades;
using System.Collections.Generic;
using System.Linq;

namespace Nextt_Gestao_Compra.Aplicacao.ViewModel
{
    public class GrupoEmpresaEditarVM
    {
        public GrupoEmpresaVM grupo { get; set; }
        public List<string> MarcasVinculadas { get; set; }
        public GrupoEmpresaEditarVM(GrupoEmpresa grupoEmpresa, List<Marca> marcas)
        {
            grupo = Mapper.Map<GrupoEmpresa, GrupoEmpresaVM>(grupoEmpresa);
            MarcasVinculadas = marcas.Select(x => x.IDMarca.ToString()).ToList();
        }
    }
}
