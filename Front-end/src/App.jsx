import { useEffect, useState } from 'react'
import './App.css'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { ProfilePage } from './pages/ProfilePage'
import { CadastroPage } from './pages/CadastroPage'
import { EstantePage } from './pages/EstantePage'

function App() {
  const [screen, setScreen] = useState(() => {
    const hash = window.location.hash.slice(1)

    if (hash === 'login') return 'login'
    if (hash === 'cadastro') return 'cadastro'
    if (hash === 'perfil') return 'profile'
    if (hash === 'estante') return 'estante'

    return 'home'
  })

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1)

      if (hash === 'login') {
        setScreen('login')
      } else if (hash === 'cadastro') {
        setScreen('cadastro')
      } else if (hash === 'perfil') {
        setScreen('profile')
      } else if (hash === 'estante') {
        setScreen('estante')
      } else {
        setScreen('home')
      }
    }

    window.addEventListener('hashchange', handleHashChange)

    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const goHome = () => {
    setScreen('home')
    window.history.replaceState(null, '', '#inicio')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goLogin = () => {
    setScreen('login')
    window.history.replaceState(null, '', '#login')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goCadastro = () => {
    setScreen('cadastro')
    window.history.replaceState(null, '', '#cadastro')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goProfile = () => {
    setScreen('profile')
    window.history.replaceState(null, '', '#perfil')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goEstante = () => {
    setScreen('estante')
    window.history.replaceState(null, '', '#estante')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (screen === 'estante') {
    return (
      <EstantePage
        onHome={goHome}
        onLogin={goLogin}
        onProfile={goProfile}
        onEstante={goEstante}
      />
    )
  }

  if (screen === 'login') {
    return (
      <LoginPage
        onHome={goHome}
        onLogin={goLogin}
        onProfile={goProfile}
        onCadastro={goCadastro}
      />
    )
  }

  if (screen === 'cadastro') {
    return (
      <CadastroPage
        onHome={goHome}
        onLogin={goLogin}
        onProfile={goProfile}
      />
    )
  }

  if (screen === 'profile') {
    return (
      <ProfilePage
        onHome={goHome}
        onLogin={goLogin}
        onStart={goHome}
        onProfile={goProfile}
      />
    )
  }

  return (
    <HomePage
      onHome={goHome}
      onLogin={goLogin}
      onProfile={goProfile}
    />
  )
}

export default App