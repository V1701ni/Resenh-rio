import { useEffect, useState } from 'react'
import { heroStories } from '../../data/homeData'
import { getHomeImage } from '../../utils/assetLoader'

export function HomeHero() {
  const [heroIndex, setHeroIndex] = useState(0)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    if (expanded) return

    const timer = window.setInterval(() => {
      setHeroIndex((current) => (current + 1) % heroStories.length)
    }, 10000)

    return () => window.clearInterval(timer)
  }, [expanded])

  const heroStory = heroStories[heroIndex]

  const renderTitle = (title) => {
    const parts = title.split('\n')

    if (parts.length > 1) {
      return (
        <>
          {parts[0]}
          <br />
          {parts[1]}
        </>
      )
    }

    return title
  }

  return (
    <section
      className={`home-hero${expanded ? ' home-hero-expanded' : ''}`}
      id="inicio"
    >
      <img
        key={heroStory.image}
        src={getHomeImage(heroStory.image)}
        alt={heroStory.alt}
      />

      <div className="home-hero-copy">
        <span>EM DESTAQUE</span>

        <h1 key={`title-${heroIndex}`}>
          {renderTitle(heroStory.title)}
        </h1>

        <p>{heroStory.text}</p>

        {expanded && (
          <article className="home-hero-article">
            <header className="home-hero-article-header">
              <p className="home-hero-article-lead">
                {heroStory.fullText || heroStory.text}
              </p>

              
            </header>

            <div className="home-hero-article-body">
              <div className="home-hero-article-section">
                <div>
                  <h2>O que sabemos até agora</h2>
                  <p>{heroStory.fullText || heroStory.text}</p>
                </div>
              </div>

              <div className="home-hero-article-section">
                <div>
                  <h2>Além das primeiras impressões</h2>
                  <p>
                    Uma obra audiovisual é construída por diferentes
                    escolhas: roteiro, direção, fotografia, trilha sonora
                    e interpretação. Observar esses elementos ajuda a
                    compreender como uma produção cria sua identidade e
                    desperta expectativas no público.
                  </p>
                  <p>
                    Para quem acompanha cinema e cultura, essas conversas
                    também são uma oportunidade de comparar perspectivas,
                    revisitar obras anteriores e descobrir novas formas
                    de interpretar uma história.
                  </p>
                </div>
              </div>

              <aside className="home-hero-article-quote">
                <span className="home-hero-quote-mark">“</span>
                <p>
                  Cada história abre espaço para novas interpretações,
                  descobertas e conversas.
                </p>
                
              </aside>

              <div className="home-hero-article-section">
                <div>
                  <h2>Continue explorando</h2>
                  <p>
                    O Resenhário reúne livros, filmes, opiniões e
                    descobertas para quem gosta de ir além da superfície
                    das histórias. Explore as outras seções da página
                    inicial e encontre sua próxima leitura ou sessão.
                  </p>
                </div>
              </div>

              <p className="home-hero-article-note">
                Conteúdo editorial demonstrativo. Informações específicas
                sobre lançamentos e acontecimentos devem ser verificadas
                em fontes confiáveis.
              </p>
            </div>
          </article>
        )}

        <button
          className="home-read-more"
          type="button"
          onClick={() => setExpanded((current) => !current)}
          aria-expanded={expanded}
        >
          {expanded ? 'LER MENOS' : 'LEIA MAIS'}
          <span aria-hidden="true">{expanded ? ' −' : ' +'}</span>
        </button>
      </div>
    </section>
  )
}