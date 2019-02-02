using Nextt_Gestao_Compra.Dominio.Entidades;
using Nextt_Gestao_Compra.Dominio.Interfaces.Repositorio.Gerenciamento;
using Nextt_Gestao_Compra.Infra.Dados.Utils;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Linq;

namespace Nextt_Gestao_Compra.Infra.Dados.Repositorios.Gerenciamento
{
    public class RepositorioCompra : RepositorioPadrao<Parametros>, IRepositorioCompra
    {
        public List<IEnumerable> AtualizaFiltrosCadastroProduto(Parametros parametros)
        {
            try
            {
                return _Db.MultiplosResults("[dbo].[pr_carrega_filtro_informacoes_novo_produto_GESTAO_COMPRAS]" +
                                    " @IDSecao = '" + parametros.Secoes +
                                    "', @IDEspecie = '" + parametros.Especies +
                                    "', @IDMarca = '" + parametros.Marcas +
                                    "', @IDFornecedor = '" + parametros.IDFornecedor + "'")
                                    .With<CadastroProdutoSecaoEspecieMarcaFornecetor>()
                                    .Executar();
            }
            catch (Exception ex)
            {
                throw new Exception("RepositorioCompra.AtualizaFiltrosCadastroProduto: \n" + ex.Message, ex);
            }
        }

        public List<IEnumerable> BuscaProdutosFiltrados(Parametros parametros)
        {
            try
            {
                var status = "'";
                if (!string.IsNullOrEmpty(parametros.Status))
                {
                    status = "', @Ativo = " + (parametros.Status == "1") ;
                }
                return _Db.MultiplosResults("[dbo].[pr_consulta_produto_GESTAO_COMPRAS]" +
                                    " @IDSecao = '" + parametros.Secoes +
                                    "', @IDEspecie = '" + parametros.Especies +
                                    "', @IDSegmento = '" + parametros.Segmentos +
                                    status +
                                    ", @IDMarca = '" + parametros.Marcas +
                                    "', @ReferenciaForncedor = '" + parametros.ReferenciaFornecedor +
                                    "', @AtributoFornecedor = '" + parametros.AttrFornecedor +
                                    "', @IDFornecedor = '" + parametros.IDFornecedor +
                                    "', @pagina = '" + parametros.Paginas +
                                    "', @CodigoProduto = '" + parametros.Codigo +
                                    "', @IDProduto = ''")
                                    .With<DadosGerenciamentoProdutoCompra>()
                                    .With<Paginas>()
                                    .Executar();
            }
            catch (Exception ex)
            {
                throw new Exception("RepositorioCompra.BuscaProdutosFiltrados: \n" + ex.Message, ex);
            }
        }

        public List<IEnumerable> RetornaCargaEspeciesFiltros(Parametros parametros)
        {
            try
            {
                return _Db.MultiplosResults("[dbo].[pr_carrega_filtro_secao_especie_GESTAO_COMPRAS]" +
                                   " @Secao = '" + parametros.Secoes +
                                   "', @IDFornecedor = '" + parametros.IDFornecedor +
                                   "', @Especie = ''")
                                   .With<Especie>()
                                   .With<Atributo>()
                                   .With<Atributo>()
                                   .Executar();

            }
            catch (Exception ex)
            {
                throw new Exception("RepositorioCompra.RetornaCargaEspeciesFiltros: \n" + ex.Message, ex);
            }
        }

        public List<IEnumerable> RetornaCargaInicialFiltros()
        {
            try
            {
                return _Db
                    .MultiplosResults("[dbo].[pr_carrega_filtro_pesquisa_produto_Gestao_Compras]")
                                    .With<Fornecedor>()
                                    .With<Marca>()
                                    .With<Segmento>()
                                    .With<Atributo>()
                                    .Executar();
            }
            catch (Exception ex)
            {
                throw new Exception("RepositorioCompra.RetornaCargaInicialFiltros: \n" + ex.Message, ex);
            }
        }

