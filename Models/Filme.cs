namespace MeuProjeto.Models;

public class Filme
{
    public int IdFilme { get; set; }
    public int? TmdbId { get; set; }
    public string Titulo { get; set; } = string.Empty;
    public string? Diretor { get; set; }
    public int? AnoLancamento { get; set; }
    public string? PosterUrl { get; set; }
    public string? Sinopse { get; set; }

    // Relacionamentos
    public ICollection<Adaptacao> Adaptacoes { get; set; } = new List<Adaptacao>();
}