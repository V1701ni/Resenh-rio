import { useState } from 'react'
import { Navigation } from '../components/common/Navigation'
import { criarConta } from '../services/api'
import { loginBackground, profileIcon } from '../utils/assetLoader'

export function CadastroPage({ onHome, onLogin, onProfile }) {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (loading) return

    setErro('')
    setSucesso('')
    setLoading(true)

    try {
      const result = await criarConta(nome.trim(), email.trim(), senha)

      if (result.success) {
        setSucesso('Conta criada com sucesso! Você já pode entrar.')
        setNome('')
        setEmail('')
        setSenha('')
        setShowPassword(false)
      } else {
        setErro(result.message || 'Não foi possível criar a conta.')
      }
    } catch {
      setErro('Erro ao se conectar ao servidor.')
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

      <section className="login-copy" aria-labelledby="cadastro-copy-title">
        <h2 id="cadastro-copy-title">
          Crie sua conta
          <br />
          e comece sua estante.
        </h2>

        <p>
          Registre os livros que você leu, descubra as adaptações para o cinema
          e compartilhe suas resenhas com outros leitores.
        </p>
      </section>

      <form
        className="login-card"
        aria-label="Formulário de cadastro"
        aria-busy={loading}
        onSubmit={handleSubmit}
      >
        <h1>
          Crie sua conta
          <br />
          <strong>Resenhário</strong>
        </h1>

        {erro && (
          <p id="cadastro-erro" className="login-error" role="alert">
            {erro}
          </p>
        )}

        {sucesso && (
          <p
            className="login-error"
            role="status"
            style={{
              borderColor: 'rgba(107, 255, 155, .35)',
              background: 'rgba(107, 255, 155, .1)',
              color: '#b4ffcf'
            }}
          >
            {sucesso}
          </p>
        )}

        <label className="login-field">
          <img src={profileIcon} alt="" />

          <input
            type="text"
            name="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            autoComplete="name"
            placeholder="Nome"
            aria-label="Nome"
            aria-describedby={erro ? 'cadastro-erro' : undefined}
            required
          />
        </label>

        <label className="login-field">
          <span className="password-dots" aria-hidden="true">
            @
          </span>

          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            inputMode="email"
            placeholder="E-mail"
            aria-label="E-mail"
            aria-describedby={erro ? 'cadastro-erro' : undefined}
            required
          />
        </label>

        <label className="login-field">
          <span className="password-dots" aria-hidden="true">
            •••
          </span>

          <input
            type={showPassword ? 'text' : 'password'}
            name="senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            autoComplete="new-password"
            minLength={6}
            placeholder="Senha (mínimo 6 caracteres)"
            aria-label="Senha, mínimo 6 caracteres"
            aria-describedby={erro ? 'cadastro-erro' : undefined}
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

        <button className="login-submit" type="submit" disabled={loading}>
          {loading ? 'Criando...' : 'Criar conta'}
        </button>

        <p className="register-login">
          Já tem uma conta?{' '}
          <a
            href="#login"
            onClick={(event) => {
              event.preventDefault()
              onLogin()
            }}
          >
            Entrar
          </a>
        </p>
      </form>
    </main>
  )
}