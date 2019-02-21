using Nextt_Gestao_Compra.Dominio.Entidades;
using Nextt_Gestao_Compra.Dominio.Interfaces.Repositorio.Gerenciamento;
using Nextt_Gestao_Compra.Infra.Dados.Utils;
using System;
using System.Collections;
using System.Collections.Generic;

namespace Nextt_Gestao_Compra.Infra.Dados.Repositorios.Gerenciamento
{
    public class RepositorioDistribuicao : RepositorioPadrao<Parametros>, IRepositorioDistribuicao
    {

        public List<IEnumerable> CarregaFiltrosPesquisa()
        {
            try
            {
                return _Db.MultiplosResults("[dbo].[pr_carraga_filtros_distribuicao_VALIDAR]")
                                    .With<GrupoFilial>()
                                    .With<Fornecedor>()
                                    .With<Marca>()
                                    .With<Segmento>()
                                    .Executar();
            }
            catch (Exception ex)
            {
                throw new Exception("RepositorioDistribuicao.CarregaFiltrosPesquisa: \n" + ex.Message, ex);
            }
        }

    }
}
