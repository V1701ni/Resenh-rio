
using System.Text.Json;

namespace MeuProjeto.Services;

public class GoogleBooksService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;

    public GoogleBooksService(
        HttpClient httpClient,
        IConfiguration configuration)
    {
        _httpClient = httpClient;
        _configuration = configuration;
    }

    public async Task<JsonElement> BuscarLivrosAsync(string termo)
    {
        var apiKey = _configuration["GoogleBooks:ApiKey"];

        var url =
            "https://www.googleapis.com/books/v1/volumes" +
            $"?q={Uri.EscapeDataString(termo)}&maxResults=10";

        if (!string.IsNullOrWhiteSpace(apiKey))
        {
            url += $"&key={Uri.EscapeDataString(apiKey)}";
        }

        for (var tentativa = 0; tentativa < 3; tentativa++)
        {
            using var response = await _httpClient.GetAsync(url);

            if ((int)response.StatusCode == 429 && tentativa < 2)
            {
                await Task.Delay(
                    TimeSpan.FromSeconds(2 * (tentativa + 1))
                );

                continue;
            }

            response.EnsureSuccessStatusCode();

            using var documento = JsonDocument.Parse(
                await response.Content.ReadAsStringAsync()
            );

            return documento.RootElement.Clone();
        }

        throw new HttpRequestException(
            "O Google Books continua limitando as requisições."
        );
    }
}
