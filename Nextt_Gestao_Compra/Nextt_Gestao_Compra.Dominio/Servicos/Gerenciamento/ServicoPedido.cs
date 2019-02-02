using Nextt_Gestao_Compra.Dominio.Entidades;
using Nextt_Gestao_Compra.Dominio.Interfaces.Repositorio.Gerenciamento;
using Nextt_Gestao_Compra.Dominio.Interfaces.Servico.Gerenciamento;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Nextt_Gestao_Compra.Dominio.Servicos.Gerenciamento
{
    public class ServicoPedido : ServicoPadrao<Parametros>, IServicoPedido
    {
        private readonly IRepositorioPedido _pedidoRepositorio;
        public ServicoPedido(IRepositorioPedido pedidoRepositorio) : base(pedidoRepositorio)
        {
            _pedidoRepositorio = pedidoRepositorio;
        }
        public List<IEnumerable> CarregaFiltrosPesquisaPedido()
        {
            return _pedidoRepositorio.CarregaFiltrosPesquisaPedido();
        }

        public List<IEnumerable> PesquisaPedidos(Parametros parametros)
        {
            return _pedidoRepositorio.PesquisaPedidos(parametros);
        }

        public List<IEnumerable> RetornaPedidoAnalitico(Parametros parametros)
        {
            return _pedidoRepositorio.RetornaPedidoAnalitico(parametros);
        }

        public List<IEnumerable> RetornaPedidoSintetico(Parametros parametros)
        {
            return _pedidoRepositorio.RetornaPedidoSintetico(parametros);
        }
        public List<string> RetornaDescricaoCor(List<Cor> _listaCores)
        {
            return _listaCores.OrderBy(x => x.Descricao).Where(x => x.CorRGB.Split('/').Count() < 2 && x.VisivelSelecao == true).Select(x => x.Descricao).ToList();
        }
        public List<Cor> RetornaCoresPrincipais(List<Cor> _listaCores)
        {
            return _listaCores.OrderBy(x => x.Descricao).ToList();
        }
        public List<TipoLista> RetornaAtributosTipoLista(List<Atributo> _listaAttr)
        {
            var listasRetorno = _listaAttr.Where(x => x.Lista == true && x.Ativo == true)
                .Select(x => new TipoLista(x))
                .ToList()
                .Select(x => x.CarregaOpcoesLista(_listaAttr.OrderBy(y => y.Ordem)
                                                    .Where(y => y.IDTipoAtributoKey == x.IDTipoAtributo &&
                                                        y.Ativo == true && y.IDTipoAtributo != x.IDTipoAtributo).ToList()))
                .ToList();
            return listasRetorno;
        }

        public List<Atributo> RetornaAtributosCampos(List<Atributo> _listaAttr)
        {
            return _listaAttr.Where(x => x.Lista == false && x.Ativo == true && x.IDTipoAtributo == x.IDTipoAtributoKey).ToList();
            //throw new System.NotImplementedException();
        }
        public List<string> RetornaCSSCor(List<Cor> _listaCores)
        {
            return _listaCores.OrderBy(x => x.Descricao).Where(x => x.CorRGB.Split('/').Count() < 2 && x.VisivelSelecao == true).Select(x => "rgb(" + x.CorRGB + ")").ToList();
        }

        public void AtualizaStatusPedido(Parametros parametros)
        {
           _pedidoRepositorio.AtualizaStatusPedido(parametros);
        }

        public List<IEnumerable> ClonarPedido(Parametros parametros)
        {
            return _pedidoRepositorio.ClonarPedido(parametros);
        }

        public List<GrupoTamanho> RetornaTamanhosAtivo(List<GrupoTamanho> _listaTamanho)
        {
            return _listaTamanho.OrderBy(x => x.Ordem).ToList();//.Where(x => x.Ativo == true).ToList();
        }
    }
}
