namespace MeuProjeto.Models;

public class Review
{
    public int IdReviews { get; set; }
    public int IdUsuario { get; set; }
    public int? IdLivro { get; set; }
    public int? IdAdaptacao { get; set; }
    public int? NotaLivro { get; set; }
    public string? Comentario { get; set; }
    public bool AssistiuFilme { get; set; }
    public int? Nota { get; set; }
    public string? Voto { get; set; }
    public DateTime DataCriacao { get; set; } = DateTime.UtcNow;

    // Propriedades de Navegação
    public Usuario Usuario { get; set; } = null!;
    public Livro? Livro { get; set; }
    public Adaptacao? Adaptacao { get; set; }
}