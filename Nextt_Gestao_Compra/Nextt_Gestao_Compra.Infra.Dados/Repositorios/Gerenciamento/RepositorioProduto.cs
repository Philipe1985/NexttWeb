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
    public class RepositorioProduto : RepositorioPadrao<Parametros>, IRepositorioProduto
    {
        public int GravarProduto(string produtoJson)
        {
            try
            {
                return _Db.MultiplosResults("[dbo].[pr_gravar_produto_GESTAO_COMPRAS]" +
                                     " @GravarProduto = '" + produtoJson + "'")
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

    public List<IEnumerable> RetornaDadosCadastroProduto(Parametros parametros)
        {
            try
            {
                return _Db.MultiplosResults("[dbo].[pr_informacao_cadastro_produto_GESTAO_COMPRAS]" +
                                   " @IDProduto = '0', @CadastroNovo = " + false)
                                    .With<Fornecedor>()
                                    .With<Marca>()
                                    .With<Segmento>()
                                    .With<Atributos>()
                                    .With<GrupoTamanho>()
                                    .With<Cor>()
                                    .With<ClassificacaoFiscal>()
                                    .With<Grade>()
                                    .With<Atributos>()
                                    .With<Comprador>()
                                    .With<UnidadeMedida>()
                                    .Executar();
            }
            catch (Exception ex)
            {
                throw new Exception("RepositorioCompra.RetornaDadosPrePedido: \n" + ex.Message, ex);
            }
        }

        public List<IEnumerable> RetornaDadosProdutoEditar(Parametros parametros)
        {
            try
            {
                return _Db.MultiplosResults("[dbo].[pr_informacao_cadastro_produto_GESTAO_COMPRAS]" +
                                   " @IDProduto = '" + parametros.Codigo +
                                   "', @CadastroNovo = " + false)
                                   .With<DadosPrePedido>()
                                   .With<ReferenciaProduto>()
                                   .With<GrupoTamanho>()
                                   .With<Cor>()
                                   .With<ClassificacaoFiscal>()
                                   .With<Grade>()
                                   .With<Atributos>()
                                   .With<Comprador>()
                                   .With<UnidadeMedida>()
                                   .With<PrecoGrupoEmpresa>()
                                   .With<Marca>()
                                   .With<Comprador>()
                                 .Executar();
            }
            catch (Exception ex)
            {
                throw new Exception("RepositorioCompra.RetornaDadosPrePedido: \n" + ex.Message, ex);
            }
        }
    }
}
