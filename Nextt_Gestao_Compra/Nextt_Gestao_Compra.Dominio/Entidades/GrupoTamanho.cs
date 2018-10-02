using System;

namespace Nextt_Gestao_Compra.Dominio.Entidades
{
    public class GrupoTamanho
    {
        public Int16 IDTamanho { get; set; }
        //public Int16 IDGrupoTamanho { get; set; }
        public string Descricao { get; set; }
        //public string DescricaoTamanho { get; set; }
        //public string DescricaoGrupo { get; set; }
        public bool Ativo { get; set; }
        public Int16 Ordem { get; set; }
    }
}
