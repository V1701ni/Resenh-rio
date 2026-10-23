using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Sqlite;
using Microsoft.OpenApi.Models;
using MeuProjeto.Data;
using MeuProjeto.Services;
using Pomelo.EntityFrameworkCore.MySql.Infrastructure;

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
builder.Services.AddHttpClient<ExternalApiService>();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=resenhario.db";
var useSqlite = connectionString.Contains("Data Source=", StringComparison.OrdinalIgnoreCase)
    || connectionString.Contains("DataSource=", StringComparison.OrdinalIgnoreCase)
    || string.IsNullOrWhiteSpace(connectionString);

builder.Services.AddDbContext<AppDbContext>(options =>
{
    if (useSqlite)
    {
        var sqliteConnection = connectionString;
        if (!sqliteConnection.Contains("Data Source=", StringComparison.OrdinalIgnoreCase) &&
            !sqliteConnection.Contains("DataSource=", StringComparison.OrdinalIgnoreCase))
        {
            sqliteConnection = $"Data Source={sqliteConnection}";
        }

        options.UseSqlite(sqliteConnection);
    }
    else
    {
        options.UseMySql(connectionString, new MySqlServerVersion(new Version(8, 0, 30)));
    }
});

var app = builder.Build();

// 4. Garante que o banco de dados foi criado
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}

// 5. Ativa a política de CORS no pipeline
app.UseCors("AllowAll");

// 6. Ativa o Swagger no ambiente de desenvolvimento
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

// 7. Mapeia os Controllers
app.MapControllers();

app.Run();