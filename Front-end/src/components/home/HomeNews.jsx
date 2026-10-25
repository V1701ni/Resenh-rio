import { homeNews } from '../../data/homeData'
import { getHomeImage } from '../../utils/assetLoader'

export function HomeNews({ query = '' }) {
  const filtered = homeNews.filter((item) =>
    `${item.title} ${item.copy} ${item.category} ${item.author}`
      .toLowerCase()
      .includes(query.toLowerCase())
  )

  const [featured, ...secondary] = filtered

  return (
    <section className="home-news" id="noticias">
      <header className="home-news-heading">
        <div>
          <span className="home-news-eyebrow">O QUE ESTÁ ACONTECENDO</span>
          <h2>Notícias</h2>
          <p>Novidades do cinema, da literatura e da cultura.</p>
        </div>
        <span className="home-news-count">
          {String(filtered.length).padStart(2, '0')} ARTIGOS
        </span>
      </header>

      {featured ? (
        <>
          <article className="home-news-featured">
            <div className="home-news-featured-image">
              <img
                src={getHomeImage(featured.cover)}
                alt={featured.title}
              />
            </div>

            <div className="home-news-featured-content">
              <div className="home-news-meta">
                <span className="home-news-category">
                  {featured.category}
                </span>
                <span>{featured.date}</span>
              </div>

              <h3>{featured.title}</h3>
              <p>{featured.copy}</p>

              <div className="home-news-byline">
                <span>{featured.author}</span>
              </div>
            </div>
          </article>

          <div className="home-news-subheading">
            <h3>Mais notícias</h3>
            <span>EM DESTAQUE NA CULTURA</span>
          </div>

          <div className="home-news-grid">
            {secondary.map((item) => (
              <article className="home-news-card" key={item.id}>
                <div className="home-news-card-image">
                  <img src={getHomeImage(item.cover)} alt={item.title} />
                  <span className="home-news-image-category">
                    {item.category}
                  </span>
                </div>

                <div className="home-news-card-content">
                  <span className="home-news-date">{item.date}</span>
                  <h4>{item.title}</h4>
                  <p>{item.copy}</p>
                  <span className="home-news-author">{item.author}</span>
                </div>
              </article>
            ))}
          </div>
        </>
      ) : (
        <p className="home-empty-state">
          Nenhuma notícia encontrada para “{query}”.
        </p>
      )}
    </section>
  )
}