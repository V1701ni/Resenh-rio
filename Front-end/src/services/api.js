
import { bookImages, filmImages, homeReviews } from '../data/homeData'
import { profileUser } from '../data/profileData'

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5216/api'

const READ_TIMEOUT_MS = 4000
const AUTH_TIMEOUT_MS = 45000
const SESSION_KEY = 'resenhario:usuario'

export const STATUS_ESTANTE = {
  QUERO_LER: 'Quero Ler',
  LENDO: 'Lendo',
  LIDO: 'Lido',
  ABANDONADO: 'Abandonado'
}

// SESSÃO

export function salvarUsuarioLogado(user) {
  try {
    const usuarioAtual = getUsuarioLogado() || {}

    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify({
        ...usuarioAtual,
        ...user,
        idUsuario: user.idUsuario ?? usuarioAtual.idUsuario,
        nome: user.nome ?? usuarioAtual.nome,
        email: user.email ?? usuarioAtual.email,
        bio: user.bio ?? usuarioAtual.bio ?? '',
        fotoUrl: user.fotoUrl ?? usuarioAtual.fotoUrl ?? '',
        bannerUrl: user.bannerUrl ?? usuarioAtual.bannerUrl ?? ''
      })
    )
  } catch {
    console.warn('Não foi possível salvar os dados do perfil.')
  }
}

export function getUsuarioLogado() {
  try {
    const saved = localStorage.getItem(SESSION_KEY)
    return saved ? JSON.parse(saved) : null
  } catch {
    return null
  }
}

export function sair() {
  try {
    localStorage.removeItem(SESSION_KEY)
  } catch {
    // Nada a fazer se o armazenamento estiver indisponível.
  }
}

// REQUISIÇÕES HTTP

async function parseBody(response) {
  const text = await response.text()

  if (!text) return null

  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

async function request(endpoint, options = {}, timeoutMs = AUTH_TIMEOUT_MS) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      signal: controller.signal
    })

    const data = await parseBody(response)

    return {
      ok: response.ok,
      status: response.status,
      data,
      networkError: false,
      timedOut: false
    }
  } catch (error) {
    return {
      ok: false,
      status: 0,
      data: null,
      networkError: true,
      timedOut: error.name === 'AbortError'
    }
  } finally {
    clearTimeout(timeoutId)
  }
}

function networkMessage(result) {
  if (result.timedOut) {
    return 'O servidor demorou para responder. Ele pode estar iniciando; tente novamente em instantes.'
  }

  return 'Não foi possível conectar ao servidor. Verifique se o backend está funcionando.'
}

async function fetchWithFallback(endpoint, options = {}) {
  const result = await request(endpoint, options, READ_TIMEOUT_MS)

  if (!result.ok) {
    const reason = result.networkError
      ? 'sem conexão'
      : `erro ${result.status}`

    console.warn(
      `[API Fallback] Não foi possível usar ${endpoint} (${reason})`
    )

    return null
  }

  return result.data
}

function mapearLivro(livro) {
  return {
    id: livro.idLivros ?? livro.id ?? null,
    idLivros: livro.idLivros ?? livro.id ?? null,
    googleId: livro.googleBId ?? livro.googleId ?? null,
    title: livro.titulo ?? livro.title ?? 'Sem título',
    author: livro.autor ?? livro.author ?? 'Autor desconhecido',
    synopsis: livro.sinopse ?? livro.synopsis ?? '',
    isbn: livro.isbn ?? '',
    cover: livro.capaUrl ?? livro.cover ?? '',
    capaUrl: livro.capaUrl ?? livro.cover ?? ''
  }
}

function mensagemErro(result, mensagemPadrao) {
  if (result.networkError) {
    return networkMessage(result)
  }

  if (typeof result.data === 'string' && result.data) {
    return result.data
  }

  return mensagemPadrao
}

// FILMES

export async function getFilmes() {
  const data = await fetchWithFallback('/Filmes')

  if (Array.isArray(data) && data.length > 0) {
    return data.map((filme) => ({
      id: filme.idFilme,
      title: filme.titulo,
      director: filme.diretor,
      year: filme.anoLancamento || 2025,
      cover: filme.posterUrl
    }))
  }

  return filmImages.map((img, index) => ({
    id: index + 1,
    coverName: img,
    year: 2025,
    rating: 3.8
  }))
}

