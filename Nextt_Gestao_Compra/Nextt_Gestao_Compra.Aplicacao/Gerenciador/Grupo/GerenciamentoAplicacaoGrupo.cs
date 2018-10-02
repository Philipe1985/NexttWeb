using AutoMapper;
using Newtonsoft.Json;
using Nextt_Gestao_Compra.Aplicacao.Servicos.Interfaces.Gerenciamento;
using Nextt_Gestao_Compra.Aplicacao.ViewModel;
using Nextt_Gestao_Compra.Dominio.Entidades;
using System.Collections.Generic;
using System.Linq;

namespace Nextt_Gestao_Compra.Aplicacao.Gerenciador.Grupo
{
    public class GerenciamentoAplicacaoGrupo
    {
        public static FiltrosCadastroGrupoVM RetornaGruposFiliais(IAppServicoGrupo servicoGrupo, FabricaViewModel fabrica)
        {
            var dados = servicoGrupo.BuscaGruposCadastrados();
            var listaGrupo = dados.ElementAt(0).Cast<GrupoFilial>().Select(x => fabrica.Criar(x)).ToList();
            var listaFiliais = dados.ElementAt(1).Cast<GrupoFilial>().Select(x => fabrica.CriarComboFilial(x)).ToList();
            var retorno = new FiltrosCadastroGrupoVM
            {
                Filiais = listaFiliais,
                Grupos = listaGrupo
            };
            return retorno;
        }
        public static FiltrosCadastroGrupoVM RetornaFiliaisPorGrupo(IAppServicoGrupo servicoGrupo,ParametrosVM parametroVM)
        {
            var filtro = Mapper.Map<ParametrosVM, Parametros>(parametroVM);
            var dados = servicoGrupo.BuscaFiliaisPorGrupos(filtro).ElementAt(1).Cast<GrupoFilial>().GroupBy(x => x.IDGrupo).Select(x => x.ToList()).ToList();
            var retorno = new FiltrosCadastroGrupoVM
            {
                GruposCadastrados = new List<GrupoCadastroVM>()
            };
            for (int i = 0; i < dados.Count; i++)
            {
                retorno.GruposCadastrados.Add(new GrupoCadastroVM(dados[i]));
            }
            return retorno;
        }
        public static void AtualizarGruposCadastrados(IAppServicoGrupo servicoGrupo, ObjGruposAtualizarVM objGrupos)
        {
            var objJson = JsonConvert.SerializeObject(objGrupos);
            servicoGrupo.SalvarAtualizacaoGrupos(objJson);
        }
        public static FiltrosCadastroGrupoVM SalvarGrupoNovo(IAppServicoGrupo servicoGrupo, GrupoAtualizarVM objGrupo)
        {
            var objJson = JsonConvert.SerializeObject(objGrupo);
            var dados = servicoGrupo.CadastrarGrupo(objJson).ElementAt(0).Cast<GrupoFilial>().GroupBy(x => x.IDGrupo).Select(x => x.ToList()).ToList();
            var retorno = new FiltrosCadastroGrupoVM
            {
                GruposCadastrados = new List<GrupoCadastroVM>()
            };
            for (int i = 0; i < dados.Count; i++)
            {
                retorno.GruposCadastrados.Add(new GrupoCadastroVM(dados[i]));
            }
            return retorno;
        }
    }
}
