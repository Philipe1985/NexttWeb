using Nextt_Gestao_Compra.Dominio.Entidades;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Nextt_Gestao_Compra.Dominio.Interfaces.Repositorio.Gerenciamento
{
    public interface IRepositorioDistribuicao : IRepositorioPadrao<Parametros>
    {
        List<IEnumerable> CarregaFiltrosPesquisa();
    }
}
