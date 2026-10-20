<div align="center">

# 📚 Resenhário

**Plataforma web de estante virtual e resenhas de livros**

![C#](https://img.shields.io/badge/C%23-239120?style=for-the-badge&logo=csharp&logoColor=white)
![.NET 8](https://img.shields.io/badge/.NET%208-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)

[![Site no ar](https://img.shields.io/badge/Site-no%20ar-4A5C58?style=flat-square)](https://resenh-rio.onrender.com)
![Status](https://img.shields.io/badge/status-em%20desenvolvimento-E6A23C?style=flat-square)

</div>

---

## Sobre o projeto

O Resenhário é uma plataforma web para leitores organizarem sua estante virtual e compartilharem resenhas. O projeto foi desenvolvido em equipe na disciplina de **Desenvolvimento de Software Visual**, da Universidade Positivo (2026).

A proposta completa é conectar cada livro às suas adaptações cinematográficas, permitindo avaliar a qualidade da obra e a fidelidade do filme, de forma a transformar o interesse por filmes e séries em porta de entrada para a leitura.

## Funcionalidades

**Já implementadas**

- Cadastro e login de usuários, com senhas protegidas por hash BCrypt
- Estante virtual por usuário, com status de leitura (Quero Ler, Lendo, Lido, Abandonado)
- Cadastro e consulta de livros e filmes
- Resenhas com nota
- Telas de login, cadastro, página inicial e perfil no front-end em React

**Em desenvolvimento**

- Integração com a Google Books API para buscar e cadastrar livros
- Integração com a TMDB API para pôsteres e diretores de filmes
- Vínculo entre livros e suas adaptações na interface
- Avaliação dupla na interface (qualidade da obra e fidelidade da adaptação)
- Feed da comunidade, estatísticas de leitura e ranking de adaptações

## Tecnologias

| Camada | Tecnologias |
| --- | --- |
| Back-end | C#, .NET 8, ASP.NET Core Web API, Entity Framework Core, BCrypt.Net, Swagger |
| Banco de dados | MySQL 8 (provedor Pomelo) |
| Front-end | React, Vite |
| Ferramentas | Git, GitHub, Trello |

## Estrutura do repositório

```text
Resenh-rio/
├── Controllers/     # Endpoints da API (Usuarios, Estante, Livros, Filmes, Reviews)
├── Models/          # Entidades do banco (Usuario, Livro, Filme, Adaptacao, Estante, Review)
├── Data/            # AppDbContext (Entity Framework Core)
├── Migrations/      # Migrations do banco de dados
├── Program.cs       # Configuração da API (CORS, Swagger, conexão com o MySQL)
└── Front-end/       # Aplicação React (Vite)
    └── src/
        ├── pages/       # Login, Cadastro, Home e Perfil
        ├── components/  # Componentes reutilizáveis
        └── services/    # Comunicação com a API
```

## Modelo de dados

Tabelas: `Usuarios`, `Livros`, `Filmes`, `Adaptacoes`, `Estante` e `Reviews`.

- Um usuário tem vários livros na **estante**, cada um com um status de leitura.
- Uma **adaptação** liga um livro a um filme.
- Uma **review** pertence a um usuário e registra a nota da obra, o comentário e a avaliação da adaptação.

## Como executar localmente

### Pré-requisitos

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js](https://nodejs.org/) (versão LTS)
- [MySQL 8](https://dev.mysql.com/downloads/)
- Ferramenta do Entity Framework: `dotnet tool install --global dotnet-ef`

### 1. Clonar o repositório

```bash
git clone https://github.com/V1701ni/Resenh-rio.git
cd Resenh-rio
```

### 2. Configurar o banco de dados

Crie o banco no MySQL:

```sql
CREATE DATABASE resenhario_db;
```

Em seguida, ajuste a string de conexão no arquivo `appsettings.Development.json` com o seu usuário e a sua senha:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=127.0.0.1;Port=3306;Database=resenhario_db;User=SEU_USUARIO;Password=SUA_SENHA;"
  }
}
```

> **Atenção:** não envie a sua senha do banco para o GitHub. Mantenha as credenciais apenas na sua máquina.

Aplique as migrations para criar as tabelas:

```bash
dotnet ef database update
```

### 3. Executar a API

```bash
dotnet run --launch-profile http
```

A API ficará disponível em `http://localhost:5216`, e a documentação interativa (Swagger) em `http://localhost:5216/swagger`.

### 4. Executar o front-end

Em outro terminal:

```bash
cd Front-end
npm install
```

Crie o arquivo `Front-end/.env` apontando para a API:

```env
VITE_API_URL=http://localhost:5216/api
```

Inicie a aplicação:

```bash
npm run dev
```

O endereço do front-end aparece no terminal (normalmente `http://localhost:5173`).

## Endpoints principais

| Recurso | Método e rota | Descrição |
| --- | --- | --- |
| Usuários | `POST /api/Usuarios` | Cadastra um usuário |
| | `POST /api/Usuarios/login` | Autentica um usuário |
| | `GET /api/Usuarios/{id}` | Busca um usuário |
| Estante | `GET /api/Estante/usuario/{idUsuario}` | Lista a estante de um usuário |
| | `POST /api/Estante` | Adiciona um livro à estante |
| | `PUT /api/Estante/{id}` | Atualiza o status de leitura |
| | `DELETE /api/Estante/{id}` | Remove da estante |
| Livros | `GET /api/Livros` · `GET /api/Livros/{id}` | Lista e busca livros |
| | `POST /api/Livros` | Cadastra um livro |
| Filmes | `GET /api/Filmes` · `GET /api/Filmes/{id}` | Lista e busca filmes |
| | `POST /api/Filmes` | Cadastra um filme |
| Reviews | `GET /api/Reviews` | Lista as resenhas |
| | `POST /api/Reviews` | Publica uma resenha |

## Equipe

| Integrante | Função |
| --- | --- |
| Alejandro Abraham Leon Benavente | Scrum Master |
| John Vitor do Carmo Barbosa | Banco de Dados |
| Ketelyn Ramos Zaleski | Front-end / Back-end |
| Lucas Gaeski Borges | Analista de Testes |
| Matheus Alexandre Vieira | QA |
| [Vinicius Lima Pereira](https://github.com/V1701ni) | Back-end / Front-end |

## Contexto acadêmico

Projeto desenvolvido para a disciplina de Desenvolvimento de Software Visual, do curso de Sistemas de Informação da Universidade Positivo, com entrega final e defesa de código em 19/11/2026.
