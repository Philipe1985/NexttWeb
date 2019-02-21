using Nextt_Gestao_Compra.Aplicacao.Servicos.Interfaces.Gerenciamento;
using Nextt_Gestao_Compra.Aplicacao.ViewModel;
using Nextt_Gestao_Compra.Dominio.Entidades;
using System.Linq;

namespace Nextt_Gestao_Compra.Aplicacao.Gerenciador.Distribuicoes
{
    public class GerenciadorAplicacaoDistribuicao
    {
        public static FiltrosPesquisa RetornaDadosFiltroInicial(IAppServicoDistribuicao distribuicaoServico, FabricaViewModel fabrica)
        {
            var dados = distribuicaoServico.CarregaFiltrosPesquisa();

            var listaGruposFiliais = dados.ElementAt(0).Cast<GrupoFilial>().OrderBy(x => x.Descricao).Select(x => fabrica.Criar(x)).ToList();
            var listaFornecedores = dados.ElementAt(1).Cast<Fornecedor>().OrderBy(x => x.NomeFantasia).Select(x => fabrica.Criar(x)).ToList();
            var listaMarcas = dados.ElementAt(2).Cast<Marca>().OrderBy(x => x.Nome).Select(x => fabrica.Criar(x)).ToList();

            var listaSegmentos = dados.ElementAt(3).Cast<Segmento>().OrderBy(x => x.Descricao).Select(x => fabrica.Criar(x)).ToList();
            var retorno = new FiltrosPesquisa(listaFornecedores, listaSegmentos, listaMarcas)
            {
                GruposFiliais = listaGruposFiliais
            };
            return retorno;
        }

    }
}
