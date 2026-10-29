
import { useEffect, useRef, useState } from 'react'

export function SearchBox({ onSearch }) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  const close = () => {
    setValue('')
    onSearch?.('')
    setOpen(false)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    onSearch?.(value.trim())
  }

  return (
    <form
      className={`nav-search${open ? ' open' : ''}`}
      onSubmit={handleSubmit}
    >
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Escape') close()
        }}
        placeholder="Pesquisar livros"
        aria-label="Pesquisar livros"
      />

      <button
        type="button"
        aria-label={open ? 'Fechar pesquisa' : 'Abrir pesquisa'}
        title={open ? 'Fechar pesquisa' : 'Pesquisar'}
        onClick={() => (open ? close() : setOpen(true))}
      >
        <span className="search-icon" aria-hidden="true" />
      </button>
    </form>
  )
}
