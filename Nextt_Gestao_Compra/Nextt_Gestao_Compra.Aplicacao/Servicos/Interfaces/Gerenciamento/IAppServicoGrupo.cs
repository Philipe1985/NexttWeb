﻿using Nextt_Gestao_Compra.Dominio.Entidades;
using System.Collections;
using System.Collections.Generic;

namespace Nextt_Gestao_Compra.Aplicacao.Servicos.Interfaces.Gerenciamento
{
    public interface IAppServicoGrupo : IAppServicoPadrao<Parametros>
    {
        List<IEnumerable> BuscaGruposCadastrados();
        List<IEnumerable> BuscaFiliaisPorGrupos(Parametros parametros);
        List<IEnumerable> ManipularGrupo(string grpJson);
        void ExcluirGrupo(Parametros parametros);
    }
}