        public List<IEnumerable> RetornaCargaInicialCadNovo(Parametros parametros)
        {
            try
            {
                return _Db.MultiplosResults("[dbo].[pr_informacao_cadastro_produto_dados_inicial_GESTAO_COMPRAS]" +
                                    " @IDProduto = '" + parametros.Codigo +
                                    "', @CadastroNovo = " + true +
                                     ", @IDFornecedor = '" + parametros.IDFornecedor + "'")
                                    .With<StatusPedido>()
                                    .With<Fornecedor>()
                                    .With<Marca>()
                                    .With<Segmento>()
                                    .With<Atributo>()
                                    .With<GrupoTamanho>()
                                    .With<Cor>()
                                    .With<FormaPgto>()
                                    .With<CondicaoPgto>()
                                    .With<ClassificacaoFiscal>()
                                    .With<Grade>()
                                    .With<GrupoFilial>()
                                    .With<GrupoFilial>()
                                    .With<Atributo>()
                                    .With<Atributo>()
                                    .With<Comprador>()
                                    .With<UnidadeMedida>()
                                    .With<ConfigDefault>()
                                    .With<PrecoGrupoEmpresa>()
                                    .With<Comprador>()
                                    .Executar();
            }
            catch (Exception ex)
            {
                throw new Exception("RepositorioCompra.RetornaCargaInicialCadNovo: \n" + ex.Message, ex);
            }
        }

        public List<IEnumerable> RetornaDadosPrePedido(Parametros parametros)
        {
            try
            {
                return _Db.MultiplosResults("[dbo].[pr_informacao_cadastro_produto_dados_inicial_GESTAO_COMPRAS]" +
                                   " @IDProduto = '" + parametros.Codigo +
                                   "', @CadastroNovo = " + false )
                                   .With<StatusPedido>()
                                   .With<DadosPrePedido>()
                                   .With<ReferenciaProduto>()
                                   .With<GrupoTamanho>()
                                   .With<Cor>()
                                   .With<FormaPgto>()
                                   .With<CondicaoPgto>()
                                   .With<ClassificacaoFiscal>()
                                   .With<Grade>()
                                   .With<GrupoFilial>()
                                   .With<GrupoFilial>()
                                   .With<Atributo>()
                                   .With<Atributo>()
                                   .With<Fornecedor>()
                                   .With<Comprador>()
                                   .With<UnidadeMedida>()
                                   .With<ConfigDefault>()
                                   .With<PrecoGrupoEmpresa>()
                                   .With<Comprador>()
                                   .With<Marca>()
                                 .Executar();
            }
            catch (Exception ex)
            {
                throw new Exception("RepositorioCompra.RetornaDadosPrePedido: \n" + ex.Message, ex);
            }
        }

        public List<GrupoTamanho> AtualizaCargaTamanho(Parametros parametros)
        {
            try
            {
                return _Db.MultiplosResults("[dbo].[pr_consulta_tamanho_GESTAO_COMPRAS] @IDGrupoTamanho = '" + parametros.Codigo + "'")
                                    .With<GrupoTamanho>()
                                    .Executar()
                                    .ElementAt(0)
                                    .Cast<GrupoTamanho>()
                                    .ToList();
            }
            catch (Exception ex)
            {
                throw new Exception("RepositorioCompra.AtualizaCargaTamanho: \n" + ex.Message, ex);
            }
        }

        public List<IEnumerable> RetornaGruposCadastrados()
        {
            try
            {
                return _Db.MultiplosResults("[dbo].[pr_consulta_grupo_filial_GESTAO_COMPRAS] @Origem=true")
                                   .With<GrupoFilial>()
                                   .Executar();

            }
            catch (Exception ex)
            {
                throw new Exception("RepositorioCompra.RetornaGruposCadastrados: \n" + ex.Message, ex);
            }
        }

        public List<FotoProduto> RetornaFotosProduto(Parametros parametros)
        {
            try
            {
                return _Db.MultiplosResults("[dbo].[pr_consulta_foto_produto_GESTAO_COMPRAS]" +
                                   " @IDProduto = '" + parametros.Codigo + "'")
                                   .With<FotoProduto>()
                                   .Executar()
                                   .ElementAt(0)
                                   .Cast<FotoProduto>()
                                   .ToList();

            }
            catch (Exception ex)
            {
                throw new Exception("RepositorioCompra.RetornaFotosProduto: \n" + ex.Message, ex);
            }
        }

