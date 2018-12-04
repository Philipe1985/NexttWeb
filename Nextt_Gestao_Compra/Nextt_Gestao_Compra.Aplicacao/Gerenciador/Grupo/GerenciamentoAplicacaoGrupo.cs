using AutoMapper;
using Newtonsoft.Json;
using Nextt_Gestao_Compra.Aplicacao.Servicos.Interfaces.Gerenciamento;
using Nextt_Gestao_Compra.Aplicacao.ViewModel;
using Nextt_Gestao_Compra.Dominio.Entidades;
using System.Linq;

namespace Nextt_Gestao_Compra.Aplicacao.Gerenciador.Grupo
{
    public class GerenciamentoAplicacaoGrupo
    {
        public static FiltrosCadastroGrupoVM RetornaGruposFiliais(IAppServicoGrupo servicoGrupo, FabricaViewModel fabrica)
        {
            var dados = servicoGrupo.BuscaGruposCadastrados();
            var listaGrupo = dados.ElementAt(0).Cast<GrupoFilial>().Select(x => fabrica.Criar(x)).ToList();
            var listaFiliais = dados.ElementAt(1).Cast<GrupoFilial>().Select(x => new { x.IDFilial, x.Filial_Nome }).Distinct()
                                        .Select(x => fabrica.CriarComboFilial(new GrupoFilial { IDFilial = x.IDFilial, Filial_Nome = x.Filial_Nome }))
                                        .ToList();
            var retorno = new FiltrosCadastroGrupoVM
            {
                Filiais = listaFiliais,
                Grupos = listaGrupo
            };
            return retorno;
        }
        public static FiltrosCadastroGrupoVM RetornaFiliaisPorGrupo(IAppServicoGrupo servicoGrupo, ParametrosVM parametroVM, FabricaViewModel fabrica)
        {
            var filtro = Mapper.Map<ParametrosVM, Parametros>(parametroVM);
            var dados = servicoGrupo.BuscaFiliaisPorGrupos(filtro);
            var listaGrupo = dados.ElementAt(0).Cast<GrupoFilial>().Select(x => fabrica.Criar(x)).ToList();
            var listaFiliais = dados.ElementAt(1).Cast<GrupoFilial>().Select(x => fabrica.CriarComboFilial(x)).ToList();
            var retorno = new FiltrosCadastroGrupoVM
            {
                Filiais = listaFiliais,
                Grupos = listaGrupo
            };

            return retorno;
        }
        public static ComboFiltroVM ManipularGrupos(IAppServicoGrupo servicoGrupo, GrupoFilialOperacaoVM objGrupos, FabricaViewModel fabrica)
        {
            var objJson = JsonConvert.SerializeObject(objGrupos.GruposOperacao);
            var grupoManipulado = servicoGrupo.ManipularGrupo(objJson).ElementAt(0).Cast<GrupoFilial>().FirstOrDefault();
            var retorno = fabrica.Criar(grupoManipulado);
            return retorno;
        }
        public static void ExcluirGrupos(IAppServicoGrupo servicoGrupo, ParametrosVM parametroVM)
        {
            var filtro = Mapper.Map<ParametrosVM, Parametros>(parametroVM);
            servicoGrupo.ExcluirGrupo(filtro);

        }
    }
}
