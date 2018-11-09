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
        public List<IEnumerable> RetornaCargaEspeciesFiltros(Parametros parametros)
        {
            try
            {
                return _Db.MultiplosResults("[dbo].[pr_consulta_secao_especie_GESTAO_COMPRAS]" +
                                    " @IDSecao = '" + parametros.Secoes +
                                    "', @IDSegmento = '" + parametros.Segmentos + "'")
                                    .With<Especie>()
                                    .Executar();
            }
            catch (Exception ex)
            {
                throw new Exception("RepositorioMovimentacao.RetornaCargaEspeciesFiltros: \n" + ex.Message, ex.InnerException);
            }
        }

        public List<IEnumerable> RetornaCargaSecaoFiltros(Parametros parametros)
        {
            try
            {
                var comando = "SELECT *" + "FROM[Nextt.Compras2].[dbo].[Secao] where IDSegmento in(" + parametros.Segmentos + ")";

                return _Db.MultiplosResults(comando).With<Secao>().Executar();
                //return _Db.MultiplosResults("[dbo].[pr_consulta_secao_especie_GESTAO_COMPRAS]" +
                //                                    " @IDSegmento = '" + parametros.Segmentos + "'")
                //                                    .With<Secao>()
                //                                    .Executar();
            }
            catch (Exception ex)
            {
                throw new Exception("RepositorioMovimentacao.RetornaCargaSecaoFiltros: \n" + ex.Message, ex.InnerException);
            }
        }

        public List<IEnumerable> RetornaSegmentoGrupos()
        {
            try
            {
                return _Db.MultiplosResults("[dbo].[pr_consulta_grupofilial_segmento_GESTAO_COMPRAS] SELECT [IDMarca],[Nome] FROM [Nextt.Compras2].[dbo].[Marca] where Ativo = 1")
                                    .With<Segmento>()
                                    .With<GrupoFilial>()
                                    .Executar();
            }
            catch (Exception ex)
            {
                throw new Exception("RepositorioMovimentacao.RetornaSegmentoGrupos: \n" + ex.Message, ex.InnerException);
            }
        }
    }
}
