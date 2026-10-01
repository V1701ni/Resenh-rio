import { bookImages, filmImages, homeNews, homeReviews } from '../data/homeData'
import { profileActivities, profileBooks, profileMovies, profileUser } from '../data/profileData'

// Endereço base da API backend (.NET)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

/**
 * Função utilitária para requisições HTTP seguras com fallback.
 */
async function fetchWithFallback(endpoint, options = {}) {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 4000)

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      signal: controller.signal,
      ...options
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`Erro na API (${response.status}): ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.warn(`[API Fallback] Não foi possível conectar a ${endpoint}:`, error.message)
    return null
  }
}

// ============================================================================
// SERVIÇOS DE FILMES
// ============================================================================
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
  // Fallback para os dados do protótipo
  return filmImages.map((img, idx) => ({
    id: idx + 1,
    coverName: img,
    year: 2025,
    rating: 3.8
  }))
}

// ============================================================================
// SERVIÇOS DE LIVROS
// ============================================================================
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
  // Fallback para os dados do protótipo
  return bookImages.map((img, idx) => ({
    id: idx + 1,
    coverName: img,
    year: 2025,
    rating: 3.8
  }))
}

// ============================================================================
// SERVIÇOS DE REVIEWS / AVALIAÇÕES
// ============================================================================
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
  // Fallback para os dados mockados
  return homeReviews
}

export async function createReview(reviewData) {
  const result = await fetchWithFallback('/Reviews', {
    method: 'POST',
    body: JSON.stringify({
      idUsuario: reviewData.idUsuario || 1,
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

// ============================================================================
// SERVIÇOS DE USUÁRIOS & AUTENTICAÇÃO
// ============================================================================
export async function getUsuarios() {
  const data = await fetchWithFallback('/Usuarios')
  return data || [profileUser]
}

export async function loginUsuario(username, password) {
  // Chamada de autenticação via API
  const usuarios = await fetchWithFallback('/Usuarios')
  if (usuarios && Array.isArray(usuarios)) {
    const user = usuarios.find(
      (u) => u.nome?.toLowerCase() === username.toLowerCase() || u.email?.toLowerCase() === username.toLowerCase()
    )
    if (user) {
      return { success: true, user }
    }
  }
  // Simulação de login local caso o backend não tenha dados ainda
  if (username && password) {
    return {
      success: true,
      user: {
        idUsuario: 1,
        nome: username,
        bio: profileUser.bio
      }
    }
  }
  return { success: false, message: 'Usuário ou senha inválidos' }
}

export async function cadastrarUsuario(nome, email, senha) {
  const result = await fetchWithFallback('/Usuarios', {
    method: 'POST',
    body: JSON.stringify({
      nome,
      email,
      senhaHash: senha
    })
  })
  return result
}
