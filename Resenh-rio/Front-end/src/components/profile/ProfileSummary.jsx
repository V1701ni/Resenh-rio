import { profileUser } from '../../data/profileData'
import { getProfileImage } from '../../utils/assetLoader'

export function ProfileSummary({ user = profileUser }) {
  return (
    <section className="profile-summary">
      <img
        className="avatar"
        src={getProfileImage(user.avatarId)}
        alt={user.name}
      />

      <div className="profile-description">
        <h1>{user.name}</h1>
        <p>{user.bio}</p>
      </div>

      <div className="stats">
        <div>
          <span>SEGUIDORES</span>
          <strong>{user.stats.followers}</strong>
        </div>

        <div>
          <span>LIVROS</span>
          <strong>{user.stats.books}</strong>
        </div>

        <div>
          <span>FILMES</span>
          <strong>{user.stats.movies}</strong>
        </div>

        <div>
          <span>DISCUSSÕES</span>
          <strong>{user.stats.discussions}</strong>
        </div>
      </div>
    </section>
  )
}
