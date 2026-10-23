using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MeuProjeto.Data;
using MeuProjeto.Models;
using MeuProjeto.Services;

namespace MeuProjeto.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LivrosController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ExternalApiService _externalApiService;

        public LivrosController(AppDbContext context, ExternalApiService externalApiService)
        {
            _context = context;
            _externalApiService = externalApiService;
        }

        // GET: api/Livros
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Livro>>> GetLivros()
        {
            return await _context.Livros
                .OrderByDescending(l => l.DataCadastro)
                .ToListAsync();
        }

        // GET: api/Livros/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Livro>> GetLivro(int id)
        {
            var livro = await _context.Livros.FindAsync(id);

            if (livro == null)
            {
                return NotFound("Livro não encontrado.");
            }

            return livro;
        }

        // GET: api/Livros/buscar
        [HttpGet("buscar")]
        public async Task<ActionResult<IEnumerable<Livro>>> BuscarLivros([FromQuery] string q)
        {
            if (string.IsNullOrWhiteSpace(q))
            {
                return Ok(new List<Livro>());
            }

            var local = await _context.Livros
                .Where(l => l.Titulo.Contains(q) || l.Autor.Contains(q))
                .Take(10)
                .ToListAsync();

            if (local.Count > 0)
            {
                return Ok(local);
            }

            var externos = await _externalApiService.SearchBooksAsync(q, 5);
            return Ok(externos);
        }

        // POST: api/Livros
        [HttpPost]
        public async Task<ActionResult<Livro>> PostLivro(Livro livro)
        {
            if (string.IsNullOrWhiteSpace(livro.Titulo))
            {
                return BadRequest("Título do livro é obrigatório.");
            }

            livro.DataCadastro = DateTime.UtcNow;
            _context.Livros.Add(livro);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetLivro), new { id = livro.IdLivros }, livro);
        }

        // DELETE: api/Livros/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLivro(int id)
        {
            var livro = await _context.Livros.FindAsync(id);
            if (livro == null)
            {
                return NotFound("Livro não encontrado para exclusão.");
            }

            _context.Livros.Remove(livro);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}