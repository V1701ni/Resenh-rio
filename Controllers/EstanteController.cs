using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MeuProjeto.Data;
using MeuProjeto.Models;

namespace MeuProjeto.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EstanteController : ControllerBase
    {
        private readonly AppDbContext _context;

        public EstanteController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Estante/usuario/1
[HttpGet("usuario/{idUsuario}")]
public async Task<ActionResult> GetEstanteUsuario(int idUsuario)
{
    var estante = await _context.Estantes
        .Where(e => e.IdUsuario == idUsuario)
        .Select(e => new
        {
            e.IdEstante,
            e.IdUsuario,
            e.IdLivros,
            e.Status,
            e.DataAtualizacao,
            Livro = new
            {
                e.Livro!.IdLivros,
                e.Livro.Titulo,
                e.Livro.Autor,
                e.Livro.Sinopse,
                e.Livro.Isbn,
                e.Livro.CapaUrl,
                e.Livro.GoogleBId
            }
        })
        .ToListAsync();

    return Ok(estante);
}

        // POST: api/Estante
        [HttpPost]
        public async Task<ActionResult> AdicionarLivro(Estante estante)
        {
            var usuarioExiste = await _context.Usuarios
                .AnyAsync(u => u.IdUsuario == estante.IdUsuario);

            if (!usuarioExiste)
            {
                return NotFound("Usu�rio n�o encontrado.");
            }

            var livroExiste = await _context.Livros
                .AnyAsync(l => l.IdLivros == estante.IdLivros);

            if (!livroExiste)
            {
                return NotFound("Livro n�o encontrado.");
            }

            var jaExiste = await _context.Estantes
                .AnyAsync(e =>
                    e.IdUsuario == estante.IdUsuario &&
                    e.IdLivros == estante.IdLivros);

            if (jaExiste)
            {
                return Conflict("Este livro j� est� na estante do usu�rio.");
            }

            estante.DataAtualizacao = DateTime.UtcNow;

            _context.Estantes.Add(estante);
            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetEstanteUsuario),
                new { idUsuario = estante.IdUsuario },
                estante);
        }

        // PUT: api/Estante/5
        [HttpPut("{id}")]
        public async Task<IActionResult> AtualizarEstante(int id, Estante dados)
        {
            var estante = await _context.Estantes.FindAsync(id);

            if (estante == null)
            {
                return NotFound("Item da estante n�o encontrado.");
            }

            estante.Status = dados.Status;
            estante.DataAtualizacao = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Estante/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> RemoverLivro(int id)
        {
            var estante = await _context.Estantes.FindAsync(id);

            if (estante == null)
            {
                return NotFound("Item da estante n�o encontrado.");
            }

            _context.Estantes.Remove(estante);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
