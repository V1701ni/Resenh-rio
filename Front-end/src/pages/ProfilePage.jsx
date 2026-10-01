import { Navigation } from '../components/common/Navigation'
import { ActivityCard } from '../components/profile/ActivityCard'
import { MediaRow } from '../components/profile/MediaRow'
import { ProfileSummary } from '../components/profile/ProfileSummary'
import { profileActivities, profileBooks, profileMovies } from '../data/profileData'

export function ProfilePage({ onHome, onLogin, onStart, onProfile }) {
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
        <ProfileSummary />

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
