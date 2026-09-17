using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MeuProjeto.Data;
using MeuProjeto.Models;

namespace MeuProjeto.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FilmesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public FilmesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Filmes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Filme>>> GetFilmes()
        {
            return await _context.Filmes.ToListAsync();
        }

        // GET: api/Filmes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Filme>> GetFilme(int id)
        {
            var filme = await _context.Filmes.FindAsync(id);

            if (filme == null)
            {
                return NotFound("Filme não encontrado.");
            }

            return filme;
        }

        // POST: api/Filmes
        [HttpPost]
        public async Task<ActionResult<Filme>> PostFilme(Filme filme)
        {
            _context.Filmes.Add(filme);
            await _context.SaveChangesAsync();

            // Lembre-se de conferir se no Filme.cs é Id ou IdFilme
            return CreatedAtAction(nameof(GetFilme), new { id = filme.IdFilme }, filme);
        }

        // DELETE: api/Filmes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFilme(int id)
        {
            var filme = await _context.Filmes.FindAsync(id);
            if (filme == null)
            {
                return NotFound("Filme não encontrado para exclusão.");
            }

            _context.Filmes.Remove(filme);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}