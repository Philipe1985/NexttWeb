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
                return _Db.MultiplosResults("[dbo].[pr_consulta_grupo_GESTAO_COMPRAS]" +
                                    " @grupo = '" + parametros.IDGrupo + "'")
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
                return _Db.MultiplosResults("[dbo].[pr_consulta_grupo_GESTAO_COMPRAS]")
                                   .With<GrupoFilial>()
                                   .With<GrupoFilial>()
                                   .Executar();

            }
            catch (Exception ex)
            {
                throw new Exception("RepositorioGrupo.BuscaGruposFiliaisExistentes: \n" + ex.Message, ex.InnerException);
            }
        }

        public List<IEnumerable> CadastrarGrupo(string grpJson)
        {
            try
            {
                return _Db.MultiplosResults("[dbo].[pr_consulta_filiais_por_grupo_GESTAO_COMPRAS]" +
                                   " @GravarGrupoFilial = '" + grpJson + "'")
                                   .With<GrupoFilial>()
                                   .Executar();
            }
            catch (Exception ex)
            {
                throw new Exception("RepositorioGrupo.CadastrarGrupo: \n" + ex.Message, ex.InnerException);
            }
        }

        public void SalvarAtualizacaoGrupos(string grpsJson)
        {
            try
            {
                _Db.MultiplosResults("[dbo].[pr_gravar_grupos_filiais_GESTAO_COMPRAS]" +
                                   " @GravarGrupoFilial = '" + grpsJson + "'").Executar();
            }
            catch (Exception ex)
            {
                throw new Exception("RepositorioGrupo.SalvarAtualizacaoGrupos: \n" + ex.Message, ex.InnerException);
            }
        }
    }

    //Gravar GruposFiliais

    //Buscar Filiais por grupo
}
