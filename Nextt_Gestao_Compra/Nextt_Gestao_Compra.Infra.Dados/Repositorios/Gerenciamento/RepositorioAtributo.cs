using Nextt_Gestao_Compra.Dominio.Entidades;
using Nextt_Gestao_Compra.Dominio.Interfaces.Repositorio.Gerenciamento;
using Nextt_Gestao_Compra.Infra.Dados.Utils;
using System;
using System.Collections;
using System.Collections.Generic;

namespace Nextt_Gestao_Compra.Infra.Dados.Repositorios.Gerenciamento
{
    public class RepositorioAtributo : RepositorioPadrao<Parametros>, IRepositorioAtributo
    {
        public List<IEnumerable> BuscaAtributoEditar(string atributoJson)
        {
            try
            {
                return _Db.MultiplosResults("[dbo].[pr_gc_consultar_detalhe_TipoAtributo]" +
                                    " @Parametros = '" + atributoJson + "'")
                                    .With<Atributo>()
                                    .With<TipoAtributoSecaoEspecie>()
                                    .Executar();
            }
            catch (Exception ex)
            {
                throw new Exception("RepositorioAtributo.BuscaAtributoEditar: \n" + ex.Message, ex);
            }
        }

        public List<IEnumerable> BuscaAtributosSintetico(string atributoJson)
        {
            try
            {
//                var teste = "{\"Parametros\":{\"Classe\": \"Produto\",\"Tipos\": [{ \"Tipo\": 0 }, { \"Tipo\": 1 },{ \"Tipo\": 5 }, { \"Tipo\": 2 }],\"Segmentos\": [{\"IDSegmento\": 1,\"Secoes\": [{ \"IDSecao\": 1, \"Especies\": [{ \"IDEspecie\": 11 }, { \"IDEspecie\": 14 }] },{ \"IDSecao\": 2, \"Especies\": [{ \"IDEspecie\": 15 }, { \"IDEspecie\": 16 }, { \"IDEspecie\": 17 }] },{ \"IDSecao\": 3, \"Especies\": [{ \"IDEspecie\": 18 }, { \"IDEspecie\": 19 }, { \"IDEspecie\": 20 }] }]},{\"IDSegmento\": 2,\"Secoes\": [{ \"IDSecao\": 4 }, { \"IDSecao\": 202 }, { \"IDSecao\": 303 }]},{\"IDSegmento\": 3,\"Secoes\": [{ \"IDSecao\": 5 }, { \"IDSecao\": 202 }, { \"IDSecao\": 303 }]}]}}";
                return _Db.MultiplosResults("[dbo].[pr_gc_consultar_TipoAtributo]" +
                                    " @Parametros = '" + atributoJson + "'")
                                    .With<Atributo>()
                                    .Executar();
            }
            catch (Exception ex)
            {
                throw new Exception("RepositorioAtributo.BuscaAtributosSintetico: \n" + ex.Message, ex);
            }
        }

        public List<IEnumerable> CarregaFiltrosPesquisa()
        {
            try
            {
                return _Db.MultiplosResults("[dbo].[pr_gc_dados_iniciais_cadastro_tipo_atributo]")
                                    .With<Segmento>()
                                    .With<Atributo>()
                                    .Executar();
            }
            catch (Exception ex)
            {
                throw new Exception("RepositorioAtributo.CarregaFiltrosPesquisa: \n" + ex.Message, ex);
            }
        }

        public void ExluirAtributo(string atributoJson)
        {
            try
            {
                _Db.MultiplosResults("[dbo].[pr_gc_excluir_TipoAtributo]" +
                                     " @Parametros = '" + atributoJson + "'")
                                     .Executar();
            }
            catch (Exception ex)
            {
                throw new Exception("RepositorioAtributo.ExluirAtributo: \n" + ex.Message, ex);
            }
        }

        public void SalvarAtributo(string atributoJson)
        {
            try
            {
                _Db.MultiplosResults("[dbo].[pr_gc_gravacao_TipoAtributo]" +
                                     " @GravarAtributo = '" + atributoJson + "'")
                                     .Executar();
            }
            catch (Exception ex)
            {
                throw new Exception("RepositorioAtributo.SalvarAtributo: \n" + ex.Message, ex);
            }
        }
    }
}
