namespace MeuProjeto.Models;

public class Estante
{
    public int IdEstante { get; set; }
    public int IdUsuario { get; set; }
    public int IdLivros { get; set; }
    public string Status { get; set; } = string.Empty; // ex: Lendo, Lido, Quero Ler
    public DateTime DataAtualizacao { get; set; } = DateTime.UtcNow;

    // Propriedades de Navegação
    public Usuario Usuario { get; set; } = null!;
    public Livro Livro { get; set; } = null!;
}