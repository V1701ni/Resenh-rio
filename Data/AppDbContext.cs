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

        modelBuilder.Entity<Usuario>().HasKey(u => u.IdUsuario);
        modelBuilder.Entity<Livro>().HasKey(l => l.IdLivros);
        modelBuilder.Entity<Filme>().HasKey(f => f.IdFilme);
        modelBuilder.Entity<Adaptacao>().HasKey(a => a.IdAdaptacoes);
        modelBuilder.Entity<Estante>().HasKey(e => e.IdEstante);
        modelBuilder.Entity<Review>().HasKey(r => r.IdReviews);

        modelBuilder.Entity<Adaptacao>()
            .HasOne(a => a.Livro)
            .WithMany(l => l.Adaptacoes)
            .HasForeignKey(a => a.IdLivro);

        modelBuilder.Entity<Adaptacao>()
            .HasOne(a => a.Filme)
            .WithMany(f => f.Adaptacoes)
            .HasForeignKey(a => a.IdFilme);

        modelBuilder.Entity<Estante>()
            .HasOne(e => e.Usuario)
            .WithMany(u => u.Estantes)
            .HasForeignKey(e => e.IdUsuario);

        modelBuilder.Entity<Estante>()
            .HasOne(e => e.Livro)
            .WithMany(l => l.Estantes)
            .HasForeignKey(e => e.IdLivros);

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

        var senhaPadrao = BCrypt.Net.BCrypt.HashPassword("123456");
        var dataBase = new DateTime(2026, 10, 1, 0, 0, 0, DateTimeKind.Utc);

        modelBuilder.Entity<Usuario>().HasData(
            new Usuario
            {
                IdUsuario = 1,
                Nome = "Ana Souza",
                Email = "ana@resenhario.com",
                SenhaHash = senhaPadrao,
                DataCadastro = dataBase
            }
        );

        modelBuilder.Entity<Livro>().HasData(
            new Livro
            {
                IdLivros = 1,
                Titulo = "O Pequeno Príncipe",
                Autor = "Antoine de Saint-Exupéry",
                Sinopse = "Uma fábula poética sobre amizade, infância e amor.",
                Isbn = "9788576570384",
                CapaUrl = "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
                GoogleBId = "pequeno-principe",
                DataCadastro = dataBase
            },
            new Livro
            {
                IdLivros = 2,
                Titulo = "Dom Casmurro",
                Autor = "Machado de Assis",
                Sinopse = "Uma obra clássica sobre ciúmes, amor e dúvida.",
                Isbn = "9788525409245",
                CapaUrl = "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=600&q=80",
                GoogleBId = "dom-casmurro",
                DataCadastro = dataBase
            }
        );

        modelBuilder.Entity<Filme>().HasData(
            new Filme
            {
                IdFilme = 1,
                TmdbId = 100,
                Titulo = "O Pequeno Príncipe",
                Diretor = "Mark Osborne",
                AnoLancamento = 2015,
                PosterUrl = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80",
                Sinopse = "Adaptação animada do clássico da literatura francesa."
            },
            new Filme
            {
                IdFilme = 2,
                TmdbId = 101,
                Titulo = "Dom Casmurro",
                Diretor = "Diretor não informado",
                AnoLancamento = 2024,
                PosterUrl = "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=600&q=80",
                Sinopse = "Adaptação contemporânea inspirada no romance de Machado de Assis."
            }
        );

        modelBuilder.Entity<Adaptacao>().HasData(
            new Adaptacao
            {
                IdAdaptacoes = 1,
                IdLivro = 1,
                IdFilme = 1,
                DataVinculo = dataBase
            },
            new Adaptacao
            {
                IdAdaptacoes = 2,
                IdLivro = 2,
                IdFilme = 2,
                DataVinculo = dataBase
            }
        );

        modelBuilder.Entity<Estante>().HasData(
            new Estante
            {
                IdEstante = 1,
                IdUsuario = 1,
                IdLivros = 1,
                Status = "Lendo",
                DataAtualizacao = dataBase
            },
            new Estante
            {
                IdEstante = 2,
                IdUsuario = 1,
                IdLivros = 2,
                Status = "Quero Ler",
                DataAtualizacao = dataBase
            }
        );

        modelBuilder.Entity<Review>().HasData(
            new Review
            {
                IdReviews = 1,
                IdUsuario = 1,
                IdLivro = 1,
                IdAdaptacao = 1,
                NotaLivro = 5,
                Comentario = "Uma leitura essencial para refletir sobre amizade e infância.",
                AssistiuFilme = true,
                Nota = 4,
                Voto = "Fiel",
                DataCriacao = dataBase
            }
        );
    }
}