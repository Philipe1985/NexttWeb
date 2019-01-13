using AutoMapper;
using Newtonsoft.Json;
using Nextt_Gestao_Compra.Aplicacao.Servicos.Interfaces.Gerenciamento;
using Nextt_Gestao_Compra.Aplicacao.ViewModel;
using Nextt_Gestao_Compra.Dominio.Entidades;
using System.Collections.Generic;
using System.Linq;

namespace Nextt_Gestao_Compra.Aplicacao.Gerenciador.GrupoEmpresas
{
    public class GerenciadorAplicacaoGrupoEmpresa
    {
        public static FiltrosPesquisa RetornaDadosFiltroInicial(IAppServicoGrupoEmpresa grpEmpServico, FabricaViewModel fabrica)
        {
            var dados = grpEmpServico.BuscaCargaInicial();

            var listaGrupoEmpresas = dados.ElementAt(0).Cast<GrupoEmpresa>().OrderBy(x => x.IDGrupoEmpresa).Select(x => Mapper.Map<GrupoEmpresa, GrupoEmpresaVM>(x)).ToList();

            var listaMarcas = dados.ElementAt(1) != null ? 
                dados.ElementAt(1).Cast<Marca>().Where(x=>x.Ativo).OrderBy(x => x.Nome).Select(x => fabrica.Criar(x)).ToList() : 
                new List<ComboFiltroVM>();
            var retorno = new FiltrosPesquisa
            {
                Marcas = listaMarcas,
                GrupoEmpresas = listaGrupoEmpresas
            };
            return retorno;
        }
        public static GrupoEmpresaEditarVM RetornaDadosGrupoEditar(IAppServicoGrupoEmpresa grpEmpServico, ParametrosVM parametroVM)
        {
            var filtro = Mapper.Map<ParametrosVM, Parametros>(parametroVM);
            var dados = grpEmpServico.BuscaMarcasGrupo(filtro);
            
            var retorno = dados.Count > 1 ?
                new GrupoEmpresaEditarVM(dados.ElementAt(0).Cast<GrupoEmpresa>().FirstOrDefault(), dados.ElementAt(1).Cast<Marca>().ToList()):
                new GrupoEmpresaEditarVM(new GrupoEmpresa(), dados.ElementAt(0).Cast<Marca>().ToList());
            return retorno;
        }
        public static void GravarAtualizarGrupoEmpresas(IAppServicoGrupoEmpresa grpEmpServico, GrupoEmpresaSalvarVM grupo)
        {
            var grpEmpJson = JsonConvert.SerializeObject(grupo);
            grpEmpServico.GravarAtualizarGrupoEmpresa(grpEmpJson);
        }
        public static void ExcluirGrupoEmpresa(IAppServicoGrupoEmpresa servicoGrupoEmpresas, ParametrosVM parametroVM)
        {
            var filtro = Mapper.Map<ParametrosVM, Parametros>(parametroVM);
            servicoGrupoEmpresas.ExcluirGrupoEmpresa(filtro);
        }
    }
}
