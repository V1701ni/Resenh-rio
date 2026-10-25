import { useEffect, useState } from 'react'
import { Navigation } from '../components/common/Navigation'
import {
  STATUS_ESTANTE,
  adicionarNaEstante,
  atualizarStatusEstante,
  buscarLivros,
  getEstante,
  getUsuarioLogado,
  removerDaEstante
} from '../services/api'

const OPCOES_STATUS_ESTANTE = Object.values(STATUS_ESTANTE)

// A Google Books devolve capas com http://, que o navegador bloqueia em sites https.
function capaSegura(url) {
  return url ? url.replace(/^http:\/\//, 'https://') : null
}

function Capa({ url, titulo }) {
  const src = capaSegura(url)

  if (!src) {
    return (
      <div
        className="estante-capa estante-capa--vazia"
        aria-hidden="true"
      >
        {titulo?.charAt(0) || '?'}
      </div>
    )
  }

  return (
    <img
      className="estante-capa"
      src={src}
      alt={`Capa de ${titulo}`}
      loading="lazy"
    />
  )
}

function ItemEstante({ item, onStatus, onRemover }) {
  return (
    <li className="estante-item">
      <Capa url={item.book.cover} titulo={item.book.title} />

      <div className="estante-info">
        <h3>{item.book.title}</h3>
        <p className="estante-autor">{item.book.author}</p>

        <div className="estante-acoes">
          <label className="estante-label">
            <span>STATUS</span>
            <select
              value={item.status}
              onChange={(event) => onStatus(item, event.target.value)}
            >
              {OPCOES_STATUS_ESTANTE.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            className="estante-link"
            onClick={() => onRemover(item)}
          >
            Remover
          </button>
        </div>
      </div>
    </li>
  )
}

function ResultadoLivro({ book, naEstante, ocupado, onAdicionar }) {
  const [status, setStatus] = useState(STATUS_ESTANTE.QUERO_LER)

  return (
    <li className="estante-item">
      <Capa url={book.cover} titulo={book.title} />

      <div className="estante-info">
        <h3>{book.title}</h3>
        <p className="estante-autor">{book.author}</p>

        {book.synopsis && (
          <p className="estante-sinopse">{book.synopsis}</p>
        )}

        <div className="estante-acoes">
          {naEstante ? (
            <span className="estante-tag">NA SUA ESTANTE</span>
          ) : (
            <>
              <label className="estante-label">
                <span>ADICIONAR COMO</span>
                <select
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                >
                  {OPCOES_STATUS_ESTANTE.map((opcao) => (
                    <option key={opcao} value={opcao}>
                      {opcao}
                    </option>
                  ))}
                </select>
              </label>

              <button
                type="button"
                className="estante-botao"
                disabled={ocupado}
                onClick={() => onAdicionar(book, status)}
              >
                {ocupado ? 'ADICIONANDO...' : 'ADICIONAR'}
              </button>
            </>
          )}
        </div>
      </div>
    </li>
  )
}

export function EstantePage({
  onHome,
  onLogin,
  onProfile,
  onEstante
}) {
  const usuario = getUsuarioLogado()
  const idUsuario = usuario?.idUsuario

  const [itens, setItens] = useState([])
  const [carregando, setCarregando] = useState(Boolean(idUsuario))
  const [filtro, setFiltro] = useState('Todos')

  const [termo, setTermo] = useState('')
  const [resultados, setResultados] = useState([])
  const [buscou, setBuscou] = useState(false)
  const [buscando, setBuscando] = useState(false)
  const [consultaFeita, setConsultaFeita] = useState('')

  const [adicionando, setAdicionando] = useState(null)
  const [aviso, setAviso] = useState(null)

  useEffect(() => {
    if (!idUsuario) {
      setCarregando(false)
      return
    }

    let cancelado = false

    getEstante(idUsuario)
      .then((resposta) => {
        if (cancelado) return

        if (resposta.success) {
          setItens(resposta.items)
        } else {
          setAviso({ tipo: 'erro', texto: resposta.message })
        }
      })
      .catch(() => {
        if (!cancelado) {
          setAviso({
            tipo: 'erro',
            texto: 'Não foi possível carregar sua estante.'
          })
        }
      })
      .finally(() => {
        if (!cancelado) setCarregando(false)
      })

    return () => {
      cancelado = true
    }
  }, [idUsuario])

  const recarregar = async () => {
    const resposta = await getEstante(idUsuario)

    if (resposta.success) {
      setItens(resposta.items)
    }
  }

  const handleBuscar = async (event) => {
    event.preventDefault()

    const consulta = termo.trim()
    if (!consulta) return

    setBuscando(true)
    setAviso(null)

    try {
      const resposta = await buscarLivros(consulta)

      setBuscou(true)
      setConsultaFeita(consulta)

      if (!resposta.success) {
        setResultados([])
        setAviso({ tipo: 'erro', texto: resposta.message })
        return
      }

      setResultados(resposta.books)
    } catch {
      setResultados([])
      setBuscou(true)
      setConsultaFeita(consulta)
      setAviso({
        tipo: 'erro',
        texto: 'Não foi possível buscar os livros.'
      })
    } finally {
      setBuscando(false)
    }
  }

  const handleAdicionar = async (book, status) => {
    setAdicionando(book.id || book.googleId)
    setAviso(null)

    try {
      const resposta = await adicionarNaEstante(book, status)

      if (!resposta.success) {
        setAviso({ tipo: 'erro', texto: resposta.message })
        return
      }

      setAviso({
        tipo: 'ok',
        texto: `“${book.title}” foi adicionado à sua estante.`
      })

      await recarregar()
    } catch {
      setAviso({
        tipo: 'erro',
        texto: 'Não foi possível adicionar o livro à estante.'
      })
    } finally {
      setAdicionando(null)
    }
  }

  const handleStatus = async (item, status) => {
    setAviso(null)

    const resposta = await atualizarStatusEstante(item.id, status)

    if (!resposta.success) {
      setAviso({ tipo: 'erro', texto: resposta.message })
      return
    }

    setItens((atuais) =>
      atuais.map((atual) =>
        atual.id === item.id ? { ...atual, status } : atual
      )
    )
  }

  const handleRemover = async (item) => {
    const confirmou = window.confirm(
      `Remover “${item.book.title}” da sua estante?`
    )

    if (!confirmou) return

    setAviso(null)

    const resposta = await removerDaEstante(item.id)

    if (!resposta.success) {
      setAviso({ tipo: 'erro', texto: resposta.message })
      return
    }

    setItens((atuais) =>
      atuais.filter((atual) => atual.id !== item.id)
    )

    setAviso({
      tipo: 'ok',
      texto: 'Livro removido da estante.'
    })
  }

  const estaNaEstante = (book) =>
    itens.some(
      (item) =>
        (book.id && item.book.id === book.id) ||
        (book.googleId && item.book.googleId === book.googleId)
    )

  const contar = (status) =>
    itens.filter((item) => item.status === status).length

  const itensVisiveis =
    filtro === 'Todos'
      ? itens
      : itens.filter((item) => item.status === filtro)

  return (
    <main className="estante-page">
      <Navigation
        onHome={onHome}
        onLogin={onLogin}
        onStart={onHome}
        onProfile={onProfile}
        onEstante={onEstante}
        estanteActive
      />

      <div className="estante-content">
        <h1>MINHA ESTANTE</h1>

        {!usuario ? (
          <div className="estante-vazio">
            <p>Entre na sua conta para montar a sua estante virtual.</p>
            <button
              type="button"
              className="estante-botao"
              onClick={onLogin}
            >
              ENTRAR
            </button>
          </div>
        ) : (
          <>
            <p className="estante-saudacao">
              Olá, {usuario.nome}. Busque um livro e organize suas leituras.
            </p>

            <form className="estante-busca" onSubmit={handleBuscar}>
              <input
                type="search"
                value={termo}
                onChange={(event) => setTermo(event.target.value)}
                placeholder="Busque por título ou autor"
                aria-label="Buscar livros por título ou autor"
              />

              <button
                type="submit"
                className="estante-botao"
                disabled={buscando}
              >
                {buscando ? 'BUSCANDO...' : 'BUSCAR'}
              </button>
            </form>

            {aviso && (
              <p
                className={`estante-aviso estante-aviso--${aviso.tipo}`}
                role="status"
              >
                {aviso.texto}
              </p>
            )}

            {buscou && (
              <section
                className="estante-secao"
                aria-label="Resultados da busca"
              >
                <h2>RESULTADOS PARA “{consultaFeita}”</h2>

                {resultados.length === 0 ? (
                  <p className="estante-vazio">Nenhum livro encontrado.</p>
                ) : (
                  <ul className="estante-lista">
                    {resultados.map((book, indice) => (
                      <ResultadoLivro
                        key={book.id || book.googleId || indice}
                        book={book}
                        naEstante={estaNaEstante(book)}
                        ocupado={
                          adicionando === (book.id || book.googleId)
                        }
                        onAdicionar={handleAdicionar}
                      />
                    ))}
                  </ul>
                )}
              </section>
            )}

            <section className="estante-secao" aria-label="Seus livros">
              <h2>SEUS LIVROS</h2>

              <div className="estante-filtros" role="tablist">
                {['Todos', ...OPCOES_STATUS_ESTANTE].map((opcao) => (
                  <button
                    key={opcao}
                    type="button"
                    role="tab"
                    aria-selected={filtro === opcao}
                    className={
                      filtro === opcao
                        ? 'estante-filtro ativo'
                        : 'estante-filtro'
                    }
                    onClick={() => setFiltro(opcao)}
                  >
                    {opcao.toUpperCase()} (
                    {opcao === 'Todos' ? itens.length : contar(opcao)})
                  </button>
                ))}
              </div>

              {carregando ? (
                <p className="estante-vazio">Carregando sua estante...</p>
              ) : itensVisiveis.length === 0 ? (
                <p className="estante-vazio">
                  {itens.length === 0
                    ? 'Sua estante está vazia. Busque um livro para começar.'
                    : 'Nenhum livro com este status.'}
                </p>
              ) : (
                <ul className="estante-lista">
                  {itensVisiveis.map((item) => (
                    <ItemEstante
                      key={item.id}
                      item={item}
                      onStatus={handleStatus}
                      onRemover={handleRemover}
                    />
                  ))}
                </ul>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  )
}