import { homeNews } from '../../data/homeData'
import { getHomeImage } from '../../utils/assetLoader'

export function HomeNews({ query = '' }) {
  const filtered = homeNews.filter(
    (item) =>
      !query ||
      `${item.title} ${item.copy}`
        .toLowerCase()
        .includes(query.toLowerCase())
  )

  return (
    <section className="home-news">
      <h2>OUTRAS NOTÍCIAS</h2>

      <div className="home-news-grid">
        {filtered.length ? (
          filtered.map((item) => (
            <article key={item.id || item.title}>
              <img
                src={getHomeImage(item.cover)}
                alt={`Imagem da notícia: ${item.title}`}
              />

              <div>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
                <b>LEIA MAIS</b>
              </div>
            </article>
          ))
        ) : (
          <p className="home-empty-state">
            Nenhuma notícia encontrada para “{query}”.
          </p>
        )}
      </div>
    </section>
  )
}
