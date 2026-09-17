import { useEffect, useRef, useState } from 'react'

import './App.css'

import loginBackground from './assets/37066e4f-70b1-4da2-8b41-7d133691ba78.png'
import profileIcon from './assets/659d4d1f-3c37-4643-b12d-2ed7aad0b9f4.svg'

const profileAssets = import.meta.glob(
  './assets/profile-*.png',
  { eager: true, query: '?url', import: 'default' }
)

const image = (number) =>
  profileAssets[`./assets/profile-${number}.png`]

const homeAssets = import.meta.glob(
  './assets/home-*',
  { eager: true, query: '?url', import: 'default' }
)

const homeImage = (name) =>
  homeAssets[`./assets/home-${name}`]

const movies = [5, 6, 7, 8, 9, 10]
const books = [11, 12, 13, 14, 15, 16]


function SearchBox({ onSearch }) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  const updateValue = (event) => {
    const nextValue = event.target.value
    setValue(nextValue)
    onSearch?.(nextValue.trim())
  }

  const close = () => {
    setValue('')
    onSearch?.('')
    setOpen(false)
  }

  return (
    <form
      className={`nav-search${open ? ' open' : ''}`}
      onSubmit={(event) => {
        event.preventDefault()
        onSearch?.(value.trim())
      }}
    >
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={updateValue}
        onKeyDown={(event) => {
          if (event.key === 'Escape') close()
        }}
        placeholder="Pesquisar"
        aria-label="Pesquisar"
      />

      <button
        type="button"
        aria-label={open ? 'Fechar pesquisa' : 'Abrir pesquisa'}
        title={open ? 'Fechar pesquisa' : 'Pesquisar'}
        onClick={() => open ? close() : setOpen(true)}
      >
        <span className="search-icon" aria-hidden="true" />
      </button>
    </form>
  )
}


function Navigation({
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
          onClick={(event) =>
            navigateToHomeSection(event, 'inicio')
          }
        >
          INÍCIO
        </a>

        <a
          href="#filmes"
          onClick={(event) =>
            navigateToHomeSection(event, 'filmes')
          }
        >
          FILMES
        </a>

        <a
          href="#livros"
          onClick={(event) =>
            navigateToHomeSection(event, 'livros')
          }
        >
          LIVROS
        </a>

        <a
          href="#noticias"
          onClick={(event) =>
            navigateToHomeSection(event, 'noticias')
          }
        >
          NOTÍCIAS
        </a>

        <button
          className={
            profileActive
              ? 'nav-button active'
              : 'nav-button'
          }
          onClick={onProfile}
        >
          PERFIL
        </button>

        <SearchBox onSearch={onSearch} />

      </nav>
    </header>
  )
}


function Login({ onHome, onProfile, onLogin }) {
  return (
    <main className="login-page">

      <div
        className="login-background"
        aria-hidden="true"
      >
        <img src={loginBackground} alt="" />
      </div>

      <Navigation
        onHome={onHome}
        onLogin={onLogin}
        onStart={onHome}
        onProfile={onProfile}
      />

      <section
        className="login-copy"
        aria-labelledby="login-copy-title"
      >
        <h2 id="login-copy-title">
          Monte sua estante
          <br />
          e compartilhe suas histórias.
        </h2>

        <p>
          Organize seus filmes e livros favoritos,
          descubra novas histórias e compartilhe suas
          opiniões com outros amantes da cultura.
        </p>
      </section>

      <form
        className="login-card"
        aria-label="Formulário de login"
        onSubmit={(event) => event.preventDefault()}
      >
        <h1>
          Bem-vindo ao
          <br />
          <strong>Resenhário</strong>
        </h1>

        <label className="login-field">
          <img src={profileIcon} alt="" />

          <input
            type="text"
            name="username"
            autoComplete="username"
            placeholder="Usuário"
            aria-label="Usuário"
            required
          />
        </label>

        <label className="login-field">
          <span
            className="password-dots"
            aria-hidden="true"
          >
            •••
          </span>

          <input
            type="password"
            name="password"
            autoComplete="current-password"
            placeholder="Senha"
            aria-label="Senha"
            required
          />
        </label>

        <label className="remember-login">
          <input
            type="checkbox"
            name="remember"
          />
          <span>Lembrar senha</span>
        </label>

        <button
          className="login-submit"
          type="submit"
        >
          Entrar
        </button>

        <p className="register-login">
          Não tem uma conta?{' '}
          <a href="#cadastro">
            Cadastre-se
          </a>
        </p>

        <a
          className="forgot-login"
          href="#recuperar"
        >
          Esqueceu sua senha?
        </a>
      </form>

    </main>
  )
}


