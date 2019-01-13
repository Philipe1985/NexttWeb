using Nextt_Gestao_Compra.Dominio.Entidades;
using Nextt_Gestao_Compra.Dominio.Interfaces.Repositorio.Gerenciamento;
using Nextt_Gestao_Compra.Infra.Dados.Utils;
using System;
using System.Collections;
using System.Collections.Generic;

namespace Nextt_Gestao_Compra.Infra.Dados.Repositorios.Gerenciamento
{
    public class RepositorioGrupoEmpresa : RepositorioPadrao<Parametros>, IRepositorioGrupoEmpresa
    {
        public List<IEnumerable> BuscaCargaInicial()
        {
            try
            {
                return _Db.MultiplosResults("[dbo].[pr_consulta_GrupoEmpresa_GESTAO_COMPRAS]")//select * from GrupoEmpresa select * from Marca where Ativo = 1
                                    .With<GrupoEmpresa>()
                                    .With<Marca>()
                                    .Executar();
            }
            catch (Exception ex)
            {
                throw new Exception("RepositorioGrupoEmpresa.BuscaCargaInicial: \n" + ex.Message, ex);
            }
        }

        public List<IEnumerable> BuscaMarcasGrupo(Parametros parametros)
        {
            try
            {
                return _Db.MultiplosResults("[dbo].[pr_consulta_marca_GESTAO_COMPRAS]"
                                   /*+ " @IDGrupoEmpresa = " + parametros.Codigo*/)//select * from GrupoEmpresa where IDGrupoEmpresa = " + parametros.Codigo + " select * from GrupoEmpresaMarca where IDGrupoEmpresa = " + parametros.Codigo
                                   //.With<GrupoEmpresa>()
                                   .With<Marca>()
                                   .Executar();
            }
            catch (Exception ex)
            {
                throw new Exception("RepositorioGrupoEmpresa.BuscaMarcasGrupo: \n" + ex.Message, ex);
            }
        }

        public void ExcluirGrupoEmpresa(Parametros parametros)
        {
            try
            {
                _Db.MultiplosResults("[dbo].[pr_excluir_grupo_empresa_GESTAO_COMPRAS]" +
                                   " @IDGrupoEmpresa = " + parametros.Codigo)
                                   .Executar();
            }
            catch (Exception ex)
            {
                throw new Exception("RepositorioGrupoEmpresa.ExcluirGrupoEmpresa: \n" + ex.Message, ex);
            }
        }

        public void GravarAtualizarGrupoEmpresa(string grpEmpJson)
        {
            try
            {
                _Db.MultiplosResults("[dbo].[pr_gravar_grupo_empresa_GESTAO_COMPRAS]" +
                                   " @GravarGrupoEmpresa = '" + grpEmpJson + "'")
                                   .Executar();
            }
            catch (Exception ex)
            {
                throw new Exception("RepositorioGrupoEmpresa.GravarAtualizarGrupoEmpresa: \n" + ex.Message, ex);
            }
        }
    }
}
