import { profileUser } from '../../data/profileData'
import { getProfileImage } from '../../utils/assetLoader'

export function ProfileSummary({
  user = profileUser,
  editButton = null
}) {
  const avatarSrc =
    user.avatar && /^https?:\/\//i.test(user.avatar)
      ? user.avatar
      : getProfileImage(user.avatarId || profileUser.avatarId)

  return (
    <section className="profile-summary">
      {user.banner && (
        <div
          className="profile-banner"
          style={{ backgroundImage: `url("${user.banner}")` }}
          role="img"
          aria-label="Banner do perfil"
        />
      )}

      {editButton}

      <img
        className="avatar"
        src={avatarSrc}
        alt={`Foto de perfil de ${user.name}`}
      />

      <div className="profile-description">
        <div className="profile-name-row">
          <h1>{user.name}</h1>
        </div>

        <p>{user.bio || 'Adicione uma bio ao seu perfil.'}</p>
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