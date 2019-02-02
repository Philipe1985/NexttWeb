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
        public static List<GrupoEmpresaVM> RetornaDadosFiltroInicial(IAppServicoGrupoEmpresa grpEmpServico)
        {
            var dados = grpEmpServico.BuscaCargaInicial();

            var listaGrupoEmpresas = dados.ElementAt(0).Cast<GrupoEmpresa>().OrderBy(x => x.IDGrupoEmpresa).Select(x => Mapper.Map<GrupoEmpresa, GrupoEmpresaVM>(x)).ToList();

            
            return listaGrupoEmpresas;
        }
        public static List<ComboFiltroVM> RetornaDadosGrupoEditar(IAppServicoGrupoEmpresa grpEmpServico, ParametrosVM parametroVM, FabricaViewModel fabrica)
        {
            var filtro = Mapper.Map<ParametrosVM, Parametros>(parametroVM);
            var dados = grpEmpServico.BuscaMarcasGrupo(filtro);
            var listaMarcas = dados.ElementAt(0).Cast<Marca>().OrderBy(x => x.Nome).Select(x => fabrica.Criar(x)).ToList();

            return listaMarcas;
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
