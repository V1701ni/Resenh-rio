import { useEffect, useState } from 'react'
import './App.css'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { ProfilePage } from './pages/ProfilePage'

function App() {
  const [screen, setScreen] = useState(() => {
    const hash = window.location.hash.slice(1)
    if (hash === 'login') return 'login'
    if (hash === 'perfil') return 'profile'
    return 'home'
  })

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1)
      if (hash === 'login') {
        setScreen('login')
      } else if (hash === 'perfil') {
        setScreen('profile')
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

  const goProfile = () => {
    setScreen('profile')
    window.history.replaceState(null, '', '#perfil')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (screen === 'login') {
    return (
      <LoginPage
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