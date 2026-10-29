import { getProfileImage } from '../../utils/assetLoader'

export function ActivityCard({
  cover,
  title,
  year,
  comments,
  likes,
  rating,
  children,
  compact = false
}) {
  return (
    <article className={`activity-card${compact ? ' compact' : ''}`}>
      <div className="activity-top">
        <img src={getProfileImage(cover)} alt="" />

        <div>
          <h3>{title}</h3>

          <span className="year">{year}</span>

          <div className="rating">
            <span
              className="stars"
              aria-label={`${rating} de 5 estrelas`}
            >
              {'★'.repeat(rating)}
              {'☆'.repeat(5 - rating)}
            </span>

            <span className="likes">{likes} curtidas</span>

            <span className="comments">{comments} comentários</span>
          </div>
        </div>
      </div>

      <p className="activity-copy">{children}</p>

      <button className="activity-read-more" type="button">
        LEIA MAIS
      </button>
    </article>
  )
}
