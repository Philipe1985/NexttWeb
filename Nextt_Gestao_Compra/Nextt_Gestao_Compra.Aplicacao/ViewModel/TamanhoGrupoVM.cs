using Nextt_Gestao_Compra.Aplicacao.Servicos.Interfaces.Gerenciamento;
using Nextt_Gestao_Compra.Dominio.Entidades;
using System.Collections.Generic;
using System.Linq;

namespace Nextt_Gestao_Compra.Aplicacao.ViewModel
{
    public class TamanhoGrupoVM
    {
        public List<ComboFiltroVM> TamanhosGrupo { get; set; }
        public TamanhoGrupoVM(IAppServicoCompra compraServico, FabricaViewModel fabrica, List<GrupoTamanho> tamanhos)
        {
            TamanhosGrupo = compraServico.RetornaTamanhosAtivo(tamanhos).Select(x => fabrica.Criar(x)).ToList();
            if (TamanhosGrupo.Count == 0)
            {
                TamanhosGrupo = tamanhos.Select(x => fabrica.Criar(x)).ToList();
            }
        }

    }
}