function MediaRow({ title, items }) {
  const [start, setStart] = useState(0)
  const [motion, setMotion] = useState('')
  const dragStart = useRef(null)

  const visibleItems = Array.from(
    { length: Math.min(6, items.length) },
    (_, index) =>
      items[(start + index) % items.length]
  )

  const move = (direction) => {
    setStart(
      (current) =>
        (current + direction + items.length) %
        items.length
    )

    setMotion(
      direction > 0 ? 'next' : 'previous'
    )
  }

  const pointerDown = (event) => {
    dragStart.current = event.clientX
  }

  const pointerUp = (event) => {
    if (
      dragStart.current !== null &&
      Math.abs(
        event.clientX - dragStart.current
      ) > 30
    ) {
      move(
        event.clientX < dragStart.current
          ? 1
          : -1
      )
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
          className={`profile-media-track${
            motion ? ` ${motion}` : ''
          }`}
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
                src={image(item)}
                alt={`Capa de ${title.toLowerCase()} ${item}`}
              />

              <p>
                2025 ·{' '}
                <span
                  className="media-rating-star"
                  aria-hidden="true"
                >
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


function ActivityCard({
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
    <article
      className={`activity-card${
        compact ? ' compact' : ''
      }`}
    >
      <div className="activity-top">

        <img src={image(cover)} alt="" />

        <div>
          <h3>{title}</h3>

          <span className="year">
            {year}
          </span>

          <div className="rating">

            <span
              className="stars"
              aria-label={`${rating} de 5 estrelas`}
            >
              {'★'.repeat(rating)}
              {'☆'.repeat(5 - rating)}
            </span>

            <span className="likes">
              {likes} curtidas
            </span>

            <span className="comments">
              {comments} comentários
            </span>

          </div>
        </div>

      </div>

      <p className="activity-copy">
        {children}
      </p>

      <button
        className="activity-read-more"
        type="button"
      >
        LEIA MAIS
      </button>

    </article>
  )
}


function Profile({
  onHome,
  onLogin,
  onStart,
  onProfile
}) {
  return (
    <main className="profile-page">

      <div
        className="hero-background"
        aria-hidden="true"
      />

      <Navigation
        onHome={onHome}
        onLogin={onLogin}
        onStart={onStart}
        onProfile={onProfile}
        profileActive
      />

      <div className="page-content">

        <section className="profile-summary">

          <img
            className="avatar"
            src={image(4)}
            alt="Alejandro Leon"
          />

          <div className="profile-description">

            <h1>Alejandro Leon</h1>

            <p>
              Diretor, comediante, roteirista,
              músico. Bobão. Objetivamente bonito,
              amado por todos.
            </p>

          </div>

          <div className="stats">

            <div>
              <span>SEGUIDORES</span>
              <strong>10.950</strong>
            </div>

            <div>
              <span>LIVROS</span>
              <strong>820</strong>
            </div>

            <div>
              <span>FILMES</span>
              <strong>314</strong>
            </div>

            <div>
              <span>DISCUSSÕES</span>
              <strong>1.555</strong>
            </div>

          </div>

        </section>

        <MediaRow
          title="FILMES RECENTES"
          items={movies}
        />

        <MediaRow
          title="LIVROS RECENTES"
          items={books}
        />

        <section className="activity-section">

          <h2>ATIVIDADE RECENTE</h2>

          <div className="activity-grid">

            <ActivityCard
              cover={2}
              title="Spider-man: Brand New Home"
              year="2026"
              comments="1024"
              likes="10.994"
              rating={5}
            >
              Deixo a seu critério, caro leitor,
              decidir por que um estúdio em meio a
              uma fusão gigantesca com outro estúdio
              optaria por não lançar um thriller
              jurídico extremamente divertido sobre
              uma megacorporação caricaturalmente
              maligna envolvida em conspirações para
              manter o controle monopolista da
              economia por meio de suas conexões
              obscuras com um governo deliberadamente
              ineficaz.
            </ActivityCard>

            <ActivityCard
              cover={3}
              title="Revolução dos Bichos - George Orwell"
              year="1945"
              comments="856"
              likes="9.441"
              rating={4}
              compact
            >
              O melhor drama jurídico ambientado em
              Albuquerque que vi desde... bem, na
              verdade não consigo me lembrar de nenhum
              outro exemplo.
            </ActivityCard>

            <ActivityCard
              cover={5}
              title="Caramelo"
              year="2025"
              comments="734"
              likes="6.218"
              rating={4}
              compact
            >
              Uma história delicada sobre amizade,
              afeto e os encontros que transformam a
              rotina em algo extraordinário.
            </ActivityCard>

            <ActivityCard
              cover={11}
              title="Pai Rico, Pai Pobre"
              year="1997"
              comments="512"
              likes="4.807"
              rating={3}
              compact
            >
              Uma releitura sobre escolhas, disciplina
              e os aprendizados que permanecem atuais
              mesmo depois de tantos anos.
            </ActivityCard>

            <ActivityCard
              cover={7}
              title="Ricos de Amor"
              year="2020"
              comments="391"
              likes="3.654"
              rating={3}
              compact
            >
              Uma comédia romântica leve, com
              personagens que conquistam espaço ao
              longo da história.
            </ActivityCard>

            <ActivityCard
              cover={12}
              title="1984 - George Orwell"
              year="1949"
              comments="1.203"
              likes="8.990"
              rating={5}
              compact
            >
              Uma obra inquietante, atual e
              indispensável para refletir sobre
              liberdade, poder e controle.
            </ActivityCard>

          </div>
        </section>

      </div>
    </main>
  )
}


function HomeMedia({ title, images }) {
  const [start, setStart] = useState(0)
  const [motion, setMotion] = useState('')
  const dragStart = useRef(null)

  const visibleImages = Array.from(
    { length: 6 },
    (_, index) =>
      images[(start + index) % images.length]
  )

  const move = (direction) => {
    setStart(
      (current) =>
        (current + direction + images.length) %
        images.length
    )

    setMotion(
      direction > 0 ? 'next' : 'previous'
    )
  }

  const pointerDown = (event) => {
    dragStart.current = event.clientX
  }

  const pointerUp = (event) => {
    if (
      dragStart.current !== null &&
      Math.abs(
        event.clientX - dragStart.current
      ) > 30
    ) {
      move(
        event.clientX < dragStart.current
          ? 1
          : -1
      )
    }

    dragStart.current = null
  }

  const sectionClass = title.startsWith('FILMES')
    ? 'home-filmes'
    : 'home-livros'

  return (
    <section
      className={`home-media ${sectionClass}`}
    >

      <h2>{title}</h2>

      <div className="home-media-row">

        <button
          type="button"
          onClick={() => move(-1)}
        >
          ‹
        </button>

        <div
          className={`home-media-track${
            motion ? ` ${motion}` : ''
          }`}
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
                src={homeImage(name)}
                alt={`Capa ${title.toLowerCase()} ${
                  index + 1
                }`}
                draggable="false"
              />

              <p>
                <span>2025</span> ·{' '}
                <b aria-hidden="true">★</b>{' '}
                3,8
              </p>
            </article>
          ))}

        </div>

        <button
          type="button"
          onClick={() => move(1)}
        >
          ›
        </button>

      </div>
    </section>
  )
}


