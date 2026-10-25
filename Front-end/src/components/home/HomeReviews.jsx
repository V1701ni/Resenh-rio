import { useMemo } from 'react'
import { homeReviews } from '../../data/homeData'
import { getHomeImage, getProfileImage } from '../../utils/assetLoader'

export function HomeReviews({ query = '' }) {
  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase()

    if (!search) return homeReviews

    return homeReviews.filter((item) =>
      `${item.title} ${item.reviewer} ${item.copy} ${item.year}`
        .toLowerCase()
        .includes(search)
    )
  }, [query])

  const renderCover = (cover) => {
    if (
      typeof cover === 'string' &&
      (cover.startsWith('http') || cover.startsWith('/'))
    ) {
      return cover
    }

    return getHomeImage(cover)
  }

  return (
    <section className="home-reviews" id="avaliacoes">
      <header className="home-reviews-heading">
        <div>
          <span className="home-reviews-eyebrow">
            DA COMUNIDADE RESENHÁRIO
          </span>
          <h2>Avaliações</h2>
          <p>
            Histórias, opiniões e diferentes formas de enxergar uma obra.
          </p>
        </div>

        <span className="home-reviews-count">
          {String(filtered.length).padStart(2, '0')} RESENHAS
        </span>
      </header>

      <div className="home-reviews-grid">
        {filtered.length ? (
          filtered.map((item) => {
            const rating = Math.max(0, Math.min(5, Number(item.rating) || 0))

            return (
              <article className="home-review-card" key={item.id || item.title}>
                <div className="home-review-author">
                  <img
                    src={getProfileImage(item.avatar)}
                    alt={`Avatar de ${item.reviewer}`}
                    loading="lazy"
                  />

                  <div className="home-review-author-info">
                    <strong>{item.reviewer}</strong>
                    <span>MEMBRO DA COMUNIDADE</span>
                  </div>

                  <span className="home-review-quote-mark" aria-hidden="true">
                    “
                  </span>
                </div>

                <div className="home-review-work">
                  <img
                    className="home-review-cover"
                    src={renderCover(item.cover)}
                    alt={`Capa de ${item.title}`}
                    loading="lazy"
                  />

                  <div className="home-review-work-info">
                    <span className="home-review-label">RESENHA DE</span>
                    <h3>{item.title}</h3>
                    <span className="home-review-year">{item.year}</span>

                    <div
                      className="home-review-rating"
                      aria-label={`${rating} de 5 estrelas`}
                    >
                      <span aria-hidden="true">
                        {'★'.repeat(rating)}
                        {'☆'.repeat(5 - rating)}
                      </span>
                      <small>{rating}/5</small>
                    </div>
                  </div>
                </div>

                <div className="home-review-divider" />

                <p className="home-review-copy">{item.copy}</p>

                <footer className="home-review-footer">
                  <span className="home-review-stat">
                    <span aria-hidden="true">♡</span>
                    {item.likes || '0 curtidas'}
                  </span>

                  <span className="home-review-stat">
                    <span aria-hidden="true">▤</span>
                    {item.comments || '0 comentários'}
                  </span>
                </footer>
              </article>
            )
          })
        ) : (
          <p className="home-empty-state">
            Nenhuma avaliação encontrada para “{query}”.
          </p>
        )}
      </div>

      <div className="home-reviews-bottom">
        <span />
        <p>UMA OBRA. MUITOS OLHARES.</p>
        <span />
      </div>
    </section>
  )
}