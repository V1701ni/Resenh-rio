import { bookImages, filmImages, homeNews, homeReviews } from '../data/homeData'
import { profileActivities, profileBooks, profileMovies, profileUser } from '../data/profileData'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Leituras caem nos dados de exemplo rapidamente; login e cadastro esperam mais,
// porque o servidor gratuito pode levar um tempo para acordar.
const READ_TIMEOUT_MS = 4000
const AUTH_TIMEOUT_MS = 45000

const SESSION_KEY = 'resenhario:usuario'

// SESSÃO (quem está logado neste navegador)

export function salvarUsuarioLogado(user) {
  try {
    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify({
        idUsuario: user.idUsuario,
        nome: user.nome,
        email: user.email
      })
    )
  } catch {
    // Armazenamento indisponível (modo privado, por exemplo): segue sem salvar.
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

// HELPERS DE REQUISIÇÃO

async function parseBody(response) {
  const text = await response.text()

  if (!text) return null

  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

// Nunca lança erro: sempre devolve { ok, status, data, networkError, timedOut }
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

  return 'Não foi possível conectar ao servidor. Verifique sua conexão.'
}

// Usado nas leituras: em qualquer falha devolve null e a tela usa os dados de exemplo
async function fetchWithFallback(endpoint, options = {}) {
  const result = await request(endpoint, options, READ_TIMEOUT_MS)

  if (!result.ok) {
    const reason = result.networkError
      ? 'sem conexão'
      : `erro ${result.status}`

    console.warn(`[API Fallback] Não foi possível usar ${endpoint} (${reason})`)
    return null
  }

  return result.data
}

// SERVIÇOS DE FILMES

export async function getFilmes() {
  const data = await fetchWithFallback('/Filmes')

  if (data && Array.isArray(data) && data.length > 0) {
    return data.map((f) => ({
      id: f.idFilme,
      title: f.titulo,
      director: f.diretor,
      year: f.anoLancamento || 2025,
      cover: f.posterUrl
    }))
  }

  return filmImages.map((img, idx) => ({
    id: idx + 1,
    coverName: img,
    year: 2025,
    rating: 3.8
  }))
}

// SERVIÇOS DE LIVROS

export async function getLivros() {
  const data = await fetchWithFallback('/Livros')

  if (data && Array.isArray(data) && data.length > 0) {
    return data.map((l) => ({
      id: l.idLivros,
      title: l.titulo,
      author: l.autor,
      synopsis: l.sinopse,
      cover: l.capaUrl
    }))
  }

  return bookImages.map((img, idx) => ({
    id: idx + 1,
    coverName: img,
    year: 2025,
    rating: 3.8
  }))
}

// SERVIÇOS DE REVIEWS / AVALIAÇÕES

export async function getReviews() {
  const data = await fetchWithFallback('/Reviews')

  if (data && Array.isArray(data) && data.length > 0) {
    return data.map((r) => ({
      id: r.idReviews,
      cover: r.livro?.capaUrl || 'activity-1.png',
      title: r.livro?.titulo || 'Sem título',
      year: r.livro?.ano || '2025',
      copy: r.comentario || '',
      comments: '0 comentários',
      likes: '0 curtidas',
      avatar: 1,
      reviewer: r.usuario?.nome || 'Usuário Anônimo',
      rating: r.nota || r.notaLivro || 5
    }))
  }

  return homeReviews
}

export async function createReview(reviewData) {
  const result = await fetchWithFallback('/Reviews', {
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

  return result
}

// SERVIÇOS DE USUÁRIOS & AUTENTICAÇÃO

export async function getUsuarios() {
  const data = await fetchWithFallback('/Usuarios')
  return data || [profileUser]
}

// Devolve { success: true, user } ou { success: false, message }
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
      message: `Erro no servidor (${result.status}). Tente novamente mais tarde.`
    }
  }

  salvarUsuarioLogado(result.data)

  return { success: true, user: result.data }
}

// Devolve { success: true, user } ou { success: false, message }
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
      message: `Erro no servidor (${result.status}). Tente novamente mais tarde.`
    }
  }

  return { success: true, user: result.data }
}