function HomeReviews({ query = '' }) {
  const reviews = [
    [
      'activity-1.png',
      'Spider-man: Brand New Home',
      '2026',
      'Deixo a seu critério, caro leitor, decidir por que um estúdio em meio a uma fusão gigantesca com outro estúdio optaria por não lançar um thriller jurídico extremamente divertido.',
      '1024 comentários',
      '2.458 curtidas',
      1,
      'Marina Alves',
      5
    ],
    [
      'activity-2.png',
      'Revolução dos Bichos - George Orwell',
      '1945',
      'O melhor drama jurídico ambientado em Albuquerque que vi desde... bem, na verdade não consigo me lembrar de nenhum outro exemplo.',
      '856 comentários',
      '1.873 curtidas',
      3,
      'Rafael Martins',
      4
    ],
    [
      'film-3.png',
      'Ricos de Amor',
      '2020',
      'Uma história leve e divertida, com personagens carismáticos e uma boa dose de romance para acompanhar a sessão.',
      '438 comentários',
      '946 curtidas',
      5,
      'Beatriz Costa',
      3
    ],
    [
      'book-4.png',
      'A Biblioteca da Meia-Noite',
      '2020',
      'Uma leitura sensível sobre escolhas, possibilidades e as histórias que poderiam ter sido vividas.',
      '672 comentários',
      '1.204 curtidas',
      7,
      'Lucas Ferreira',
      5
    ],
    [
      'film-1.png',
      'Caramelo',
      '2025',
      'Uma história emocionante sobre lealdade, afeto e os laços que surgem nos momentos mais inesperados.',
      '389 comentários',
      '1.086 curtidas',
      2,
      'Camila Rocha',
      4
    ],
    [
      'book-2.png',
      '1984 - George Orwell',
      '1949',
      'Uma leitura indispensável, com uma atmosfera inquietante e reflexões que continuam relevantes.',
      '1.203 comentários',
      '3.947 curtidas',
      6,
      'André Lima',
      5
    ],
    [
      'film-6.png',
      'Código Alarum',
      '2025',
      'Um suspense de ritmo acelerado, com reviravoltas e uma fotografia que prende a atenção.',
      '274 comentários',
      '728 curtidas',
      8,
      'Júlia Mendes',
      3
    ],
    [
      'book-5.png',
      'As Crônicas de Nárnia',
      '1950',
      'Uma aventura fantástica que atravessa gerações com personagens marcantes e muita imaginação.',
      '918 comentários',
      '2.631 curtidas',
      9,
      'Diego Martins',
      4
    ]
  ]

  const filtered = reviews.filter(
    ([, title, , , , , , reviewer]) =>
      !query ||
      `${title} ${reviewer}`
        .toLowerCase()
        .includes(query.toLowerCase())
  )

  return (
    <section className="home-reviews">

      <h2>AVALIAÇÕES RECENTES</h2>

      <div>

        {filtered.length ? (
          filtered.map(
            ([
              cover,
              title,
              year,
              copy,
              comments,
              likes,
              avatar,
              reviewer,
              rating
            ]) => (
              <article key={title}>

                <div className="review-author">
                  <img
                    src={image(avatar)}
                    alt={`Avatar de ${reviewer}`}
                  />
                  <strong>{reviewer}</strong>
                </div>

                <div className="review-content">

                  <div className="review-work">

                    <img
                      src={homeImage(cover)}
                      alt={`Capa de ${title}`}
                    />

                    <div>
                      <h3>{title}</h3>
                      <span>{year}</span>

                      <span
                        className="review-rating"
                        aria-label={`${rating} de 5 estrelas`}
                      >
                        {'★'.repeat(rating)}
                        {'☆'.repeat(5 - rating)}
                      </span>
                    </div>

                  </div>

                  <p>{copy}</p>

                  <div className="review-meta">
                    <span className="review-comments">
                      {comments}
                    </span>

                    <span className="review-likes">
                      {likes}
                    </span>
                  </div>

                  <button
                    className="review-read-more"
                    type="button"
                  >
                    LEIA MAIS
                  </button>

                </div>

              </article>
            )
          )
        ) : (
          <p className="home-empty-state">
            Nenhuma avaliação encontrada para
            “{query}”.
          </p>
        )}

      </div>
    </section>
  )
}


