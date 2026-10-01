import { useEffect, useState } from 'react'
import { homeReviews as mockHomeReviews } from '../../data/homeData'
import { getReviews } from '../../services/api'
import { getHomeImage, getProfileImage } from '../../utils/assetLoader'

export function HomeReviews({ query = '' }) {
  const [reviewsList, setReviewsList] = useState(mockHomeReviews)

  useEffect(() => {
    let isMounted = true
    async function loadReviews() {
      const data = await getReviews()
      if (isMounted && data) {
        setReviewsList(data)
      }
    }
    loadReviews()
    return () => {
      isMounted = false
    }
  }, [])

  const filtered = reviewsList.filter(
    (item) =>
      !query ||
      `${item.title} ${item.reviewer}`
        .toLowerCase()
        .includes(query.toLowerCase())
  )

  const renderCover = (cover) => {
    if (typeof cover === 'string' && (cover.startsWith('http') || cover.startsWith('/'))) {
      return cover
    }
    return getHomeImage(cover)
  }

  return (
    <section className="home-reviews">
      <h2>AVALIAÇÕES RECENTES</h2>

      <div>
        {filtered.length ? (
          filtered.map((item) => (
            <article key={item.id || item.title}>
              <div className="review-author">
                <img
                  src={getProfileImage(item.avatar)}
                  alt={`Avatar de ${item.reviewer}`}
                />
                <strong>{item.reviewer}</strong>
              </div>

              <div className="review-content">
                <div className="review-work">
                  <img
                    src={renderCover(item.cover)}
                    alt={`Capa de ${item.title}`}
                  />

                  <div>
                    <h3>{item.title}</h3>
                    <span>{item.year}</span>

                    <span
                      className="review-rating"
                      aria-label={`${item.rating} de 5 estrelas`}
                    >
                      {'★'.repeat(item.rating)}
                      {'☆'.repeat(5 - item.rating)}
                    </span>
                  </div>
                </div>

                <p>{item.copy}</p>

                <div className="review-meta">
                  <span className="review-comments">{item.comments}</span>
                  <span className="review-likes">{item.likes}</span>
                </div>

                <button className="review-read-more" type="button">
                  LEIA MAIS
                </button>
              </div>
            </article>
          ))
        ) : (
          <p className="home-empty-state">
            Nenhuma avaliação encontrada para “{query}”.
          </p>
        )}
      </div>
    </section>
  )
}
