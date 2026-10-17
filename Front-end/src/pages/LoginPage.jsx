import { useState } from 'react'
import { Navigation } from '../components/common/Navigation'
import { loginUsuario } from '../services/api'
import { loginBackground, profileIcon } from '../utils/assetLoader'

const REMEMBER_KEY = 'resenhario:email'

function getRememberedEmail() {
  try {
    return localStorage.getItem(REMEMBER_KEY) || ''
  } catch {
    return ''
  }
}

function saveRememberedEmail(email, remember) {
  try {
    if (remember) {
      localStorage.setItem(REMEMBER_KEY, email)
    } else {
      localStorage.removeItem(REMEMBER_KEY)
    }
  } catch {
    // Armazenamento indisponível (modo privado, por exemplo): segue sem lembrar.
  }
}

export function LoginPage({ onHome, onProfile, onLogin, onCadastro }) {
  const [email, setEmail] = useState(getRememberedEmail)
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(() => getRememberedEmail() !== '')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (loading) return

    setError('')
    setLoading(true)

    const cleanEmail = email.trim()

    try {
      const result = await loginUsuario(cleanEmail, password)

      if (result.success) {
        saveRememberedEmail(cleanEmail, remember)
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

  const handleForgot = (event) => {
    event.preventDefault()
    setError('A recuperação de senha ainda não está disponível.')
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

      <section className="login-copy" aria-labelledby="login-copy-title">
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
        aria-busy={loading}
        onSubmit={handleSubmit}
      >
        <h1>
          Bem-vindo ao
          <br />
          <strong>Resenhário</strong>
        </h1>

        {error && (
          <p id="login-error" className="login-error" role="alert">
            {error}
          </p>
        )}

        <label className="login-field">
          <img src={profileIcon} alt="" />

          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            inputMode="email"
            placeholder="E-mail"
            aria-label="E-mail"
            aria-describedby={error ? 'login-error' : undefined}
            required
          />
        </label>

        <label className="login-field">
          <span className="password-dots" aria-hidden="true">
            •••
          </span>

          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            placeholder="Senha"
            aria-label="Senha"
            aria-describedby={error ? 'login-error' : undefined}
            required
          />

          <button
            className="password-toggle"
            type="button"
            onClick={() => setShowPassword((visible) => !visible)}
            aria-pressed={showPassword}
            aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
          >
            {showPassword ? 'Ocultar' : 'Mostrar'}
          </button>
        </label>

        <div className="login-options">
          <label className="remember-login">
            <input
              type="checkbox"
              name="remember"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            <span>Lembrar e-mail</span>
          </label>

          <a className="forgot-login" href="#" onClick={handleForgot}>
            Esqueceu sua senha?
          </a>
        </div>

        <button className="login-submit" type="submit" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>

        <p className="register-login">
          Não tem uma conta?{' '}
          <a
            href="#cadastro"
            onClick={(event) => {
              event.preventDefault()
              onCadastro()
            }}
          >
            Cadastre-se
          </a>
        </p>
      </form>
    </main>
  )
}