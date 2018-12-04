using Nextt_Gestao_Compra.Dominio.Entidades;
using Nextt_Gestao_Compra.Dominio.Interfaces.Repositorio.Gerenciamento;
using Nextt_Gestao_Compra.Infra.Dados.Utils;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Nextt_Gestao_Compra.Infra.Dados.Repositorios.Gerenciamento
{
    public class RepositorioMovimentacao : RepositorioPadrao<Parametros>, IRepositorioMovimentacao
    {
        public List<IEnumerable> RetornaCargaRelatorios(Parametros parametros)
        {
            try
            {
                return _Db.MultiplosResults("[dbo].[pr_consulta_resultado_OTB_GESTAO_COMPRAS]" +
                                    " @mes = '" + parametros.Mes +
                                    "', @ano = '" + parametros.Ano +
                                    "', @secao = '72" +
                                    "', @especie = '2" +
                                    "', @grupo = '" + parametros.IDGrupo + "'")
                                    .With<GrupoFilial>()
                                    .Executar();
                //return _Db.MultiplosResults("[dbo].[pr_consulta_secao_especie_GESTAO_COMPRAS]" +
                //                    " @IDSecao = '" + parametros.Secoes +
                //                    "', @IDSegmento = '" + parametros.Segmentos + "'")
                //                    .With<Especie>()
                //                    .Executar();
            }
            catch (Exception ex)
            {
                throw new Exception("RepositorioMovimentacao.RetornaCargaEspeciesFiltros: \n" + ex.Message, ex);
            }
        }

        public List<IEnumerable> RetornaCargaSecaoFiltros(Parametros parametros)
        {
            try
            {
                return _Db.MultiplosResults("[dbo].[pr_carraga_filtro_movimentacao_produtos_GESTAO_COMPRAS]" +
                                                    " @IDSegmento = '" + parametros.Segmentos + "'")
                                                    .With<Secao>()
                                                    .Executar();
            }
            catch (Exception ex)
            {
                throw new Exception("RepositorioMovimentacao.RetornaCargaSecaoFiltros: \n" + ex.Message, ex);
            }
        }

        public List<IEnumerable> RetornaSegmentoGrupos()
        {
            try
            {
                return _Db.MultiplosResults("[dbo].[pr_carraga_filtro_movimentacao_produtos_GESTAO_COMPRAS]")
                                    .With<Segmento>()
                                    .With<GrupoFilial>()
                                    .With<Marca>()
                                    .Executar();
            }
            catch (Exception ex)
            {
                throw new Exception("RepositorioMovimentacao.RetornaSegmentoGrupos: \n" + ex.Message, ex);
            }
        }
    }
}
