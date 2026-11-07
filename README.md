# Resenhário

**Do livro à tela: descubra, organize e compartilhe suas experiências com histórias.**

O **Resenhário** é uma plataforma web de catálogo literário e cinematográfico que conecta livros às suas adaptações para o cinema. A aplicação permite explorar obras, acompanhar leituras, consultar adaptações e compartilhar avaliações com outros usuários.

Projeto acadêmico desenvolvido para a disciplina **Desenvolvimento de Software Visual — Universidade Positivo (2026)**.

## Funcionalidades

- **Catálogo de livros:** consulta e exploração de obras literárias.
- **Catálogo de filmes:** visualização de adaptações cinematográficas.
- **Relação entre livros e filmes:** conexão entre obras originais e suas adaptações.
- **Sistema de usuários:** cadastro, autenticação e gerenciamento de contas.
- **Resenhas e avaliações:** publicação de opiniões e notas sobre livros e adaptações.
- **Estante pessoal:** organização de livros por status de leitura.
- **Integrações externas:** consulta de informações e imagens por meio das APIs Google Books e TMDB.

## Tecnologias

| Camada | Tecnologias |
|---|---|
| Backend | C#, .NET 10, ASP.NET Core Web API |
| ORM | Entity Framework Core |
| Banco de dados | MySQL |
| Frontend | HTML, CSS e JavaScript |
| Autenticação | JWT e BCrypt |
| APIs externas | Google Books API e TMDB API |
| Documentação da API | Swagger / OpenAPI |

## Arquitetura

O projeto utiliza uma arquitetura baseada em API REST, com separação entre controladores, modelos de domínio e camada de persistência.

```text
Resenhário/
│
├── BACKEND/
│   └── Resenhario.Api/
│       ├── Controllers/
│       ├── Models/
│       ├── Data/
│       ├── wwwroot/
│       ├── Program.cs
│       └── appsettings*.json
│
├── BANCO DE DADOS/
│   └── Scripts SQL
│
├── docs/
│   └── Documentação técnica
│
├── Dockerfile
├── .dockerignore
├── .gitignore
└── LEIA-ME.md
```

## Executando o projeto

### Pré-requisitos

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- MySQL 8
- Credenciais para as integrações externas, conforme necessário.

### 1. Configurar o banco de dados

Crie o banco MySQL e execute os scripts SQL indicados no guia de instalação.

### 2. Configurar as credenciais

Configure a string de conexão do MySQL e as chaves das APIs utilizando o **.NET User Secrets** ou variáveis de ambiente.

As credenciais não devem ser armazenadas no código-fonte nem publicadas no GitHub.

### 3. Executar a aplicação

No terminal, a partir da raiz do repositório:

```powershell
cd BACKEND/Resenhario.Api
dotnet run --launch-profile http
```

### 4. Acessar

| Recurso | Endereço |
|---|---|
| Aplicação web | http://localhost:5131 |
| Swagger | http://localhost:5131/swagger |
| Saúde da API | http://localhost:5131/api/saude |

**Importante:** consulte o arquivo [`LEIA-ME.md`](LEIA-ME.md) para obter o procedimento completo de configuração do banco, credenciais, APIs externas e dados de demonstração.

## Documentação

- [`LEIA-ME.md`](LEIA-ME.md) — Guia completo de instalação e execução.
- [`docs/PUBLICAR_ONLINE.md`](docs/PUBLICAR_ONLINE.md) — Instruções de publicação.
- [`docs/ROTEIRO_DEMO.md`](docs/ROTEIRO_DEMO.md) — Roteiro de demonstração.
- [`docs/AUDITORIA.md`](docs/AUDITORIA.md) — Auditoria de escopo e documentação técnica.

## Objetivo do projeto

O Resenhário foi desenvolvido com o propósito de aplicar conceitos de desenvolvimento web, construção de APIs REST, persistência de dados relacionais, autenticação e integração com serviços externos em uma aplicação completa.

---

**Resenhário — histórias que conectam livros e filmes.**
