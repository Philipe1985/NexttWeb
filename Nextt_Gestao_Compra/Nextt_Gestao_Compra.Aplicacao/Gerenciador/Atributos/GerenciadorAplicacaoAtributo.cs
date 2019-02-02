using AutoMapper;
using Newtonsoft.Json;
using Nextt_Gestao_Compra.Aplicacao.Servicos.Interfaces.Gerenciamento;
using Nextt_Gestao_Compra.Aplicacao.Utils;
using Nextt_Gestao_Compra.Aplicacao.ViewModel;
using Nextt_Gestao_Compra.Dominio.Entidades;
using System.Collections.Generic;
using System.Linq;

namespace Nextt_Gestao_Compra.Aplicacao.Gerenciador.Atributos
{
    public class GerenciadorAplicacaoAtributo
    {
        public static List<AtributoCardVM> RetornaAtributosFiltrados(IAppServicoAtributo atributoServico, ParametrosJsonVM parametros)
        {
            var atributoJson = JsonConvert.SerializeObject(parametros);
            return atributoServico.BuscaAtributosSintetico(atributoJson)
                .ElementAt(0)
                .Cast<Atributo>()
                .OrderBy(x => x.Ordem)
                .Select(x => new AtributoCardVM(x))
                .ToList();
        }
        public static AtributoEditarVM RetornaAtributoEditar(IAppServicoAtributo atributoServico, AtributoJsonVM parametros, FabricaViewModel fabrica)
        {
            var jsonResolver = new PropertyRenameAndIgnoreSerializerContractResolver();
            var ignorarMain = new string[]{
                "Ordem",
                "TipoAtributoFilhos",
                "Tipo",
                "Ativo",
                "MultiplaSelecao",
                "Lista",
                "Obrigatorio",
                "Descricao",
                "Classe",
                "ValorMinimo",
                "ValorMaximo",
                "CasaDecimal",
                "ValorDefault",
                "TipoAtributoEspecies"
            };
            jsonResolver.RenameProperty(typeof(AtributoJsonVM), "TipoAtributo", "Parametros");
            jsonResolver.IgnoreProperty(typeof(AtributoSalvarVM), ignorarMain);
            var jsonSettings = new JsonSerializerSettings() { ReferenceLoopHandling = ReferenceLoopHandling.Ignore, ContractResolver = jsonResolver };
            var atributoJson = JsonConvert.SerializeObject(parametros, jsonSettings);

            var dados = atributoServico.BuscaAtributoEditar(atributoJson);
            
            var segmentosSecoesEspecies = dados.ElementAt(1)
                .Cast<TipoAtributoSecaoEspecie>()
                .ToList();
            return new AtributoEditarVM(dados.ElementAt(0).Cast<Atributo>().ToList(), segmentosSecoesEspecies, fabrica);
        }

        public static FiltrosPesquisa RetornaFiltroPesquisa(IAppServicoAtributo atributoServico, FabricaViewModel fabrica)
        {
            var dados = atributoServico.CarregaFiltrosPesquisa();
            var segmentos = dados.ElementAt(0)
                .Cast<Segmento>()
                .OrderBy(x => x.Descricao)
                .Select(x => fabrica.Criar(x))
                .ToList();
            var atributos = dados.ElementAt(1)
                .Cast<Atributo>()
                .Select(x => new AtributoElementoVM() { Descricao = x.Descricao, Ordem = x.Ordem })
                .ToList();
            
            return new FiltrosPesquisa
            {
                Segmentos = segmentos,
                AttrEleListaProd = atributos
            };
        }

        public static void SalvarAtributo(IAppServicoAtributo atributoServico, AtributoJsonVM atributo)
        {
            var atributoJson = JsonConvert.SerializeObject(atributo);
            atributoServico.SalvarAtributo(atributoJson);
        }
        public static void ExcluirAtributo(IAppServicoAtributo atributoServico, AtributoSalvarVM atributo)
        {
            var jsonResolver = new PropertyRenameAndIgnoreSerializerContractResolver();
            var ignorarMain = new string []{
                "Ordem",
                "IDTipoAtributo",
                "Tipo",
                "Ativo",
                "MultiplaSelecao",
                "Lista",
                "Obrigatorio",
                "Descricao",
                "Classe",
                "ValorMinimo",
                "ValorMaximo",
                "CasaDecimal",
                "ValorDefault",
                "TipoAtributoEspecies"
            };
            var ignorarChild = new string[]{
                "Ordem",
                "Ativo",
                "Descricao",
                "ValorDefault",
                "TipoAtributoEspecies"
            };
            jsonResolver.RenameProperty(typeof(AtributoSalvarVM), "TipoAtributoFilhos", "Parametros");
            jsonResolver.IgnoreProperty(typeof(AtributoSalvarVM), ignorarMain);
            jsonResolver.IgnoreProperty(typeof(AtributoListaItemVM), ignorarChild);
            var jsonSettings = new JsonSerializerSettings() { ReferenceLoopHandling = ReferenceLoopHandling.Ignore, ContractResolver = jsonResolver };
            var atributoJson = JsonConvert.SerializeObject(atributo, jsonSettings);
            atributoServico.ExluirAtributo(atributoJson);
        }
    }
}
