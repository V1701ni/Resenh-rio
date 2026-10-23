using System.Text.Json;
using MeuProjeto.Models;

namespace MeuProjeto.Services;

public sealed class ExternalApiService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;

    public ExternalApiService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _configuration = configuration;
    }

    public async Task<List<Livro>> SearchBooksAsync(string query, int limit = 5)
    {
        if (string.IsNullOrWhiteSpace(query))
        {
            return new List<Livro>();
        }

        var url = $"https://www.googleapis.com/books/v1/volumes?q={Uri.EscapeDataString(query)}&maxResults={Math.Clamp(limit, 1, 10)}";

        using var response = await _httpClient.GetAsync(url);
        if (!response.IsSuccessStatusCode)
        {
            return new List<Livro>();
        }

        var json = await response.Content.ReadAsStringAsync();
        using var document = JsonDocument.Parse(json);

        if (!document.RootElement.TryGetProperty("items", out var items))
        {
            return new List<Livro>();
        }

        var livros = new List<Livro>();

        foreach (var item in items.EnumerateArray())
        {
            var volumeInfo = item.TryGetProperty("volumeInfo", out var info) ? info : default;

            var title = volumeInfo.TryGetProperty("title", out var titleValue) ? titleValue.GetString() : "Título não informado";
            var authors = volumeInfo.TryGetProperty("authors", out var authorsValue) && authorsValue.ValueKind == JsonValueKind.Array
                ? string.Join(", ", authorsValue.EnumerateArray().Select(a => a.GetString() ?? string.Empty).Where(a => !string.IsNullOrWhiteSpace(a)))
                : "Autor não informado";
            var description = volumeInfo.TryGetProperty("description", out var descriptionValue) ? descriptionValue.GetString() : string.Empty;
            var googleId = item.TryGetProperty("id", out var idValue) ? idValue.GetString() : string.Empty;
            var imageUrl = volumeInfo.TryGetProperty("imageLinks", out var imageLinks)
                ? imageLinks.TryGetProperty("thumbnail", out var thumbnail)
                    ? thumbnail.GetString()
                    : null
                : null;

            var isbn = volumeInfo.TryGetProperty("industryIdentifiers", out var identifiers) && identifiers.ValueKind == JsonValueKind.Array
                ? identifiers.EnumerateArray()
                    .Where(i => i.TryGetProperty("type", out var type) && type.GetString() == "ISBN_13")
                    .Select(i => i.TryGetProperty("identifier", out var identifier) ? identifier.GetString() : null)
                    .FirstOrDefault() ?? string.Empty
                : string.Empty;

            livros.Add(new Livro
            {
                Titulo = title ?? "Título não informado",
                Autor = authors,
                Sinopse = string.IsNullOrWhiteSpace(description) ? "Sem sinopse disponível." : description,
                Isbn = isbn,
                CapaUrl = imageUrl,
                GoogleBId = googleId,
                DataCadastro = DateTime.UtcNow
            });
        }

        return livros;
    }

    public async Task<List<Filme>> SearchMoviesAsync(string query, int limit = 5)
    {
        if (string.IsNullOrWhiteSpace(query))
        {
            return new List<Filme>();
        }

        var apiKey = _configuration["TmdbApiKey"];
        if (string.IsNullOrWhiteSpace(apiKey))
        {
            return GetFallbackMovies(query, limit);
        }

        var url = $"https://api.themoviedb.org/3/search/movie?api_key={apiKey}&query={Uri.EscapeDataString(query)}&include_adult=false&language=pt-BR&page=1";

        using var response = await _httpClient.GetAsync(url);
        if (!response.IsSuccessStatusCode)
        {
            return GetFallbackMovies(query, limit);
        }

        var json = await response.Content.ReadAsStringAsync();
        using var document = JsonDocument.Parse(json);

        if (!document.RootElement.TryGetProperty("results", out var results))
        {
            return GetFallbackMovies(query, limit);
        }

        var filmes = new List<Filme>();

        foreach (var item in results.EnumerateArray())
        {
            var title = item.TryGetProperty("title", out var titleValue) ? titleValue.GetString() : "Filme sem título";
            var overview = item.TryGetProperty("overview", out var overviewValue) ? overviewValue.GetString() : string.Empty;

            int? releaseYear = null;
            if (item.TryGetProperty("release_date", out var dateValue) && !string.IsNullOrWhiteSpace(dateValue.GetString()))
            {
                var rawDate = dateValue.GetString();
                if (DateTime.TryParse(rawDate, out var parsedDate))
                {
                    releaseYear = parsedDate.Year;
                }
            }

            string? posterPath = null;
            if (item.TryGetProperty("poster_path", out var posterValue) && !string.IsNullOrWhiteSpace(posterValue.GetString()))
            {
                posterPath = $"https://image.tmdb.org/t/p/w500{posterValue.GetString()}";
            }

            var tmdbId = item.TryGetProperty("id", out var idValue) ? idValue.GetInt32() : 0;

            filmes.Add(new Filme
            {
                Titulo = title ?? "Filme sem título",
                Diretor = "Diretor não informado",
                AnoLancamento = releaseYear,
                PosterUrl = posterPath,
                TmdbId = tmdbId,
                Sinopse = overview
            });
        }

        return filmes.Take(limit).ToList();
    }

    private static List<Filme> GetFallbackMovies(string query, int limit)
    {
        var sample = new[]
        {
            "Duna",
            "Orgulho e Preconceito",
            "Harry Potter",
            "A Culpa é das Estrelas",
            "O Pequeno Príncipe",
            "O Nome da Rosa"
        };

        return sample
            .Where(item => string.IsNullOrWhiteSpace(query) || item.Contains(query, StringComparison.OrdinalIgnoreCase))
            .Select((item, index) => new Filme
            {
                Titulo = item,
                Diretor = "Diretor não informado",
                AnoLancamento = 2024 - (index % 6),
                PosterUrl = null,
                TmdbId = index + 1,
                Sinopse = "Adaptação vinculada à obra literária correspondente."
            })
            .Take(limit)
            .ToList();
    }
}
