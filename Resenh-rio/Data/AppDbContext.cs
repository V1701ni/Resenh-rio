using Microsoft.EntityFrameworkCore;
using MeuProjeto.Models;

namespace MeuProjeto.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Usuario> Usuarios { get; set; }
    public DbSet<Livro> Livros { get; set; }
    public DbSet<Filme> Filmes { get; set; }
    public DbSet<Adaptacao> Adaptacoes { get; set; }
    public DbSet<Estante> Estantes { get; set; }
    public DbSet<Review> Reviews { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Chaves Primárias
        modelBuilder.Entity<Usuario>().HasKey(u => u.IdUsuario);
        modelBuilder.Entity<Livro>().HasKey(l => l.IdLivros);
        modelBuilder.Entity<Filme>().HasKey(f => f.IdFilme);
        modelBuilder.Entity<Adaptacao>().HasKey(a => a.IdAdaptacoes);
        modelBuilder.Entity<Estante>().HasKey(e => e.IdEstante);
        modelBuilder.Entity<Review>().HasKey(r => r.IdReviews);

        // Mapeamento Adaptacao -> Livro e Filme
        modelBuilder.Entity<Adaptacao>()
            .HasOne(a => a.Livro)
            .WithMany(l => l.Adaptacoes)
            .HasForeignKey(a => a.IdLivro);

        modelBuilder.Entity<Adaptacao>()
            .HasOne(a => a.Filme)
            .WithMany(f => f.Adaptacoes)
            .HasForeignKey(a => a.IdFilme);

        // Mapeamento Estante -> Usuario e Livro
        modelBuilder.Entity<Estante>()
            .HasOne(e => e.Usuario)
            .WithMany(u => u.Estantes)
            .HasForeignKey(e => e.IdUsuario);

        modelBuilder.Entity<Estante>()
            .HasOne(e => e.Livro)
            .WithMany(l => l.Estantes)
            .HasForeignKey(e => e.IdLivros);

        // Mapeamento Review -> Usuario, Livro e Adaptacao
        modelBuilder.Entity<Review>()
            .HasOne(r => r.Usuario)
            .WithMany(u => u.Reviews)
            .HasForeignKey(r => r.IdUsuario);

        modelBuilder.Entity<Review>()
            .HasOne(r => r.Livro)
            .WithMany(l => l.Reviews)
            .HasForeignKey(r => r.IdLivro)
            .IsRequired(false);

        modelBuilder.Entity<Review>()
            .HasOne(r => r.Adaptacao)
            .WithMany(a => a.Reviews)
            .HasForeignKey(r => r.IdAdaptacao)
            .IsRequired(false);
    }
}