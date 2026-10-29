using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MeuProjeto.Data;
using MeuProjeto.Models;

namespace MeuProjeto.Controllers
{
    // Entrada: só os campos que o cliente pode enviar
    public class ReviewCreateDto
    {
        [Range(1, int.MaxValue, ErrorMessage = "Usuário inválido.")]
        public int IdUsuario { get; set; }

        public int? IdLivro { get; set; }

        public int? IdAdaptacao { get; set; }

        [Range(1, 5, ErrorMessage = "A nota do livro deve ser entre 1 e 5.")]
        public int? NotaLivro { get; set; }

        [Range(1, 5, ErrorMessage = "A nota deve ser entre 1 e 5.")]
        public int? Nota { get; set; }

        [StringLength(2000, ErrorMessage = "O comentário pode ter no máximo 2000 caracteres.")]
        public string? Comentario { get; set; }

        public bool AssistiuFilme { get; set; }

        public string? Voto { get; set; }
    }

    // Saída: sem SenhaHash, e-mail ou listas que causam referência circular
    public record ReviewUsuarioDto(int IdUsuario, string Nome);

    public record ReviewLivroDto(int IdLivros, string Titulo, string Autor, string? CapaUrl);

    public record ReviewResponseDto(
        int IdReviews,
        int IdUsuario,
        int? IdLivro,
        int? IdAdaptacao,
        int? NotaLivro,
        int? Nota,
        string? Comentario,
        bool AssistiuFilme,
        string? Voto,
        DateTime DataCriacao,
        ReviewUsuarioDto Usuario,
        ReviewLivroDto? Livro);

    [ApiController]
    [Route("api/[controller]")]
    public class ReviewsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ReviewsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Reviews
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ReviewResponseDto>>> GetReviews()
        {
            var query = _context.Reviews
                .AsNoTracking()
                .OrderByDescending(r => r.DataCriacao);

            return Ok(await Projetar(query).ToListAsync());
        }

        // GET: api/Reviews/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ReviewResponseDto>> GetReview(int id)
        {
            var query = _context.Reviews
                .AsNoTracking()
                .Where(r => r.IdReviews == id);

            var review = await Projetar(query).FirstOrDefaultAsync();

            if (review == null)
            {
                return NotFound("Review não encontrada.");
            }

            return Ok(review);
        }

        // POST: api/Reviews
        [HttpPost]
        public async Task<ActionResult<ReviewResponseDto>> PostReview(ReviewCreateDto dados)
        {
            if (dados.IdLivro == null && dados.IdAdaptacao == null)
            {
                return BadRequest("Informe o livro ou a adaptação avaliada.");
            }

            var usuarioExiste = await _context.Usuarios
                .AnyAsync(u => u.IdUsuario == dados.IdUsuario);

            if (!usuarioExiste)
            {
                return NotFound("Usuário não encontrado.");
            }

            if (dados.IdLivro != null)
            {
                var livroExiste = await _context.Livros
                    .AnyAsync(l => l.IdLivros == dados.IdLivro);

                if (!livroExiste)
                {
                    return NotFound("Livro não encontrado.");
                }
            }

            if (dados.IdAdaptacao != null)
            {
                var adaptacaoExiste = await _context.Adaptacoes
                    .AnyAsync(a => a.IdAdaptacoes == dados.IdAdaptacao);

                if (!adaptacaoExiste)
                {
                    return NotFound("Adaptação não encontrada.");
                }
            }

            var review = new Review
            {
                IdUsuario = dados.IdUsuario,
                IdLivro = dados.IdLivro,
                IdAdaptacao = dados.IdAdaptacao,
                NotaLivro = dados.NotaLivro,
                Nota = dados.Nota,
                Comentario = string.IsNullOrWhiteSpace(dados.Comentario)
                    ? null
                    : dados.Comentario.Trim(),
                AssistiuFilme = dados.AssistiuFilme,
                Voto = dados.Voto
            };

            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();

            var query = _context.Reviews
                .AsNoTracking()
                .Where(r => r.IdReviews == review.IdReviews);

            var criada = await Projetar(query).FirstAsync();

            return CreatedAtAction(nameof(GetReview), new { id = review.IdReviews }, criada);
        }

        private static IQueryable<ReviewResponseDto> Projetar(IQueryable<Review> query)
        {
            return query.Select(r => new ReviewResponseDto(
                r.IdReviews,
                r.IdUsuario,
                r.IdLivro,
                r.IdAdaptacao,
                r.NotaLivro,
                r.Nota,
                r.Comentario,
                r.AssistiuFilme,
                r.Voto,
                r.DataCriacao,
                new ReviewUsuarioDto(r.Usuario.IdUsuario, r.Usuario.Nome),
                r.Livro == null
                    ? null
                    : new ReviewLivroDto(
                        r.Livro.IdLivros,
                        r.Livro.Titulo,
                        r.Livro.Autor,
                        r.Livro.CapaUrl)));
        }
    }
}