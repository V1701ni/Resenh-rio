import { useRef, useState } from 'react'
import { getProfileImage } from '../../utils/assetLoader'

export function MediaRow({ title, items }) {
  const [start, setStart] = useState(0)
  const [motion, setMotion] = useState('')
  const dragStart = useRef(null)

  const visibleItems = Array.from(
    { length: Math.min(6, items.length) },
    (_, index) => items[(start + index) % items.length]
  )

  const move = (direction) => {
    setStart((current) => (current + direction + items.length) % items.length)
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

  return (
    <section className="media-section">
      <h2>{title}</h2>

      <div className="profile-media-row">
        <button
          type="button"
          aria-label={`Anterior: ${title}`}
          onClick={() => move(-1)}
        >
          ‹
        </button>

        <div
          className={`profile-media-track${motion ? ` ${motion}` : ''}`}
          onPointerDown={pointerDown}
          onPointerUp={pointerUp}
          onPointerCancel={() => {
            dragStart.current = null
          }}
        >
          {visibleItems.map((item, index) => (
            <article
              className="media-item"
              key={`${start}-${item}-${index}`}
            >
              <img
                src={getProfileImage(item)}
                alt={`Capa de ${title.toLowerCase()} ${item}`}
              />

              <p>
                2025 ·{' '}
                <span className="media-rating-star" aria-hidden="true">
                  ★
                </span>{' '}
                3,8
              </p>
            </article>
          ))}
        </div>

        <button
          type="button"
          aria-label={`Próximo: ${title}`}
          onClick={() => move(1)}
        >
          ›
        </button>
      </div>
    </section>
  )
}
