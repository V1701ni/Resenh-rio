using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MeuProjeto.Data;
using MeuProjeto.Models;

namespace MeuProjeto.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsuariosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsuariosController(AppDbContext context)
        {
            _context = context;
        }

        // POST: api/Usuarios
        [HttpPost]
        public async Task<ActionResult> PostUsuario(UsuarioAuth dados)
        {
            if (string.IsNullOrWhiteSpace(dados.Nome) ||
                string.IsNullOrWhiteSpace(dados.Email) ||
                string.IsNullOrWhiteSpace(dados.Senha))
            {
                return BadRequest("Nome, e-mail e senha são obrigatórios.");
            }

            var nome = dados.Nome.Trim();
            var email = dados.Email.Trim();

            var emailExiste = await _context.Usuarios
                .AnyAsync(u => u.Email == email);

            if (emailExiste)
            {
                return Conflict("Já existe um usuário com este e-mail.");
            }

            var usuario = new Usuario
            {
                Nome = nome,
                Email = email,
                SenhaHash = BCrypt.Net.BCrypt.HashPassword(dados.Senha)
            };

            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetUsuario),
                new { id = usuario.IdUsuario },
                new
                {
                    usuario.IdUsuario,
                    usuario.Nome,
                    usuario.Email,
                    usuario.DataCadastro
                });
        }

        // POST: api/Usuarios/login
        [HttpPost("login")]
        public async Task<ActionResult> Login(UsuarioAuth dados)
        {
            if (string.IsNullOrWhiteSpace(dados.Email) ||
                string.IsNullOrEmpty(dados.Senha))
            {
                return Unauthorized("E-mail ou senha inválidos.");
            }

            var email = dados.Email.Trim();

            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Email == email);

            if (usuario == null ||
                !BCrypt.Net.BCrypt.Verify(dados.Senha, usuario.SenhaHash))
            {
                return Unauthorized("E-mail ou senha inválidos.");
            }

            return Ok(new
            {
                usuario.IdUsuario,
                usuario.Nome,
                usuario.Email
            });
        }

        // GET: api/Usuarios/5
        [HttpGet("{id}")]
        public async Task<ActionResult> GetUsuario(int id)
        {
            var usuario = await _context.Usuarios.FindAsync(id);

            if (usuario == null)
            {
                return NotFound("Usuário não encontrado.");
            }

            return Ok(new
            {
                usuario.IdUsuario,
                usuario.Nome,
                usuario.Email,
                usuario.DataCadastro
            });
        }

        // DELETE: api/Usuarios/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUsuario(int id)
        {
            var usuario = await _context.Usuarios.FindAsync(id);

            if (usuario == null)
            {
                return NotFound("Usuário não encontrado para exclusão.");
            }

            _context.Usuarios.Remove(usuario);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}