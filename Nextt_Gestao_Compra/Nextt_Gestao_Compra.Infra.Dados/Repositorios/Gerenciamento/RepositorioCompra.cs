using Nextt_Gestao_Compra.Dominio.Entidades;
using Nextt_Gestao_Compra.Dominio.Interfaces.Repositorio.Gerenciamento;
using Nextt_Gestao_Compra.Infra.Dados.Utils;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
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
                throw new Exception("RepositorioCompra.AtualizaFiltrosCadastroProduto: \n" + ex.Message, ex.InnerException);
            }
        }

        public List<IEnumerable> BuscaProdutosFiltrados(Parametros parametros)
        {
            try
            {
                return _Db.MultiplosResults("[dbo].[pr_consulta_produto_GESTAO_COMPRAS]" +
                                    " @IDSecao = '" + parametros.Secoes +
                                    "', @IDEspecie = '" + parametros.Especies +
                                    "', @IDMarca = '" + parametros.Marcas +
                                    "', @ReferenciaForncedor = '" + parametros.ReferenciaFornecedor +
                                    "', @IDFornecedor = '" + parametros.IDFornecedor +
                                    "', @IDProduto = '" + parametros.Codigo + "'")
                                    .With<DadosGerenciamentoProdutoCompra>()
                                    .Executar();
            }
            catch (Exception ex)
            {
                throw new Exception("RepositorioCompra.BuscaProdutosFiltrados: \n" + ex.Message, ex.InnerException);
            }
        }

        public List<IEnumerable> RetornaCargaEspeciesFiltros(string secoes)
        {
            try
            {
                return _Db.MultiplosResults("[dbo].[pr_carrega_filtro_secao_especie_GESTAO_COMPRAS]" +
                                   " @Secao = '" + secoes +
                                   "', @Especie = ''")
                                   .With<Especie>()
                                   .Executar();

            }
            catch (Exception ex)
            {
                throw new Exception("RepositorioCompra.RetornaCargaEspeciesFiltros: \n" + ex.Message, ex.InnerException);
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
                                    .With<Secao>()
                                    .Executar();
            }
            catch (Exception ex)
            {
                throw new Exception("RepositorioCompra.RetornaCargaInicialFiltros: \n" + ex.Message, ex.InnerException);
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
                                    .With<Fornecedor>()
                                    .With<Marca>()
                                    .With<Secao>()
                                    .With<GrupoTamanho>()
                                    .With<Cor>()
                                    .With<FormaPgto>()
                                    .With<CondicaoPgto>()
                                    .With<ClassificacaoFiscal>()
                                    .With<Grade>()
                                    .With<DadosUltimaCompra>()
                                    .With<GrupoFilial>()
                                    .With<GrupoFilial>()
                                    .With<Atributos>()
                                    .With<Atributos>()
                                    .Executar();
            }
            catch (Exception ex)
            {
                throw new Exception("RepositorioCompra.RetornaCargaInicialCadNovo: \n" + ex.Message, ex.InnerException);
            }
        }

        public List<IEnumerable> RetornaDadosPrePedido(Parametros parametros)
        {
            try
            {
                return _Db.MultiplosResults("[dbo].[pr_informacao_cadastro_produto_dados_inicial_GESTAO_COMPRAS]" +
                                   " @IDProduto = '" + parametros.Codigo +
                                   "', @CadastroNovo = " + false +
                                    ", @IDFornecedor = '" + parametros.IDFornecedor + "'")
                                   .With<DadosPrePedido>()
                                   .With<ReferenciaProduto>()
                                   .With<GrupoTamanho>()
                                   .With<Cor>()
                                   .With<FormaPgto>()
                                   .With<CondicaoPgto>()
                                   .With<ClassificacaoFiscal>()
                                   .With<Grade>()
                                   .With<DadosUltimaCompra>()
                                   .With<GrupoFilial>()
                                   .With<GrupoFilial>()
                                   .With<Atributos>()
                                   .With<Atributos>()
                                   .Executar();
            }
            catch (Exception ex)
            {
                throw new Exception("RepositorioCompra.RetornaDadosPrePedido: \n" + ex.Message, ex.InnerException);
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
                throw new Exception("RepositorioCompra.AtualizaCargaTamanho: \n" + ex.Message, ex.InnerException);
            }
        }

        public List<IEnumerable> RetornaGruposCadastrados()
        {
            try
            {
                return _Db.MultiplosResults("[dbo].[pr_consulta_grupo_filial_GESTAO_COMPRAS]")
                                   .With<GrupoFilial>()
                                   .Executar();

            }
            catch (Exception ex)
            {
                throw new Exception("RepositorioCompra.RetornaGruposCadastrados: \n" + ex.Message, ex.InnerException);
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
                throw new Exception("RepositorioCompra.RetornaFotosProduto: \n" + ex.Message, ex.InnerException);
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
                throw new Exception("RepositorioCompra.RetornaFiliaisDistribuicao: \n" + ex.Message, ex.InnerException);
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

                    paramID.ParameterName = "@IDPedido";
                    paramIDFoto.ParameterName = "@IDProdutoFoto";
                    paramFoto.ParameterName = "@Imagem";
                    paramExt.ParameterName = "@Extensao";

                    paramID.Value = fotoJson.IDProduto;
                    paramIDFoto.Value = fotoJson.IDProdutoFoto;
                    paramFoto.Value = fotoJson.Imagem;
                    paramExt.Value = fotoJson.Extensao;


                    paramID.DbType = DbType.Int32;
                    paramIDFoto.DbType = DbType.Guid;
                    paramFoto.DbType = DbType.Binary;
                    paramExt.DbType = DbType.String;

                    command.Parameters.Add(paramID);
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
                throw new Exception("RepositorioCompra.SalvarFotosProduto: \n" + ex.Message, ex.InnerException);
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
                throw new Exception("RepositorioCompra.GravarPedido: \n" + ex.Message, ex.InnerException);
            }

        }
    }

}
