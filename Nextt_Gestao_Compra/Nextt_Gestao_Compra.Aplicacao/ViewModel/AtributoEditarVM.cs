using Nextt_Gestao_Compra.Dominio.Entidades;
using System.Collections.Generic;
using System.Linq;

namespace Nextt_Gestao_Compra.Aplicacao.ViewModel
{
    public class AtributoEditarVM
    {
        public int IDTipoAtributo { get; set; }
        public string Descricao { get; set; }
        public bool Lista { get; set; }
        public bool Modelo { get; set; }
        public bool Status { get; set; }
        public int Ordem { get; set; }
        public string Tipo { get; set; }
        public bool Multiplo { get; set; }
        public bool Obrigatorio { get; set; }
        public string ValorDef { get; set; }
        public int Maximo { get; set; }
        public int Minimo { get; set; }
        public int Precisao { get; set; }
        public List<AtributoEditarVM> ItensCadastrados { get; set; }
        public List<string> SecoesSelecionadas { get; set; }
        public List<string> SegmentosSelecionados { get; set; }
        public List<string> EspeciesSelecionadas { get; set; }
        public AtributoEditarVM(List<Atributo> atributos, List<TipoAtributoSecaoEspecie> segmentosSecoesEspecies, FabricaViewModel fabrica)
        {
            var atributo = atributos
                       .Where(x => x.IDTipoAtributo == x.IDTipoAtributoKey).FirstOrDefault();

            Modelo = atributo.Classe.ToLower() == "produto";
            SegmentosSelecionados = new List<string>();
            SecoesSelecionadas = new List<string>();
            EspeciesSelecionadas = new List<string>();
            if (Modelo)
            {
                var segmentos = segmentosSecoesEspecies.Where(x => x.IDTipoAtributo == atributo.IDTipoAtributo).ToList();
                foreach (var item in segmentos)
                {
                    SegmentosSelecionados.Add(item.IDSegmento + "-" + item.DescricaoSegmento.Trim());
                    SecoesSelecionadas.Add(item.IDSecao + "-" + item.DescricaoSecao.Trim());
                    if (item.IDEspecie != null)
                        EspeciesSelecionadas.Add(item.IDSecao + "-" + item.IDEspecie);
                }
            }

            Descricao = atributo.Descricao;
            IDTipoAtributo = atributo.IDTipoAtributo;

            Status = atributo.Ativo;
            Ordem = atributo.Ordem;
            Obrigatorio = atributo.Obrigatorio;
            Lista = atributo.Lista;
            Tipo = atributo.Tipo.ToString();
            if (atributos.Count > 1)
            {
                ValorDef = string.Join(",", atributos
                                     .Where(x => x.IDTipoAtributo != x.IDTipoAtributoKey && x.ValorDefault == "1")
                                     .Select(x => x.IDTipoAtributo).ToList());
                Multiplo = atributo.MultiplaSelecao;
                ItensCadastrados = atributos
                     .Where(x => x.IDTipoAtributo != x.IDTipoAtributoKey)
                     .OrderBy(x => x.Ordem)
                     .Select(x => new AtributoEditarVM(x, segmentosSecoesEspecies))
                     .ToList();
            }
            else
            {
                Maximo = atributo.ValorMaximo;
                Minimo = atributo.ValorMinimo;
                Precisao = atributo.CasaDecimal;
                ValorDef = atributo.ValorDefault;
            }
        }
        public AtributoEditarVM(Atributo atributo, List<TipoAtributoSecaoEspecie> segmentosSecoesEspecies)
        {
            Modelo = atributo.Classe.ToLower() == "produto";
            Descricao = atributo.Descricao;
            IDTipoAtributo = atributo.IDTipoAtributo;
            Status = atributo.Ativo;
            Ordem = atributo.Ordem;
            ValorDef = atributo.ValorDefault ?? "0";
            SegmentosSelecionados = new List<string>();
            SecoesSelecionadas = new List<string>();
            EspeciesSelecionadas = new List<string>();
            if (Modelo)
            {
                var segmentos = segmentosSecoesEspecies.Where(x => x.IDTipoAtributo == atributo.IDTipoAtributo).ToList();
                foreach (var item in segmentos)
                {
                    SegmentosSelecionados.Add(item.IDSegmento + "-" + item.DescricaoSegmento.Trim());
                    SecoesSelecionadas.Add(item.IDSecao + "-" + item.DescricaoSecao.Trim());
                    if (item.IDEspecie != null)
                        EspeciesSelecionadas.Add(item.IDSecao + "-" + item.IDEspecie);
                }
            }

        }
    }
}
