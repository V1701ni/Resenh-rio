
import { useEffect, useState } from 'react'
import { Navigation } from '../components/common/Navigation'
import { HomeHero } from '../components/home/HomeHero'
import { HomeMedia } from '../components/home/HomeMedia'
import { HomeNews } from '../components/home/HomeNews'
import { HomeReviews } from '../components/home/HomeReviews'
import { bookImages, filmImages } from '../data/homeData'
import { buscarLivrosGoogle } from '../services/api'

export function HomePage({ onHome, onLogin, onProfile }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [livrosGoogle, setLivrosGoogle] = useState([])
  const [carregandoLivros, setCarregandoLivros] = useState(false)
  const [erroLivros, setErroLivros] = useState('')

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
      window.scrollTo({ top: 0, behavior: 'smooth' })
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

  const pesquisarLivros = async (termo) => {
    setSearchQuery(termo)

    if (!termo) {
      setLivrosGoogle([])
      setErroLivros('')
      setCarregandoLivros(false)
      return
    }

    setCarregandoLivros(true)
    setErroLivros('')
    setLivrosGoogle([])

    try {
      const resultados = await buscarLivrosGoogle(termo)
      setLivrosGoogle(Array.isArray(resultados) ? resultados : [])
    } catch (error) {
      console.error('Erro ao pesquisar livros:', error)
      setErroLivros(
        'Não foi possível buscar livros. Verifique se o backend está funcionando e tente novamente.'
      )
    } finally {
      setCarregandoLivros(false)
    }
  }

  return (
    <main className="home-page">
      <HomeHero />

      <Navigation
        onHome={onHome}
        onLogin={onLogin}
        onStart={scrollToSection}
        onProfile={onProfile}
        onSearch={pesquisarLivros}
      />

      <div className="home-content">
        {searchQuery && (
          <section className="google-books-results">
            <h2>RESULTADOS PARA “{searchQuery}”</h2>

            {carregandoLivros && <p>Buscando livros...</p>}

            {erroLivros && <p role="alert">{erroLivros}</p>}

            {!carregandoLivros &&
              !erroLivros &&
              livrosGoogle.length === 0 && (
                <p>Nenhum livro encontrado.</p>
              )}

            {livrosGoogle.length > 0 && (
              <div className="google-books-grid">
                {livrosGoogle.map((livro, index) => {
                  const info = livro.volumeInfo || {}
                  const capa = info.imageLinks?.thumbnail?.replace(
                    'http://',
                    'https://'
                  )

                  return (
                    <article
                      className="google-book-card"
                      key={livro.id || `${info.title}-${index}`}
                    >
                      {capa ? (
                        <img src={capa} alt={`Capa de ${info.title || 'livro'}`} />
                      ) : (
                        <div className="google-book-no-cover">
                          Sem capa disponível
                        </div>
                      )}

                      <h3>{info.title || 'Título indisponível'}</h3>

                      <p>
                        {info.authors?.join(', ') || 'Autor desconhecido'}
                      </p>

                      {info.infoLink && (
                        <a
                          href={info.infoLink}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Ver livro
                        </a>
                      )}
                    </article>
                  )
                })}
              </div>
            )}
          </section>
        )}

        <HomeMedia title="FILMES EM ALTA" images={filmImages} />
        <HomeMedia title="LIVROS EM ALTA" images={bookImages} />
        <HomeReviews query={searchQuery} />
        <HomeNews query={searchQuery} />
      </div>
    </main>
  )
}
