namespace Nextt_Gestao_Compra.Dominio.Entidades
{
    public class Marca
    {
        public int IDMarca { get; set; }
        public string Nome { get; set; }
        public bool Ativo { get; set; }
        public bool Associada { get; set; }
        public string GrupoEmpresa { get; set; }
    }
}
