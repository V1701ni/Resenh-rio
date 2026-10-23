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
                return BadRequest("Nome, e-mail e senha s�o obrigat�rios.");
            }

            if (dados.Senha.Length < 6)
            {
                return BadRequest("A senha deve ter pelo menos 6 caracteres.");
            }

            var emailExiste = await _context.Usuarios
                .AnyAsync(u => u.Email == dados.Email);
            if (emailExiste)
            {
                return Conflict("J� existe um usu�rio com este e-mail.");
            }

            var usuario = new Usuario
            {
                Nome = dados.Nome.Trim(),
                Email = dados.Email.Trim(),
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
            if (string.IsNullOrWhiteSpace(dados.Email) || string.IsNullOrWhiteSpace(dados.Senha))
            {
                return BadRequest("E-mail e senha s�o obrigat�rios.");
            }

            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Email == dados.Email.Trim());

            if (usuario == null ||
                !BCrypt.Net.BCrypt.Verify(dados.Senha, usuario.SenhaHash))
            {
                return Unauthorized("E-mail ou senha inv�lidos.");
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
                return NotFound("Usu�rio n�o encontrado.");
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
                return NotFound("Usu�rio n�o encontrado para exclus�o.");
            }

            _context.Usuarios.Remove(usuario);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
