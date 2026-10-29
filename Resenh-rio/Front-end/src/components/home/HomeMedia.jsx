import { useRef, useState } from 'react'
import { getHomeImage } from '../../utils/assetLoader'

export function HomeMedia({ title, images }) {
  const [start, setStart] = useState(0)
  const [motion, setMotion] = useState('')
  const dragStart = useRef(null)

  const visibleImages = Array.from(
    { length: Math.min(6, images.length) },
    (_, index) => images[(start + index) % images.length]
  )

  const move = (direction) => {
    setStart((current) => (current + direction + images.length) % images.length)
    setMotion(direction > 0 ? 'next' : 'previous')
  }

  const pointerDown = (event) => {
    dragStart.current = event.clientX
  }

  const pointerUp = (event) => {
    if (
      dragStart.current !== null &&
      Math.abs(event.clientX - dragStart.current) > 30
    ) {
      move(event.clientX < dragStart.current ? 1 : -1)
    }
    dragStart.current = null
  }

  const sectionClass = title.startsWith('FILMES')
    ? 'home-filmes'
    : 'home-livros'

  return (
    <section className={`home-media ${sectionClass}`}>
      <h2>{title}</h2>

      <div className="home-media-row">
        <button type="button" onClick={() => move(-1)}>
          ‹
        </button>

        <div
          className={`home-media-track${motion ? ` ${motion}` : ''}`}
          onPointerDown={pointerDown}
          onPointerUp={pointerUp}
          onPointerCancel={() => {
            dragStart.current = null
          }}
        >
          {visibleImages.map((name, index) => (
            <article
              className="home-media-item"
              key={`${start}-${name}-${index}`}
            >
              <img
                src={getHomeImage(name)}
                alt={`Capa ${title.toLowerCase()} ${index + 1}`}
                draggable="false"
              />

              <p>
                <span>2025</span> · <b aria-hidden="true">★</b> 3,8
              </p>
            </article>
          ))}
        </div>

        <button type="button" onClick={() => move(1)}>
          ›
        </button>
      </div>
    </section>
  )
}