function HomeNews({ query = '' }) {
  const news = [
    [
      'news-1.png',
      'Diretor revela detalhes sobre seu próximo grande projeto',
      'Em entrevista, o cineasta comentou sobre suas principais inspirações e antecipou novidades sobre a produção.'
    ],
    [
      'news-2.png',
      'Clássico do cinema retorna às telas em versão restaurada',
      'Um dos filmes mais marcantes da história do cinema ganhará uma nova exibição com imagem e som restaurados.'
    ],
    [
      'activity-1.png',
      'Novo filme promete surpreender o público',
      'A produção chega aos cinemas cercada de expectativas e com uma história inédita para os fãs.'
    ],
    [
      'activity-2.png',
      'Livro premiado ganhará adaptação para o cinema',
      'A obra que conquistou leitores será levada às telas em uma adaptação aguardada.'
    ],
    [
      'film-5.png',
      'Produção nacional ganha destaque internacional',
      'O novo longa brasileiro chama atenção pela fotografia, pelo elenco e pela força de sua história.'
    ],
    [
      'book-6.png',
      'Leitores elegem as histórias mais marcantes',
      'Uma seleção de livros reúne personagens inesquecíveis e narrativas que continuam conquistando novas gerações.'
    ],
    [
      'film-1.png',
      'Caramelo emociona o público nas primeiras sessões',
      'O novo filme brasileiro reúne humor, afeto e uma narrativa que vem conquistando espectadores de todas as idades.'
    ],
    [
      'book-2.png',
      'Clássico de George Orwell ganha nova edição',
      'A obra chega às livrarias com projeto gráfico renovado e textos de apoio para novos leitores.'
    ],
    [
      'film-6.png',
      'Suspense internacional chega aos cinemas',
      'A produção combina ação, mistério e uma trama envolvente para quem gosta de histórias cheias de reviravoltas.'
    ],
    [
      'book-5.png',
      'Fantasia reúne leitores de diferentes gerações',
      'Uma nova coleção celebra universos fantásticos que continuam inspirando leitores ao redor do mundo.'
    ]
  ]

  const filtered = news.filter(
    ([title, copy]) =>
      !query ||
      `${title} ${copy}`
        .toLowerCase()
        .includes(query.toLowerCase())
  )

  return (
    <section className="home-news">

      <h2>OUTRAS NOTÍCIAS</h2>

      <div className="home-news-grid">

        {filtered.length ? (
          filtered.map(
            ([cover, title, copy]) => (
              <article key={title}>

                <img
                  src={homeImage(cover)}
                  alt={`Imagem da notícia: ${title}`}
                />

                <div>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                  <b>LEIA MAIS</b>
                </div>

              </article>
            )
          )
        ) : (
          <p className="home-empty-state">
            Nenhuma notícia encontrada para
            “{query}”.
          </p>
        )}

      </div>
    </section>
  )
}