// LIVROS

export async function getLivros() {
  const data = await fetchWithFallback('/Livros')

  if (Array.isArray(data) && data.length > 0) {
    return data.map(mapearLivro)
  }

  return bookImages.map((img, index) => ({
    id: index + 1,
    coverName: img,
    year: 2025,
    rating: 3.8
  }))
}

export async function buscarLivros(consulta) {
  if (!consulta || !consulta.trim()) {
    return {
      success: true,
      books: [],
      message: ''
    }
  }

  const result = await request(
    `/Livros/buscar?q=${encodeURIComponent(consulta.trim())}`,
    {},
    AUTH_TIMEOUT_MS
  )

  if (!result.ok) {
    return {
      success: false,
      books: [],
      message: mensagemErro(result, 'Não foi possível buscar os livros.')
    }
  }

  const livros = Array.isArray(result.data) ? result.data : []

  return {
    success: true,
    books: livros.map(mapearLivro),
    message: ''
  }
}

// ESTANTE VIRTUAL

function mapearItemEstante(item) {
  const livro = item.livro ?? item.Livro ?? item.book ?? {}

  return {
    id: item.idEstante ?? item.id ?? item.IdEstante,
    status: item.status ?? item.Status ?? STATUS_ESTANTE.QUERO_LER,
    book: mapearLivro(livro)
  }
}

export async function getEstante(idUsuario) {
  const usuario = getUsuarioLogado()
  const id = idUsuario ?? usuario?.idUsuario

  if (!id) {
    return {
      success: false,
      items: [],
      message: 'Faça login para acessar sua estante.'
    }
  }

  const result = await request(
    `/Estante/usuario/${encodeURIComponent(id)}`,
    {},
    AUTH_TIMEOUT_MS
  )

  if (!result.ok) {
    return {
      success: false,
      items: [],
      message: mensagemErro(result, 'Não foi possível carregar a estante.')
    }
  }

  const itens = Array.isArray(result.data) ? result.data : []

  return {
    success: true,
    items: itens.map(mapearItemEstante),
    message: ''
  }
}

export async function adicionarNaEstante(book, status = STATUS_ESTANTE.QUERO_LER) {
  const usuario = getUsuarioLogado()
  const idUsuario = usuario?.idUsuario

  if (!idUsuario) {
    return {
      success: false,
      message: 'Faça login para adicionar livros à estante.'
    }
  }

  if (!book) {
    return {
      success: false,
      message: 'Livro inválido.'
    }
  }

  let idLivros = book.idLivros ?? null

  // Se o livro já possui um ID do banco, não precisa cadastrá-lo novamente.
  if (!idLivros && book.id && !book.googleId) {
    idLivros = book.id
  }

  // Livros externos precisam ser cadastrados no banco antes de entrar na estante.
  if (!idLivros) {
    if (!book.title && !book.titulo) {
      return {
        success: false,
        message: 'O livro não possui título.'
      }
    }

    const dadosLivro = {
      titulo: book.title ?? book.titulo,
      autor: book.author ?? book.autor ?? '',
      sinopse: book.synopsis ?? book.sinopse ?? '',
      isbn: book.isbn ?? '',
      capaUrl: book.cover ?? book.capaUrl ?? '',
      googleBId: book.googleId ?? book.googleBId ?? ''
    }

    const cadastro = await request(
      '/Livros',
      {
        method: 'POST',
        body: JSON.stringify(dadosLivro)
      },
      AUTH_TIMEOUT_MS
    )

    if (!cadastro.ok) {
      return {
        success: false,
        message: mensagemErro(
          cadastro,
          'Não foi possível cadastrar o livro no banco de dados.'
        )
      }
    }

    idLivros = cadastro.data?.idLivros ?? cadastro.data?.id

    if (!idLivros) {
      return {
        success: false,
        message: 'O servidor cadastrou o livro, mas não retornou seu ID.'
      }
    }
  }

  const result = await request(
    '/Estante',
    {
      method: 'POST',
      body: JSON.stringify({
        idUsuario,
        idLivros,
        status
      })
    },
    AUTH_TIMEOUT_MS
  )

  if (!result.ok) {
    return {
      success: false,
      message: mensagemErro(
        result,
        result.status === 409
          ? 'Este livro já está na sua estante.'
          : 'Não foi possível adicionar o livro à estante.'
      )
    }
  }

  return {
    success: true,
    message: 'Livro adicionado à estante.'
  }
}

