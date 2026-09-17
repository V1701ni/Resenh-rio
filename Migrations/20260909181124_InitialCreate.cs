using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Resenhario.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Filmes",
                columns: table => new
                {
                    IdFilme = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    TmdbId = table.Column<int>(type: "int", nullable: true),
                    Titulo = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Diretor = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    AnoLancamento = table.Column<int>(type: "int", nullable: true),
                    PosterUrl = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Filmes", x => x.IdFilme);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Livros",
                columns: table => new
                {
                    IdLivros = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    GoogleBId = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Titulo = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Autor = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Sinopse = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Isbn = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CapaUrl = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Livros", x => x.IdLivros);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Usuarios",
                columns: table => new
                {
                    IdUsuario = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Nome = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Email = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    SenhaHash = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    DataCadastro = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Usuarios", x => x.IdUsuario);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Adaptacoes",
                columns: table => new
                {
                    IdAdaptacoes = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    IdLivro = table.Column<int>(type: "int", nullable: false),
                    IdFilme = table.Column<int>(type: "int", nullable: false),
                    DataVinculo = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Adaptacoes", x => x.IdAdaptacoes);
                    table.ForeignKey(
                        name: "FK_Adaptacoes_Filmes_IdFilme",
                        column: x => x.IdFilme,
                        principalTable: "Filmes",
                        principalColumn: "IdFilme",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Adaptacoes_Livros_IdLivro",
                        column: x => x.IdLivro,
                        principalTable: "Livros",
                        principalColumn: "IdLivros",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Estantes",
                columns: table => new
                {
                    IdEstante = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    IdUsuario = table.Column<int>(type: "int", nullable: false),
                    IdLivros = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    DataAtualizacao = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Estantes", x => x.IdEstante);
                    table.ForeignKey(
                        name: "FK_Estantes_Livros_IdLivros",
                        column: x => x.IdLivros,
                        principalTable: "Livros",
                        principalColumn: "IdLivros",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Estantes_Usuarios_IdUsuario",
                        column: x => x.IdUsuario,
                        principalTable: "Usuarios",
                        principalColumn: "IdUsuario",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Reviews",
                columns: table => new
                {
                    IdReviews = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    IdUsuario = table.Column<int>(type: "int", nullable: false),
                    IdLivro = table.Column<int>(type: "int", nullable: true),
                    IdAdaptacao = table.Column<int>(type: "int", nullable: true),
                    NotaLivro = table.Column<int>(type: "int", nullable: true),
                    Comentario = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    AssistiuFilme = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    Nota = table.Column<int>(type: "int", nullable: true),
                    Voto = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    DataCriacao = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Reviews", x => x.IdReviews);
                    table.ForeignKey(
                        name: "FK_Reviews_Adaptacoes_IdAdaptacao",
                        column: x => x.IdAdaptacao,
                        principalTable: "Adaptacoes",
                        principalColumn: "IdAdaptacoes");
                    table.ForeignKey(
                        name: "FK_Reviews_Livros_IdLivro",
                        column: x => x.IdLivro,
                        principalTable: "Livros",
                        principalColumn: "IdLivros");
                    table.ForeignKey(
                        name: "FK_Reviews_Usuarios_IdUsuario",
                        column: x => x.IdUsuario,
                        principalTable: "Usuarios",
                        principalColumn: "IdUsuario",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_Adaptacoes_IdFilme",
                table: "Adaptacoes",
                column: "IdFilme");

            migrationBuilder.CreateIndex(
                name: "IX_Adaptacoes_IdLivro",
                table: "Adaptacoes",
                column: "IdLivro");

            migrationBuilder.CreateIndex(
                name: "IX_Estantes_IdLivros",
                table: "Estantes",
                column: "IdLivros");

            migrationBuilder.CreateIndex(
                name: "IX_Estantes_IdUsuario",
                table: "Estantes",
                column: "IdUsuario");

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_IdAdaptacao",
                table: "Reviews",
                column: "IdAdaptacao");

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_IdLivro",
                table: "Reviews",
                column: "IdLivro");

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_IdUsuario",
                table: "Reviews",
                column: "IdUsuario");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Estantes");

            migrationBuilder.DropTable(
                name: "Reviews");

            migrationBuilder.DropTable(
                name: "Adaptacoes");

            migrationBuilder.DropTable(
                name: "Usuarios");

            migrationBuilder.DropTable(
                name: "Filmes");

            migrationBuilder.DropTable(
                name: "Livros");
        }
    }
}
