﻿using Nextt_Gestao_Compra.Dominio.Entidades;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Nextt_Gestao_Compra.Dominio.Interfaces.Servico.Gerenciamento
{
    public interface IServicoPedido : IServicoPadrao<Parametros>
    {
        List<IEnumerable> CarregaFiltrosPesquisaPedido();
        List<IEnumerable> PesquisaPedidos(Parametros parametros);
        List<IEnumerable> RetornaPedidoSintetico(Parametros parametros);
        List<IEnumerable> RetornaPedidoAnalitico(Parametros parametros);
        List<IEnumerable> ClonarPedido(Parametros parametros);
        List<string> RetornaDescricaoCor(List<Cor> _listaCores);
        List<Cor> RetornaCoresPrincipais(List<Cor> _listaCores);
        List<string> RetornaCSSCor(List<Cor> _listaCores);
        void AtualizaStatusPedido(Parametros parametros);
        List<GrupoTamanho> RetornaTamanhosAtivo(List<GrupoTamanho> _listaTamanho);
        List<TipoLista> RetornaAtributosTipoLista(List<Atributo> _listaAttr);
        List<Atributo> RetornaAtributosCampos(List<Atributo> _listaAttr);

    }
}
