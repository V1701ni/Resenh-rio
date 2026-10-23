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

        [HttpGet("usuario/{idUsuario}")]
        public async Task<ActionResult> GetEstanteUsuario(int idUsuario)
        {
            var estante = await _context.Estantes
                .Where(e => e.IdUsuario == idUsuario)
                .Include(e => e.Livro)
                .OrderByDescending(e => e.DataAtualizacao)
                .Select(e => new
                {
                    e.IdEstante,
                    e.IdUsuario,
                    e.IdLivros,
                    e.Status,
                    e.DataAtualizacao,
                    Livro = e.Livro == null ? null : new
                    {
                        e.Livro.IdLivros,
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

        [HttpPost]
        public async Task<ActionResult> AdicionarLivro(Estante estante)
        {
            if (estante.IdUsuario <= 0)
            {
                return BadRequest("Id do usuário inválido.");
            }

            if (estante.IdLivros <= 0)
            {
                return BadRequest("Id do livro inválido.");
            }

            var usuarioExiste = await _context.Usuarios.AnyAsync(u => u.IdUsuario == estante.IdUsuario);
            if (!usuarioExiste)
            {
                return NotFound("Usuário não encontrado.");
            }

            var livroExiste = await _context.Livros.AnyAsync(l => l.IdLivros == estante.IdLivros);
            if (!livroExiste)
            {
                return NotFound("Livro não encontrado.");
            }

            var jaExiste = await _context.Estantes.AnyAsync(e => e.IdUsuario == estante.IdUsuario && e.IdLivros == estante.IdLivros);
            if (jaExiste)
            {
                return Conflict("Este livro já está na estante do usuário.");
            }

            var statusValido = new[] { "Quero Ler", "Lendo", "Lido", "Abandonado" };
            if (!string.IsNullOrWhiteSpace(estante.Status) && !statusValido.Contains(estante.Status))
            {
                return BadRequest("Status inválido. Use: Quero Ler, Lendo, Lido ou Abandonado.");
            }

            estante.Status = string.IsNullOrWhiteSpace(estante.Status) ? "Quero Ler" : estante.Status;
            estante.DataAtualizacao = DateTime.UtcNow;

            _context.Estantes.Add(estante);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetEstanteUsuario), new { idUsuario = estante.IdUsuario }, estante);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> AtualizarEstante(int id, Estante dados)
        {
            var estante = await _context.Estantes.FindAsync(id);

            if (estante == null)
            {
                return NotFound("Item da estante não encontrado.");
            }

            var statusValido = new[] { "Quero Ler", "Lendo", "Lido", "Abandonado" };
            if (!string.IsNullOrWhiteSpace(dados.Status) && !statusValido.Contains(dados.Status))
            {
                return BadRequest("Status inválido. Use: Quero Ler, Lendo, Lido ou Abandonado.");
            }

            estante.Status = string.IsNullOrWhiteSpace(dados.Status) ? estante.Status : dados.Status;
            estante.DataAtualizacao = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> RemoverLivro(int id)
        {
            var estante = await _context.Estantes.FindAsync(id);

            if (estante == null)
            {
                return NotFound("Item da estante não encontrado.");
            }

            _context.Estantes.Remove(estante);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