export async function atualizarStatusEstante(id, status) {
  if (!id) {
    return {
      success: false,
      message: 'Item da estante inválido.'
    }
  }

  const result = await request(
    `/Estante/${encodeURIComponent(id)}`,
    {
      method: 'PUT',
      body: JSON.stringify({ status })
    },
    AUTH_TIMEOUT_MS
  )

  if (!result.ok) {
    return {
      success: false,
      message: mensagemErro(
        result,
        'Não foi possível atualizar o status do livro.'
      )
    }
  }

  return {
    success: true,
    message: 'Status atualizado.'
  }
}

export async function removerDaEstante(id) {
  if (!id) {
    return {
      success: false,
      message: 'Item da estante inválido.'
    }
  }

  const result = await request(
    `/Estante/${encodeURIComponent(id)}`,
    {
      method: 'DELETE'
    },
    AUTH_TIMEOUT_MS
  )

  if (!result.ok) {
    return {
      success: false,
      message: mensagemErro(result, 'Não foi possível remover o livro.')
    }
  }

  return {
    success: true,
    message: 'Livro removido da estante.'
  }
}

// REVIEWS / AVALIAÇÕES

export async function getReviews() {
  const data = await fetchWithFallback('/Reviews')

  if (Array.isArray(data) && data.length > 0) {
    return data.map((review) => ({
      id: review.idReviews,
      cover: review.livro?.capaUrl || 'activity-1.png',
      title: review.livro?.titulo || 'Sem título',
      year: review.livro?.ano || '2025',
      copy: review.comentario || '',
      comments: '0 comentários',
      likes: '0 curtidas',
      avatar: 1,
      reviewer: review.usuario?.nome || 'Usuário Anônimo',
      rating: review.nota || review.notaLivro || 5
    }))
  }

  return homeReviews
}

export async function createReview(reviewData) {
  return fetchWithFallback('/Reviews', {
    method: 'POST',
    body: JSON.stringify({
      idUsuario: reviewData.idUsuario || getUsuarioLogado()?.idUsuario || 1,
      idLivro: reviewData.idLivro || null,
      idAdaptacao: reviewData.idAdaptacao || null,
      notaLivro: reviewData.rating || 5,
      comentario: reviewData.comment || '',
      assistiuFilme: reviewData.assistiuFilme || false,
      nota: reviewData.rating || 5
    })
  })
}

// USUÁRIOS

export async function getUsuarios() {
  const data = await fetchWithFallback('/Usuarios')
  return data || [profileUser]
}

export async function loginUsuario(email, password) {
  const result = await request('/Usuarios/login', {
    method: 'POST',
    body: JSON.stringify({
      email,
      senha: password
    })
  })

  if (result.networkError) {
    return { success: false, message: networkMessage(result) }
  }

  if (result.status === 401) {
    return { success: false, message: 'E-mail ou senha inválidos.' }
  }

  if (!result.ok) {
    return {
      success: false,
      message: mensagemErro(
        result,
        `Erro no servidor (${result.status}). Tente novamente mais tarde.`
      )
    }
  }

  salvarUsuarioLogado(result.data)

  return { success: true, user: result.data }
}

export async function criarConta(nome, email, senha) {
  const result = await request('/Usuarios', {
    method: 'POST',
    body: JSON.stringify({
      nome,
      email,
      senha
    })
  })

  if (result.networkError) {
    return { success: false, message: networkMessage(result) }
  }

  if (result.status === 409) {
    return { success: false, message: 'Já existe uma conta com este e-mail.' }
  }

  if (result.status === 400) {
    return { success: false, message: 'Preencha nome, e-mail e senha.' }
  }

  if (!result.ok) {
    return {
      success: false,
      message: mensagemErro(
        result,
        `Erro no servidor (${result.status}). Tente novamente mais tarde.`
      )
    }
  }

  return { success: true, user: result.data }
}
