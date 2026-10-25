
import '../styles/profile.css'
import { useState } from 'react'
import { Navigation } from '../components/common/Navigation'
import { ActivityCard } from '../components/profile/ActivityCard'
import { MediaRow } from '../components/profile/MediaRow'
import { ProfileSummary } from '../components/profile/ProfileSummary'
import {
  profileActivities,
  profileBooks,
  profileMovies,
  profileUser
} from '../data/profileData'
import {
  getUsuarioLogado,
  salvarUsuarioLogado
} from '../services/api'

export function ProfilePage({ onHome, onLogin, onStart, onProfile }) {
  const usuario = getUsuarioLogado()

  const [editando, setEditando] = useState(false)
  const [nome, setNome] = useState(usuario?.nome || '')
  const [bio, setBio] = useState(
    usuario?.bio || 'Bem-vindo(a) ao seu perfil no Resenhário.'
  )
  const [fotoUrl, setFotoUrl] = useState(usuario?.fotoUrl || '')
  const [bannerUrl, setBannerUrl] = useState(usuario?.bannerUrl || '')

  const user = usuario
    ? {
        ...profileUser,
        name: nome || usuario.nome,
        bio,
        avatar: fotoUrl || '',
        banner: bannerUrl || ''
      }
    : profileUser

  function salvarEdicao(event) {
    event.preventDefault()

    salvarUsuarioLogado({
      ...usuario,
      nome,
      bio,
      fotoUrl,
      bannerUrl
    })

    setEditando(false)
    window.location.reload()
  }

  const editButton = usuario ? (
    <button
      className="profile-edit-link"
      type="button"
      onClick={() => setEditando(!editando)}
    >
      {editando ? 'CANCELAR' : 'EDITAR PERFIL'}
    </button>
  ) : null

  return (
    <main className="profile-page">
      <div className="hero-background" aria-hidden="true" />

      <Navigation
        onHome={onHome}
        onLogin={onLogin}
        onStart={onStart}
        onProfile={onProfile}
        profileActive
      />

      <div className="page-content">
        <ProfileSummary user={user} editButton={editButton} />

        {editando && (
          <form className="profile-edit-form" onSubmit={salvarEdicao}>
            <h2>Editar perfil</h2>

            <label htmlFor="profile-name">Nome</label>
            <input
              id="profile-name"
              type="text"
              value={nome}
              onChange={(event) => setNome(event.target.value)}
              required
              maxLength={100}
            />

            <label htmlFor="profile-bio">Bio</label>
            <textarea
              id="profile-bio"
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              rows={3}
              maxLength={150}
              placeholder="Conte um pouco sobre você..."
            />

            <label htmlFor="profile-avatar">URL da foto de perfil</label>
            <input
              id="profile-avatar"
              type="url"
              value={fotoUrl}
              onChange={(event) => setFotoUrl(event.target.value)}
              placeholder="https://..."
            />

            <label htmlFor="profile-banner">URL do banner</label>
            <input
              id="profile-banner"
              type="url"
              value={bannerUrl}
              onChange={(event) => setBannerUrl(event.target.value)}
              placeholder="https://..."
            />

            <button type="submit">Salvar alterações</button>
          </form>
        )}

        <MediaRow title="FILMES RECENTES" items={profileMovies} />

        <MediaRow title="LIVROS RECENTES" items={profileBooks} />

        <section className="activity-section">
          <h2>ATIVIDADE RECENTE</h2>

          <div className="activity-grid">
            {profileActivities.map((act) => (
              <ActivityCard
                key={act.id}
                cover={act.cover}
                title={act.title}
                year={act.year}
                comments={act.comments}
                likes={act.likes}
                rating={act.rating}
                compact={act.compact}
              >
                {act.content}
              </ActivityCard>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
