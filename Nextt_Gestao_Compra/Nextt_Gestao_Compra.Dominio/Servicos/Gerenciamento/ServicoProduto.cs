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
    public class ServicoProduto : ServicoPadrao<Parametros>, IServicoProduto
    {
        private readonly IRepositorioProduto _produtoRepositorio;

        public ServicoProduto(IRepositorioProduto produtoRepositorio) : base(produtoRepositorio)
        {
            _produtoRepositorio = produtoRepositorio;
        }
        public List<IEnumerable> RetornaDadosCadastroProduto(Parametros parametros)
        {
            return _produtoRepositorio.RetornaDadosCadastroProduto(parametros);
        }

        public List<IEnumerable> RetornaDadosProdutoEditar(Parametros parametros)
        {
            return _produtoRepositorio.RetornaDadosProdutoEditar(parametros);
        }
        public List<TipoLista> RetornaAtributosTipoLista(List<Atributos> _listaAttr)
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

        public List<Atributos> RetornaAtributosCampos(List<Atributos> _listaAttr)
        {
            return _listaAttr.Where(x => x.Lista == false && x.Ativo == true && x.IDTipoAtributo == x.IDTipoAtributoKey).ToList();
            //throw new System.NotImplementedException();
        }
        public List<GrupoTamanho> RetornaTamanhosAtivo(List<GrupoTamanho> _listaTamanho)
        {
            return _listaTamanho.OrderBy(x => x.Ordem).Where(x => x.Ativo == true).ToList();
        }
        public List<string> RetornaDescricaoCor(List<Cor> _listaCores)
        {
            return _listaCores.OrderBy(x => x.Descricao).Where(x => x.CorRGB.Split('/').Count() < 2 && x.VisivelSelecao == true).Select(x => x.Descricao).ToList();
        }
        public List<Cor> RetornaCoresPrincipais(List<Cor> _listaCores)
        {
            return _listaCores.OrderBy(x => x.Descricao).ToList();
        }

        public List<string> RetornaCSSCor(List<Cor> _listaCores)
        {
            return _listaCores.OrderBy(x => x.Descricao).Where(x => x.CorRGB.Split('/').Count() < 2 && x.VisivelSelecao == true).Select(x => "rgb(" + x.CorRGB + ")").ToList();
        }

        public int GravarProduto(string produtoJson)
        {
          return  _produtoRepositorio.GravarProduto(produtoJson);
        }
    }
}
