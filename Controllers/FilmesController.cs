using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MeuProjeto.Data;
using MeuProjeto.Models;
using MeuProjeto.Services;

namespace MeuProjeto.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FilmesController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ExternalApiService _externalApiService;

        public FilmesController(AppDbContext context, ExternalApiService externalApiService)
        {
            _context = context;
            _externalApiService = externalApiService;
        }

        // GET: api/Filmes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Filme>>> GetFilmes()
        {
            return await _context.Filmes
                .OrderByDescending(f => f.AnoLancamento)
                .ToListAsync();
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

        // GET: api/Filmes/buscar
        [HttpGet("buscar")]
        public async Task<ActionResult<IEnumerable<Filme>>> BuscarFilmes([FromQuery] string q)
        {
            if (string.IsNullOrWhiteSpace(q))
            {
                return Ok(new List<Filme>());
            }

            var local = await _context.Filmes
                .Where(f => f.Titulo.Contains(q) || (f.Diretor != null && f.Diretor.Contains(q)))
                .Take(10)
                .ToListAsync();

            if (local.Count > 0)
            {
                return Ok(local);
            }

            var externos = await _externalApiService.SearchMoviesAsync(q, 5);
            return Ok(externos);
        }

        // POST: api/Filmes
        [HttpPost]
        public async Task<ActionResult<Filme>> PostFilme(Filme filme)
        {
            if (string.IsNullOrWhiteSpace(filme.Titulo))
            {
                return BadRequest("Título do filme é obrigatório.");
            }

            _context.Filmes.Add(filme);
            await _context.SaveChangesAsync();

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