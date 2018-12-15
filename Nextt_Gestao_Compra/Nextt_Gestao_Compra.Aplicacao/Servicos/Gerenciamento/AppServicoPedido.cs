using Nextt_Gestao_Compra.Aplicacao.Servicos.Interfaces.Gerenciamento;
using Nextt_Gestao_Compra.Dominio.Entidades;
using Nextt_Gestao_Compra.Dominio.Interfaces.Servico.Gerenciamento;
using System.Collections;
using System.Collections.Generic;

namespace Nextt_Gestao_Compra.Aplicacao.Servicos.Gerenciamento
{
    public class AppServicoPedido : AppServicoPadrao<Parametros>, IAppServicoPedido
    {
        private readonly IServicoPedido _servicoPedido;
        public AppServicoPedido(IServicoPedido servicoPedido) : base(servicoPedido)
        {
            _servicoPedido = servicoPedido;
        }

        public List<IEnumerable> CarregaFiltrosPesquisaPedido()
        {
            return _servicoPedido.CarregaFiltrosPesquisaPedido();
        }

        public List<IEnumerable> PesquisaPedidos(Parametros parametros)
        {
            return _servicoPedido.PesquisaPedidos(parametros);
        }

        public List<IEnumerable> RetornaPedidoAnalitico(Parametros parametros)
        {
            return _servicoPedido.RetornaPedidoAnalitico(parametros);
        }

        public List<IEnumerable> RetornaPedidoSintetico(Parametros parametros)
        {
            return _servicoPedido.RetornaPedidoSintetico(parametros);
        }
        public List<string> RetornaDescricaoCor(List<Cor> _listaCores)
        {
            return _servicoPedido.RetornaDescricaoCor(_listaCores);
        }
        public List<Cor> RetornaCoresPrincipais(List<Cor> _listaCores)
        {
            return _servicoPedido.RetornaCoresPrincipais(_listaCores);
        }

        public List<string> RetornaCSSCor(List<Cor> _listaCores)
        {
            return _servicoPedido.RetornaCSSCor(_listaCores);
        }

        public void AtualizaStatusPedido(Parametros parametros)
        {
           _servicoPedido.AtualizaStatusPedido(parametros);
        }

        public List<IEnumerable> ClonarPedido(Parametros parametros)
        {
            return _servicoPedido.ClonarPedido(parametros);
        }
        public List<Atributos> RetornaAtributosCampos(List<Atributos> _listaAttr)
        {
            return _servicoPedido.RetornaAtributosCampos(_listaAttr);
        }

        public List<TipoLista> RetornaAtributosTipoLista(List<Atributos> _listaAttr)
        {
            return _servicoPedido.RetornaAtributosTipoLista(_listaAttr);
        }

        public List<GrupoTamanho> RetornaTamanhosAtivo(List<GrupoTamanho> _listaTamanho)
        {
            return _servicoPedido.RetornaTamanhosAtivo(_listaTamanho);
        }
    }
}
