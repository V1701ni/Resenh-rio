import { useState } from 'react'
import { Navigation } from '../components/common/Navigation'
import { cadastrarUsuario } from '../services/api'

export function CadastroPage({ onHome, onLogin, onProfile }) {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErro('')
    setSucesso('')
    setLoading(true)

    try {
      const result = await cadastrarUsuario(nome, email, senha)

      if (result) {
        setSucesso('Conta criada com sucesso! Você já pode entrar.')
        setNome('')
        setEmail('')
        setSenha('')
      } else {
        setErro('Não foi possível criar a conta.')
      }
    } catch {
      setErro('Erro ao se conectar ao servidor.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="login-page">
      <Navigation
        onHome={onHome}
        onLogin={onLogin}
        onStart={onHome}
        onProfile={onProfile}
      />

      <form
        className="login-card"
        aria-label="Formulário de cadastro"
        onSubmit={handleSubmit}
      >
        <h1>
          Crie sua conta
          <br />
          <strong>Resenhário</strong>
        </h1>

        {erro && (
          <p
            style={{
              color: '#ff6b6b',
              fontSize: '12px',
              textAlign: 'center',
              margin: '0 0 12px'
            }}
          >
            {erro}
          </p>
        )}

        {sucesso && (
          <p
            style={{
              color: '#6bff9b',
              fontSize: '12px',
              textAlign: 'center',
              margin: '0 0 12px'
            }}
          >
            {sucesso}
          </p>
        )}

        <label className="login-field">
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome"
            aria-label="Nome"
            required
          />
        </label>

        <label className="login-field">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail"
            aria-label="E-mail"
            required
          />
        </label>

        <label className="login-field">
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Senha"
            aria-label="Senha"
            required
          />
        </label>

        <button className="login-submit" type="submit" disabled={loading}>
          {loading ? 'Criando...' : 'Criar conta'}
        </button>

        <p className="register-login">
          Já tem uma conta?{' '}
          <a
            href="#"
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