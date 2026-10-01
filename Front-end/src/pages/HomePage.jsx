import { useEffect, useState } from 'react'
import { Navigation } from '../components/common/Navigation'
import { HomeHero } from '../components/home/HomeHero'
import { HomeMedia } from '../components/home/HomeMedia'
import { HomeNews } from '../components/home/HomeNews'
import { HomeReviews } from '../components/home/HomeReviews'
import { bookImages, filmImages } from '../data/homeData'

export function HomePage({ onHome, onLogin, onProfile }) {
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const section = window.location.hash.slice(1)

    if (['filmes', 'livros', 'noticias'].includes(section)) {
      requestAnimationFrame(() => {
        const selector =
          section === 'noticias' ? '.home-news' : `.home-${section}`

        document.querySelector(selector)?.scrollIntoView({
          block: 'start'
        })
      })
    }
  }, [])

  const scrollToSection = (section) => {
    if (section === 'inicio') {
      window.history.replaceState(null, '', '#inicio')
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
      return
    }

    const target =
      section === 'noticias' ? '.home-news' : `.home-${section}`

    document.querySelector(target)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })

    window.history.replaceState(null, '', `#${section}`)
  }

  return (
    <main className="home-page">
      <HomeHero />

      <Navigation
        onHome={onHome}
        onLogin={onLogin}
        onStart={scrollToSection}
        onProfile={onProfile}
        onSearch={setSearchQuery}
      />

      <div className="home-content">
        <HomeMedia title="FILMES EM ALTA" images={filmImages} />
        <HomeMedia title="LIVROS EM ALTA" images={bookImages} />
        <HomeReviews query={searchQuery} />
        <HomeNews query={searchQuery} />
      </div>
    </main>
  )
}
