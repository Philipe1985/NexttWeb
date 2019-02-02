using Nextt_Gestao_Compra.Aplicacao.Servicos.Interfaces.Gerenciamento;
using Nextt_Gestao_Compra.Dominio.Entidades;
using Nextt_Gestao_Compra.Dominio.Interfaces.Servico.Gerenciamento;
using System.Collections;
using System.Collections.Generic;

namespace Nextt_Gestao_Compra.Aplicacao.Servicos.Gerenciamento
{
    public class AppServicoProduto : AppServicoPadrao<Parametros>, IAppServicoProduto
    {
        private readonly IServicoProduto _servicoProduto;
        public AppServicoProduto(IServicoProduto servicoProduto) : base(servicoProduto)
        {
            _servicoProduto = servicoProduto;
        }

        public int GravarProduto(string produtoJson)
        {
            return _servicoProduto.GravarProduto(produtoJson);
        }

        public List<Atributo> RetornaAtributosCampos(List<Atributo> _listaAttr)
        {
            return _servicoProduto.RetornaAtributosCampos(_listaAttr);
        }

        public List<TipoLista> RetornaAtributosTipoLista(List<Atributo> _listaAttr)
        {
            return _servicoProduto.RetornaAtributosTipoLista(_listaAttr);
        }

        public List<Cor> RetornaCoresPrincipais(List<Cor> _listaCores)
        {
            return _servicoProduto.RetornaCoresPrincipais(_listaCores);
        }

        public List<string> RetornaCSSCor(List<Cor> _listaCores)
        {
            return _servicoProduto.RetornaCSSCor(_listaCores);
        }

        public List<IEnumerable> RetornaDadosCadastroProduto(Parametros parametros)
        {
            return _servicoProduto.RetornaDadosCadastroProduto(parametros);
        }

        public List<IEnumerable> RetornaDadosProdutoEditar(Parametros parametros)
        {
            return _servicoProduto.RetornaDadosProdutoEditar(parametros);
        }

        public List<string> RetornaDescricaoCor(List<Cor> _listaCores)
        {
            return _servicoProduto.RetornaDescricaoCor(_listaCores);
        }

        public List<GrupoTamanho> RetornaTamanhosAtivo(List<GrupoTamanho> _listaTamanho)
        {
            return _servicoProduto.RetornaTamanhosAtivo(_listaTamanho);
        }
    }
}
