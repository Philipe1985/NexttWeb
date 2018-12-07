using Nextt_Gestao_Compra.Dominio.Entidades;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Nextt_Gestao_Compra.Dominio.Interfaces.Repositorio.Gerenciamento
{
    public interface IRepositorioPedido : IRepositorioPadrao<Parametros>
    {
        List<IEnumerable> CarregaFiltrosPesquisaPedido();
        List<IEnumerable> PesquisaPedidos(Parametros parametros);
        List<IEnumerable> ClonarPedido(Parametros parametros);
        List<IEnumerable> RetornaPedidoSintetico(Parametros parametros);
        List<IEnumerable> RetornaPedidoAnalitico(Parametros parametros);
        string AtualizaStatusPedido(Parametros parametros);
    }
}
