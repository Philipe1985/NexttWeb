using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;

namespace Nextt_Gestao_Compra.Infra.Dados.Contexto
{
    public class GestaoCompraContexto : DbContext
    {
        public GestaoCompraContexto() : base("NexttGestaoCompras")
        {
            Database.SetInitializer<GestaoCompraContexto>(null);
        }
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
            modelBuilder.Conventions.Remove<OneToManyCascadeDeleteConvention>();
            modelBuilder.Conventions.Remove<ManyToManyCascadeDeleteConvention>();

            modelBuilder.Properties()
                .Where(p => p.Name == "Id" + p.ReflectedType.Name || p.Name == p.ReflectedType.Name + "Id")
                .Configure(p => p.IsKey());

            modelBuilder.Properties<string>().Configure(p => p.HasColumnType("varchar"));
            modelBuilder.Properties<string>().Configure(p => p.HasMaxLength(100));


            base.OnModelCreating(modelBuilder);
        }
    }
}

