using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MeuProjeto.Data;
using MeuProjeto.Models;

namespace MeuProjeto.Controllers
{
    // Entrada: só o que o cliente pode enviar
    public class EstanteCreateDto
    {
        [Range(1, int.MaxValue, ErrorMessage = "Usuário inválido.")]
        public int IdUsuario { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "Livro inválido.")]
        public int IdLivros { get; set; }

        [Required(ErrorMessage = "Informe o status do livro.")]
        public string Status { get; set; } = string.Empty;
    }

    public class EstanteUpdateDto
    {
        [Required(ErrorMessage = "Informe o status do livro.")]
        public string Status { get; set; } = string.Empty;
    }

    // Saída
    public record EstanteLivroDto(
        int IdLivros,
        string Titulo,
        string Autor,
        string? Sinopse,
        string? Isbn,
        string? CapaUrl,
        string? GoogleBId);

    public record EstanteResponseDto(
        int IdEstante,
        int IdUsuario,
        int IdLivros,
        string Status,
        DateTime DataAtualizacao,
        EstanteLivroDto Livro);

    [ApiController]
    [Route("api/[controller]")]
    public class EstanteController : ControllerBase
    {
        private static readonly string[] StatusValidos =
        {
            "Quero Ler",
            "Lendo",
            "Lido",
            "Abandonado"
        };

        private readonly AppDbContext _context;

        public EstanteController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Estante/usuario/1
        [HttpGet("usuario/{idUsuario}")]
        public async Task<ActionResult<IEnumerable<EstanteResponseDto>>> GetEstanteUsuario(int idUsuario)
        {
            var query = _context.Estantes
                .AsNoTracking()
                .Where(e => e.IdUsuario == idUsuario)
                .OrderByDescending(e => e.DataAtualizacao);

            return Ok(await Projetar(query).ToListAsync());
        }

        // POST: api/Estante
        [HttpPost]
        public async Task<ActionResult<EstanteResponseDto>> AdicionarLivro(EstanteCreateDto dados)
        {
            var status = NormalizarStatus(dados.Status);

            if (status == null)
            {
                return BadRequest(MensagemStatusInvalido());
            }

            var usuarioExiste = await _context.Usuarios
                .AnyAsync(u => u.IdUsuario == dados.IdUsuario);

            if (!usuarioExiste)
            {
                return NotFound("Usuário não encontrado.");
            }

            var livroExiste = await _context.Livros
                .AnyAsync(l => l.IdLivros == dados.IdLivros);

            if (!livroExiste)
            {
                return NotFound("Livro não encontrado.");
            }

            var jaExiste = await _context.Estantes
                .AnyAsync(e =>
                    e.IdUsuario == dados.IdUsuario &&
                    e.IdLivros == dados.IdLivros);

            if (jaExiste)
            {
                return Conflict("Este livro já está na estante do usuário.");
            }

            var estante = new Estante
            {
                IdUsuario = dados.IdUsuario,
                IdLivros = dados.IdLivros,
                Status = status,
                DataAtualizacao = DateTime.UtcNow
            };

            _context.Estantes.Add(estante);
            await _context.SaveChangesAsync();

            var query = _context.Estantes
                .AsNoTracking()
                .Where(e => e.IdEstante == estante.IdEstante);

            var criada = await Projetar(query).FirstAsync();

            return CreatedAtAction(
                nameof(GetEstanteUsuario),
                new { idUsuario = estante.IdUsuario },
                criada);
        }

        // PUT: api/Estante/5
        [HttpPut("{id}")]
        public async Task<IActionResult> AtualizarEstante(int id, EstanteUpdateDto dados)
        {
            var status = NormalizarStatus(dados.Status);

            if (status == null)
            {
                return BadRequest(MensagemStatusInvalido());
            }

            var estante = await _context.Estantes.FindAsync(id);

            if (estante == null)
            {
                return NotFound("Item da estante não encontrado.");
            }

            estante.Status = status;
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
                return NotFound("Item da estante não encontrado.");
            }

            _context.Estantes.Remove(estante);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Aceita "lido", "LIDO" ou " Lido " e devolve o valor padrão ("Lido")
        private static string? NormalizarStatus(string? status)
        {
            var limpo = status?.Trim();

            return StatusValidos.FirstOrDefault(s =>
                s.Equals(limpo, StringComparison.OrdinalIgnoreCase));
        }

        private static string MensagemStatusInvalido()
        {
            return $"Status inválido. Use: {string.Join(", ", StatusValidos)}.";
        }

        private static IQueryable<EstanteResponseDto> Projetar(IQueryable<Estante> query)
        {
            return query.Select(e => new EstanteResponseDto(
                e.IdEstante,
                e.IdUsuario,
                e.IdLivros,
                e.Status,
                e.DataAtualizacao,
                new EstanteLivroDto(
                    e.Livro!.IdLivros,
                    e.Livro.Titulo,
                    e.Livro.Autor,
                    e.Livro.Sinopse,
                    e.Livro.Isbn,
                    e.Livro.CapaUrl,
                    e.Livro.GoogleBId)));
        }
    }
}