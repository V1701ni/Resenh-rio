import { useEffect, useRef, useState } from 'react'

export function SearchBox({ onSearch }) {
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
        onClick={() => (open ? close() : setOpen(true))}
      >
        <span className="search-icon" aria-hidden="true" />
      </button>
    </form>
  )
}
