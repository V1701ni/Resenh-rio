
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
        private readonly GoogleBooksService _googleBooksService;

        public LivrosController(
            AppDbContext context,
            GoogleBooksService googleBooksService)
        {
            _context = context;
            _googleBooksService = googleBooksService;
        }

        // GET: api/Livros
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Livro>>> GetLivros()
        {
            return await _context.Livros.ToListAsync();
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

        // GET: api/Livros/buscar?termo=Harry%20Potter
        [HttpGet("buscar")]
        public async Task<IActionResult> BuscarLivros(
            [FromQuery] string termo)
        {
            if (string.IsNullOrWhiteSpace(termo))
            {
                return BadRequest("Informe um termo para buscar.");
            }

            try
            {
                var resultados =
                    await _googleBooksService.BuscarLivrosAsync(termo);

                return Ok(resultados);
            }
            catch (HttpRequestException ex)
            {
                return StatusCode(502, new
                {
                    erro = "Falha ao consultar o Google Books.",
                    detalhe = ex.Message
                });
            }
            catch (TaskCanceledException)
            {
                return StatusCode(
                    504,
                    "A consulta ao Google Books demorou demais para responder."
                );
            }
        }

        // POST: api/Livros
        [HttpPost]
        public async Task<ActionResult<Livro>> PostLivro(Livro livro)
        {
            _context.Livros.Add(livro);
            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetLivro),
                new { id = livro.IdLivros },
                livro
            );
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
