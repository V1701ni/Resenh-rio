namespace MeuProjeto.Models;

public class Usuario
{
    public int IdUsuario { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string SenhaHash { get; set; } = string.Empty;
    public DateTime DataCadastro { get; set; } = DateTime.UtcNow;

    // Relacionamentos
    public ICollection<Estante> Estantes { get; set; } = new List<Estante>();
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
}