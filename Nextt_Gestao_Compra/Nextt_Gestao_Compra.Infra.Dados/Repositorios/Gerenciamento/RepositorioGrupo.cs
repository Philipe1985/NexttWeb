using Nextt_Gestao_Compra.Dominio.Entidades;
using Nextt_Gestao_Compra.Dominio.Interfaces.Repositorio.Gerenciamento;
using Nextt_Gestao_Compra.Infra.Dados.Utils;
using System;
using System.Collections;
using System.Collections.Generic;

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
                throw new Exception("RepositorioGrupo.BuscaFiliaisPorGrupos: \n" + ex.Message, ex);
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
                throw new Exception("RepositorioGrupo.BuscaGruposFiliaisExistentes: \n" + ex.Message, ex);
            }
        }

        public void ExcluirGrupo(Parametros parametros)
        {
            try 
            {
                _Db.MultiplosResults("[dbo].[pr_excluir_grupo_filial_GESTAO_COMPRAS]" +
                                   " @IDGrupoFilial = " + parametros.IDGrupo)
                                   .Executar();
            }
            catch (Exception ex)
            {
                throw new Exception("RepositorioGrupo.ExcluirGrupo: \n" + ex.Message, ex);
            }
            
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
                
                throw new Exception("RepositorioGrupo.CadastrarGrupo: \n" + ex.Message, ex);
            }
        }
    }
}
