using Nextt_Gestao_Compra.Dominio.Entidades;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Nextt_Gestao_Compra.Aplicacao.Servicos.Interfaces.Gerenciamento
{
    public interface IAppServicoPedido : IAppServicoPadrao<Parametros>
    {
        List<IEnumerable> CarregaFiltrosPesquisaPedido();
        List<IEnumerable> PesquisaPedidos(Parametros parametros);
        List<IEnumerable> RetornaPedidoSintetico(Parametros parametros);
        List<IEnumerable> RetornaPedidoAnalitico(Parametros parametros);
        List<string> RetornaDescricaoCor(List<Cor> _listaCores);
        List<Cor> RetornaCoresPrincipais(List<Cor> _listaCores);
        List<string> RetornaCSSCor(List<Cor> _listaCores);
        string AtualizaStatusPedido(Parametros parametros);
        List<IEnumerable> ClonarPedido(Parametros parametros);
        List<GrupoTamanho> RetornaTamanhosAtivo(List<GrupoTamanho> _listaTamanho);
        List<TipoLista> RetornaAtributosTipoLista(List<Atributos> _listaAttr);
        List<Atributos> RetornaAtributosCampos(List<Atributos> _listaAttr);

    }
}
