import { useEffect, useState } from 'react'
import { heroStories } from '../../data/homeData'
import { getHomeImage } from '../../utils/assetLoader'

export function HomeHero() {
  const [heroIndex, setHeroIndex] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setHeroIndex((current) => (current + 1) % heroStories.length)
    }, 10000)

    return () => window.clearInterval(timer)
  }, [])

  const heroStory = heroStories[heroIndex]

  // Render title safely splitting on \n if present
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
    <section className="home-hero" id="inicio">
      <img
        key={heroStory.image}
        src={getHomeImage(heroStory.image)}
        alt={heroStory.alt}
      />

      <div className="home-hero-copy">
        <span>EM DESTAQUE</span>

        <h1 key={`title-${heroIndex}`}>{renderTitle(heroStory.title)}</h1>

        <p key={`text-${heroIndex}`}>{heroStory.text}</p>

        <button className="home-read-more" type="button">
          LEIA MAIS
        </button>
      </div>
    </section>
  )
}
