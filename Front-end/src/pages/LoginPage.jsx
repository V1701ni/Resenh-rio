import { useState } from 'react'
import { Navigation } from '../components/common/Navigation'
import { loginUsuario } from '../services/api'
import { loginBackground, profileIcon } from '../utils/assetLoader'

export function LoginPage({ onHome, onProfile, onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await loginUsuario(username, password)
      if (result.success) {
        onProfile()
      } else {
        setError(result.message || 'Falha ao autenticar. Tente novamente.')
      }
    } catch {
      setError('Erro ao se conectar ao servidor.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="login-page">
      <div className="login-background" aria-hidden="true">
        <img src={loginBackground} alt="" />
      </div>

      <Navigation
        onHome={onHome}
        onLogin={onLogin}
        onStart={onHome}
        onProfile={onProfile}
      />

      <section
        className="login-copy"
        aria-labelledby="login-copy-title"
      >
        <h2 id="login-copy-title">
          Monte sua estante
          <br />
          e compartilhe suas histórias.
        </h2>

        <p>
          Organize seus filmes e livros favoritos, descubra novas histórias e
          compartilhe suas opiniões com outros amantes da cultura.
        </p>
      </section>

      <form
        className="login-card"
        aria-label="Formulário de login"
        onSubmit={handleSubmit}
      >
        <h1>
          Bem-vindo ao
          <br />
          <strong>Resenhário</strong>
        </h1>

        {error && (
          <p style={{ color: '#ff6b6b', fontSize: '12px', textAlign: 'center', margin: '0 0 12px' }}>
            {error}
          </p>
        )}

        <label className="login-field">
          <img src={profileIcon} alt="" />

          <input
            type="text"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            placeholder="Usuário"
            aria-label="Usuário"
            required
          />
        </label>

        <label className="login-field">
          <span className="password-dots" aria-hidden="true">
            •••
          </span>

          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            placeholder="Senha"
            aria-label="Senha"
            required
          />
        </label>

        <label className="remember-login">
          <input type="checkbox" name="remember" />
          <span>Lembrar senha</span>
        </label>

        <button className="login-submit" type="submit" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>

        <p className="register-login">
          Não tem uma conta? <a href="#cadastro">Cadastre-se</a>
        </p>

        <a className="forgot-login" href="#recuperar">
          Esqueceu sua senha?
        </a>
      </form>
    </main>
  )
}