        public List<IEnumerable> RetornaFiliaisDistribuicao(Parametros parametros)
        {
            try
            {
                return _Db.MultiplosResults("[dbo].[pr_consulta_resultado_OTB_GESTAO_COMPRAS]" +
                                      " @mes = '" + parametros.Mes +
                                      "', @ano = '" + parametros.Ano +
                                      "', @secao = '" + parametros.Secoes +
                                      "', @especie = '" + parametros.Especies +
                                      "', @grupo = '" + parametros.IDGrupo + "'")
                                      .With<GrupoFilial>()
                                      .Executar();

            }
            catch (Exception ex)
            {
                throw new Exception("RepositorioCompra.RetornaFiliaisDistribuicao: \n" + ex.Message, ex);
            }
        }

        public FotoProduto SalvarFotosProduto(FotoProduto fotoJson)
        {
            try
            {
                using (var connection = _Db.Database.Connection)
                {
                    connection.Open();

                    var command = connection.CreateCommand();
                    command.CommandTimeout = 0;
                    command.CommandType = CommandType.StoredProcedure;
                    command.CommandText = "[dbo].[pr_gravar_foto_GESTAO_COMPRAS]";
                    #region Criando Parametros
                    var paramID = command.CreateParameter();
                    var paramIDFoto = command.CreateParameter();
                    var paramFoto = command.CreateParameter();
                    var paramExt = command.CreateParameter();
                    var paramIDProduto = command.CreateParameter();

                    paramID.ParameterName = "@IDPedido";
                    paramIDFoto.ParameterName = "@IDProdutoFoto";
                    paramFoto.ParameterName = "@Imagem";
                    paramExt.ParameterName = "@Extensao";
                    paramIDProduto.ParameterName = "@IDProduto";
                    if (!fotoJson.IsCadProduto)
                    {
                        paramID.Value = fotoJson.IDProduto;
                        paramIDProduto.Value = 0;
                    }
                    else
                    {
                        paramID.Value = 0;
                        paramIDProduto.Value = fotoJson.IDProduto;
                    }
                    
                    paramIDFoto.Value = fotoJson.IDProdutoFoto;
                    paramFoto.Value = fotoJson.Imagem;
                    paramExt.Value = fotoJson.Extensao;


                    paramID.DbType = DbType.Int32;
                    paramIDProduto.DbType = DbType.Int32;
                    paramIDFoto.DbType = DbType.Guid;
                    paramFoto.DbType = DbType.Binary;
                    paramExt.DbType = DbType.String;

                    command.Parameters.Add(paramID);
                    command.Parameters.Add(paramIDProduto);
                    command.Parameters.Add(paramIDFoto);
                    command.Parameters.Add(paramFoto);
                    command.Parameters.Add(paramExt);
                    #endregion
                    var teste = command.ExecuteNonQuery();
                    return fotoJson;
                }
            }
            catch (Exception ex)
            {
                throw new Exception("RepositorioCompra.SalvarFotosProduto: \n" + ex.Message, ex);
            }
        }

        public int GravarPedido(string pedidoJson)
        {
            try
            {
                return _Db.MultiplosResults("[dbo].[pr_gravar_pedido_GESTAO_COMPRAS]" +
                                     " @GravarPedido = '" + pedidoJson + "'")
                                      .With<DadosUltimaCompra>()
                                     .Executar()
                                     .ElementAt(0)
                                     .Cast<DadosUltimaCompra>()
                                     .ElementAt(0).IDPedido;
            }
            catch (Exception ex)
            {
                throw new Exception("RepositorioCompra.GravarPedido: \n" + ex.Message, ex);
            }

        }

        public List<IEnumerable> RetornaInformacaoFornecedorCompra(Parametros parametros)
        {
            try
            {
                return _Db.MultiplosResults("[dbo].[pr_retorna_dados_ultima_compra_GESTAO_COMPRAS]" +
                                    " @IDProduto = '" + parametros.Codigo +
                                    "', @IDFornecedor = '" + parametros.IDFornecedor + "'")
                                      .With<DadosCompraFornecedor>()
                                      .With<DadosUltimaCompra>()
                                      .With<Atributo>()
                                      .Executar();

            }
            catch (Exception ex)
            {
                throw new Exception("RepositorioCompra.RetornaFiliaisDistribuicao: \n" + ex.Message, ex);
            }
        }
    }

}
