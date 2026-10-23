using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MeuProjeto.Data;
using MeuProjeto.Models;

namespace MeuProjeto.Controllers
{
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
        public async Task<ActionResult<IEnumerable<object>>> GetReviews()
        {
            var reviews = await _context.Reviews
                .Include(r => r.Usuario)
                .Include(r => r.Livro)
                .Include(r => r.Adaptacao)
                .ThenInclude(a => a!.Filme)
                .Select(r => new
                {
                    r.IdReviews,
                    r.IdUsuario,
                    r.IdLivro,
                    r.IdAdaptacao,
                    r.NotaLivro,
                    r.Comentario,
                    r.AssistiuFilme,
                    r.Nota,
                    r.Voto,
                    r.DataCriacao,
                    Usuario = new
                    {
                        r.Usuario.IdUsuario,
                        r.Usuario.Nome,
                        r.Usuario.Email
                    },
                    Livro = r.Livro == null ? null : new
                    {
                        r.Livro.IdLivros,
                        r.Livro.Titulo,
                        r.Livro.Autor,
                        r.Livro.CapaUrl,
                        r.Livro.Sinopse
                    },
                    Adaptacao = r.Adaptacao == null ? null : new
                    {
                        r.Adaptacao.IdAdaptacoes,
                        r.Adaptacao.IdLivro,
                        r.Adaptacao.IdFilme,
                        Filme = r.Adaptacao.Filme == null ? null : new
                        {
                            r.Adaptacao.Filme.IdFilme,
                            r.Adaptacao.Filme.Titulo,
                            r.Adaptacao.Filme.PosterUrl,
                            r.Adaptacao.Filme.Diretor
                        }
                    }
                })
                .OrderByDescending(r => r.DataCriacao)
                .ToListAsync();

            return Ok(reviews);
        }

        // POST: api/Reviews
        [HttpPost]
        public async Task<ActionResult<Review>> PostReview(Review review)
        {
            if (review.IdUsuario <= 0)
            {
                return BadRequest("Usuário obrigatório.");
            }

            if (review.NotaLivro is < 1 or > 5)
            {
                return BadRequest("A nota do livro deve estar entre 1 e 5.");
            }

            if (review.IdLivro is null && review.IdAdaptacao is null)
            {
                return BadRequest("A resenha precisa estar vinculada a um livro ou a uma adaptação.");
            }

            var usuarioExiste = await _context.Usuarios.AnyAsync(u => u.IdUsuario == review.IdUsuario);
            if (!usuarioExiste)
            {
                return NotFound("Usuário não encontrado.");
            }

            if (review.IdLivro != null)
            {
                var livroExiste = await _context.Livros.AnyAsync(l => l.IdLivros == review.IdLivro.Value);
                if (!livroExiste)
                {
                    return NotFound("Livro não encontrado.");
                }
            }

            if (review.IdAdaptacao != null)
            {
                var adaptacaoExiste = await _context.Adaptacoes.AnyAsync(a => a.IdAdaptacoes == review.IdAdaptacao.Value);
                if (!adaptacaoExiste)
                {
                    return NotFound("Adaptação não encontrada.");
                }
            }

            review.DataCriacao = DateTime.UtcNow;
            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetReviews), new { id = review.IdReviews }, review);
        }
    }
}