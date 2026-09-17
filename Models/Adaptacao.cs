namespace MeuProjeto.Models;

public class Adaptacao
{
    public int IdAdaptacoes { get; set; }
    public int IdLivro { get; set; }
    public int IdFilme { get; set; }
    public DateTime DataVinculo { get; set; } = DateTime.UtcNow;

    // Propriedades de Navegação
    public Livro Livro { get; set; } = null!;
    public Filme Filme { get; set; } = null!;
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
}