function Home({ onHome, onLogin, onProfile }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [heroIndex, setHeroIndex] = useState(0)

  const filmImages = [
    'film-1.png',
    'film-4.png',
    'film-3.png',
    'film-5.png',
    'film-6.png',
    'film-2.png'
  ]

  const bookImages = [
    'book-1.png',
    'book-2.png',
    'book-3.png',
    'book-4.png',
    'book-5.png',
    'book-6.png'
  ]

  const heroStories = [
    {
      image: 'hero.png',
      title: (
        <>
          Homem-Aranha está
          <br />
          de volta aos holofotes
        </>
      ),
      text: 'Confira as últimas novidades sobre o novo filme e tudo o que já foi revelado sobre a próxima aventura do herói.',
      alt: 'Homem-Aranha em destaque'
    },
    {
      image: 'news-1.png',
      title: (
        <>
          Novos detalhes
          <br />
          movimentam o cinema
        </>
      ),
      text: 'Diretor revela suas principais inspirações e prepara o público para uma produção cheia de surpresas.',
      alt: 'Cena de uma produção cinematográfica em destaque'
    },
    {
      image: 'news-2.png',
      title: (
        <>
          Um clássico
          <br />
          volta às telas
        </>
      ),
      text: 'Uma obra marcante do cinema ganha nova exibição com imagem restaurada e uma experiência renovada.',
      alt: 'Imagem de um clássico do cinema em destaque'
    },
    {
      image: 'activity-1.png',
      title: (
        <>
          O público já escolheu
          <br />
          seus favoritos do ano
        </>
      ),
      text: 'Filmes que conquistaram os espectadores aparecem entre os lançamentos mais comentados da temporada.',
      alt: 'Cena de um filme entre os destaques do ano'
    },
    {
      image: 'activity-2.png',
      title: (
        <>
          Livros que ganharam
          <br />
          uma nova vida no cinema
        </>
      ),
      text: 'Adaptações de grandes histórias aproximam leitores e cinéfilos em uma temporada cheia de novidades.',
      alt: 'Imagem de uma adaptação literária em destaque'
    },
    {
      image: 'film-3.png',
      title: (
        <>
          Romance nacional
          <br />
          conquista novos públicos
        </>
      ),
      text: 'A produção brasileira amplia seu alcance com uma história leve, personagens marcantes e muita emoção.',
      alt: 'Imagem de um romance nacional em destaque'
    }
  ]

  useEffect(() => {
    const timer = window.setInterval(() => {
      setHeroIndex(
        (current) =>
          (current + 1) % heroStories.length
      )
    }, 10000)

    return () => window.clearInterval(timer)
  }, [heroStories.length])

  useEffect(() => {
    const section =
      window.location.hash.slice(1)

    if (
      ['filmes', 'livros', 'noticias']
        .includes(section)
    ) {
      requestAnimationFrame(() => {

        const selector =
          section === 'noticias'
            ? '.home-news'
            : `.home-${section}`

        document
          .querySelector(selector)
          ?.scrollIntoView({
            block: 'start'
          })
      })
    }
  }, [])

  const scrollToSection = (section) => {

    if (section === 'inicio') {

      window.history.replaceState(
        null,
        '',
        '#inicio'
      )

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })

      return
    }

    const target =
      section === 'noticias'
        ? '.home-news'
        : `.home-${section}`

    document
      .querySelector(target)
      ?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })

    window.history.replaceState(
      null,
      '',
      `#${section}`
    )
  }

  const heroStory =
    heroStories[heroIndex]

  return (
    <main className="home-page">

      <section
        className="home-hero"
        id="inicio"
      >

        <img
          key={heroStory.image}
          src={homeImage(heroStory.image)}
          alt={heroStory.alt}
        />

        <div className="home-hero-copy">

          <span>EM DESTAQUE</span>

          <h1 key={`title-${heroIndex}`}>
            {heroStory.title}
          </h1>

          <p key={`text-${heroIndex}`}>
            {heroStory.text}
          </p>

          <button
            className="home-read-more"
            type="button"
          >
            LEIA MAIS
          </button>

        </div>

      </section>

      <Navigation
        onHome={onHome}
        onLogin={onLogin}
        onStart={scrollToSection}
        onProfile={onProfile}
        onSearch={setSearchQuery}
      />

      <div className="home-content">

        <HomeMedia
          title="FILMES EM ALTA"
          images={filmImages}
        />

        <HomeMedia
          title="LIVROS EM ALTA"
          images={bookImages}
        />

        <HomeReviews
          query={searchQuery}
        />

        <HomeNews
          query={searchQuery}
        />

      </div>

    </main>
  )
}


// ==================================================
// APP — NAVEGAÇÃO ENTRE INÍCIO E PERFIL
// ==================================================

function App() {

  const [screen, setScreen] = useState('home')

  // INÍCIO
  const goHome = () => {
    setScreen('home')

    window.history.replaceState(
      null,
      '',
      '#inicio'
    )

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  // LOGIN
  const goLogin = () => {
    setScreen('login')

    window.history.replaceState(
      null,
      '',
      '#login'
    )

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  // PERFIL
  const goProfile = () => {
    setScreen('profile')

    window.history.replaceState(
      null,
      '',
      '#perfil'
    )

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  // Se estiver no Login
  if (screen === 'login') {
    return (
      <Login
        onHome={goHome}
        onLogin={goLogin}
        onProfile={goProfile}
      />
    )
  }

  // Se estiver no Perfil
  if (screen === 'profile') {
    return (
      <Profile
        onHome={goHome}
        onLogin={goLogin}
        onStart={goHome}
        onProfile={goProfile}
      />
    )
  }

  // Se estiver na Home
  return (
    <Home
      onHome={goHome}
      onLogin={goLogin}
      onProfile={goProfile}
    />
  )
}

export default App