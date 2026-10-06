using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using MeuProjeto.Data;

var builder = WebApplication.CreateBuilder(args);

// 1. Configura a política de CORS para permitir acessos do front-end
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// 2. Adiciona suporte a Controllers e Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Resenhario API",
        Version = "v1"
    });
});

// 3. Configuração da conexão com o MySQL
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(connectionString, new MySqlServerVersion(new Version(8, 0, 30))));

var app = builder.Build();

// 4. Ativa a política de CORS no pipeline
app.UseCors("AllowAll");

// 5. Ativa o Swagger no ambiente de desenvolvimento
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "Resenhario API v1");
    });
}

app.UseHttpsRedirection();
app.UseAuthorization();

// 6. Mapeia os Controllers
app.MapControllers();

app.Run();