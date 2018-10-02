namespace Nextt_SPED_Fiscal.Aplicacao.ViewModels
{
    public class SegmentoSecaoEspecieVM
    {
        public short IDSegmento { get; set; }

        public short IDSecao { get; set; }

        public short IDEspecie { get; set; }

        public string DescricaoSegmento { get; set; }

        public string DescricaoSecao { get; set; }

        public string DescricaoEspecie { get; set; }

        public bool Ativo { get; set; }
    }
}
