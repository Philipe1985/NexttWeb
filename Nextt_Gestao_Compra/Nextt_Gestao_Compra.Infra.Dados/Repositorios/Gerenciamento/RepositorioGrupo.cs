using Nextt_Gestao_Compra.Dominio.Entidades;
using Nextt_Gestao_Compra.Dominio.Interfaces.Repositorio.Gerenciamento;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Collections;
using Nextt_Gestao_Compra.Infra.Dados.Utils;

namespace Nextt_Gestao_Compra.Infra.Dados.Repositorios.Gerenciamento
{
    public class RepositorioGrupo : RepositorioPadrao<Parametros>, IRepositorioGrupo
    {
        public List<IEnumerable> BuscaFiliaisPorGrupos(Parametros parametros)
        {
            try
            {
                return _Db.MultiplosResults("[dbo].[pr_consulta_grupo_filial_GESTAO_COMPRAS]" +
                                    " @IDGrupoFilial = '" + parametros.IDGrupo + "'")
                                   .With<GrupoFilial>()
                                   .With<GrupoFilial>()
                                   .Executar();
            }
            catch (Exception ex)
            {
                throw new Exception("RepositorioGrupo.BuscaFiliaisPorGrupos: \n" + ex.Message, ex.InnerException);
            }
        }

        public List<IEnumerable> BuscaGruposFiliaisExistentes()
        {
            try
            {
                return _Db.MultiplosResults("[dbo].[pr_consulta_grupo_filial_GESTAO_COMPRAS]")
                                   .With<GrupoFilial>()
                                   .With<GrupoFilial>()
                                   .Executar();

            }
            catch (Exception ex)
            {
                throw new Exception("RepositorioGrupo.BuscaGruposFiliaisExistentes: \n" + ex.Message, ex.InnerException);
            }
        }

        public void ExcluirGrupo(Parametros parametros)
        {
            _Db.MultiplosResults("[dbo].[pr_excluir_grupo_filial_GESTAO_COMPRAS]" +
                                   " @IDGrupoFilial = " + int.Parse(parametros.IDGrupo))
                                   .Executar();
        }

        public List<IEnumerable> ManipularGrupo(string grpJson)
        {
            try
            {
                return _Db.MultiplosResults("[dbo].[pr_gravar_grupo_filial_GESTAO_COMPRAS]" +
                                   " @JSONGrupoFilial = '" + grpJson + "'")
                                   .With<GrupoFilial>()
                                   .Executar();
            }
            catch (Exception ex)
            {
                throw new Exception("RepositorioGrupo.CadastrarGrupo: \n" + ex.Message, ex.InnerException);
            }
        }
    }

    //Gravar GruposFiliais

    //Buscar Filiais por grupo
}
