using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MeuProjeto.Data;
using MeuProjeto.Models;

namespace MeuProjeto.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LivrosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public LivrosController(AppDbContext context)
        {
            _context = context;
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

        // POST: api/Livros
        [HttpPost]
        public async Task<ActionResult<Livro>> PostLivro(Livro livro)
        {
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