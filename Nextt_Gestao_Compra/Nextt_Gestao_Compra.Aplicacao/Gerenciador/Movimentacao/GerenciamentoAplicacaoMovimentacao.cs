using AutoMapper;
using Nextt_Gestao_Compra.Aplicacao.Servicos.Interfaces.Gerenciamento;
using Nextt_Gestao_Compra.Aplicacao.ViewModel;
using Nextt_Gestao_Compra.Dominio.Entidades;
using System.Collections.Generic;
using System.Linq;

namespace Nextt_Gestao_Compra.Aplicacao.Gerenciador.Movimentacao
{
    public  class GerenciamentoAplicacaoMovimentacao
    {
        public static FiltrosPesquisa RetornaGruposSegmentoMarca(IAppServicoMovimentacao servicoMovimentacao, FabricaViewModel fabrica)
        {
            var dadosRetorno = servicoMovimentacao.RetornaSegmentoGrupos();
            var listaSeg = dadosRetorno.ElementAt(0).Cast<Segmento>().OrderBy(x => x.Descricao).ToList();
            var listaGrupo = dadosRetorno.ElementAt(1).Cast<GrupoFilial>().Select(x => fabrica.Criar(x)).ToList();
            var retorno = new FiltrosPesquisa(listaSeg, fabrica)
            {
                GruposFiliais = listaGrupo
            };
            return retorno;
        }
        public static List<ComboFiltroVM> RetornaSecoes(IAppServicoMovimentacao servicoMovimentacao, FabricaViewModel fabrica, ParametrosVM parametroVM)
        {
            var filtro = Mapper.Map<ParametrosVM, Parametros>(parametroVM);
            var dadosRetorno = servicoMovimentacao.RetornaCargaSecaoFiltros(filtro);
            var listaSec = dadosRetorno.ElementAt(0).Cast<Secao>().Select(x => fabrica.Criar(x)).ToList();           
            return listaSec;
        }
    }
}
