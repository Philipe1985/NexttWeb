using System;

namespace Nextt_Gestao_Compra.Dominio.Entidades
{
    public class GrupoFilial
    {
        public Int16 IDGrupo { get; set; }
        public Int16 IDGrupoFilial { get; set; }
        public Int16 IDFilial { get; set; }
        public string NomeFilial { get; set; }
        public string Filial_Nome { get; set; }
        public decimal ParticipacaoVendas { get; set; }
        public string DescricaoGrupo { get; set; }
        public string Descricao { get; set; }
        public decimal ParticipacaoGrupo { get; set; }
        public decimal ParticipacaoCobertura { get; set; }
        public decimal VlrMedio { get; set; }
        public int QtdeCarteira { get; set; }
        public int QtdeEstoque { get; set; }
        public int QtdeItensDistribuido { get; set; }
        public int QtdeVenda { get; set; }
        public bool Ativo { get; set; }
        public Byte Pack { get; set; }
    }
}
