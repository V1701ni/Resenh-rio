namespace MeuProjeto.Models;

public class Livro
{
    public int IdLivros { get; set; }
    public string? GoogleBId { get; set; }
    public string Titulo { get; set; } = string.Empty;
    public string Autor { get; set; } = string.Empty;
    public string? Sinopse { get; set; }
    public string? Isbn { get; set; }
    public string? CapaUrl { get; set; }

    // Relacionamentos
    public ICollection<Adaptacao> Adaptacoes { get; set; } = new List<Adaptacao>();
    public ICollection<Estante> Estantes { get; set; } = new List<Estante>();
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
}