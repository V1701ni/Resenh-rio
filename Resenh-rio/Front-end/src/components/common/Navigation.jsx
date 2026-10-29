import { SearchBox } from './SearchBox'

export function Navigation({
  onHome,
  onLogin,
  onStart,
  onProfile,
  onSearch,
  profileActive = false
}) {
  const navigateToHomeSection = (event, section) => {
    event.preventDefault()
    onStart?.(section)
  }

  return (
    <header className="site-header">
      <button
        className="logo-button"
        onClick={onLogin || onHome}
        aria-label="Ir para a tela de login"
      >
        Resenhário
      </button>

      <nav aria-label="Navegação principal">
        <a
          href="#inicio"
          onClick={(event) => navigateToHomeSection(event, 'inicio')}
        >
          INÍCIO
        </a>

        <a
          href="#filmes"
          onClick={(event) => navigateToHomeSection(event, 'filmes')}
        >
          FILMES
        </a>

        <a
          href="#livros"
          onClick={(event) => navigateToHomeSection(event, 'livros')}
        >
          LIVROS
        </a>

        <a
          href="#noticias"
          onClick={(event) => navigateToHomeSection(event, 'noticias')}
        >
          NOTÍCIAS
        </a>

        <button
          className={profileActive ? 'nav-button active' : 'nav-button'}
          onClick={onProfile}
        >
          PERFIL
        </button>

        <SearchBox onSearch={onSearch} />
      </nav>
    </header>
  )
}
