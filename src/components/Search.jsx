import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { useConfig } from '../stores/config'
import { searchPlaces } from '../utils/search'

const Search = ({ onSelect }) => {
  const url = useConfig((s) => s.search.url)

  const [query, setQuery] = useState('')
  const [places, setPlaces] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // the index of the place which is highlighted with the arrow keys, -1 if none
  const [activeIndex, setActiveIndex] = useState(-1)
  const listRef = useRef(null)
  const inputRef = useRef(null)

  // keep the highlighted place visible when the list scrolls
  useEffect(() => {
    listRef.current?.querySelector('.active')?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex])

  const close = () => {
    setPlaces(null)
    setError(null)
    setActiveIndex(-1)
  }

  const handleSelect = (place) => {
    close()
    setQuery(place.display_name)
    onSelect(place)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!query.trim() || loading) return

    close()
    setLoading(true)
    try {
      const results = await searchPlaces(url, query.trim())
      if (results.length === 1) {
        handleSelect(results[0])
      } else {
        setPlaces(results)
      }
    } catch (error) {
      console.warn(error.message)
      setError('The search failed, please try again later.')
    } finally {
      setLoading(false)
    }
  }

  // empty the input, close the results and focus the input again for a new search
  const handleClear = () => {
    close()
    setQuery('')
    inputRef.current.focus()
  }

  // close the results when the focus leaves the search, e.g. by clicking on the map
  const handleBlur = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) close()
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      close()
    } else if (places?.length > 0) {
      // move the highlight with the arrow keys, wrapping around at the ends,
      // and select the highlighted place with enter instead of searching again
      if (event.key === 'ArrowDown') {
        event.preventDefault()
        setActiveIndex((index) => (index + 1) % places.length)
      } else if (event.key === 'ArrowUp') {
        event.preventDefault()
        setActiveIndex((index) => (index <= 0 ? places.length : index) - 1)
      } else if (event.key === 'Enter' && activeIndex >= 0) {
        event.preventDefault()
        handleSelect(places[activeIndex])
      }
    }
  }

  return (
    <div
      className="search-group position-relative mt-3 ms-3 me-3 me-md-auto"
      onBlur={handleBlur} onKeyDown={handleKeyDown}
    >
      <form className="input-group shadow rounded-pill" onSubmit={handleSubmit}>
        <input
          ref={inputRef} type="text" className="form-control rounded-start-pill ps-3" placeholder="Search"
          aria-label="Search" value={query} onChange={(event) => setQuery(event.target.value)}
        />
        {
          query && (
            <button className="btn btn-control" type="button" onClick={handleClear} title="Clear" aria-label="Clear">
              <i className="bi bi-x-lg"></i>
            </button>
          )
        }
        <button
          className="btn btn-control rounded-end-pill" type="submit" disabled={loading}
          title="Search" aria-label="Search"
        >
          {
            loading ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-label="Searching" />
            ) : (
              <i className="bi bi-search"></i>
            )
          }
        </button>
      </form>

      {
        (places || error) && (
          <div
            ref={listRef}
            className="search-results list-group position-absolute w-100 mt-1 shadow rounded-3"
          >
            {error && <div className="list-group-item text-danger">{error}</div>}
            {places?.length === 0 && <div className="list-group-item text-secondary">No places found.</div>}
            {
              places?.map((place, index) => (
                <button
                  key={place.place_id} type="button"
                  className={classNames('list-group-item list-group-item-action', { active: index === activeIndex })}
                  onClick={() => handleSelect(place)}
                  onMouseEnter={() => setActiveIndex(index)}
                >
                  {place.display_name}
                </button>
              ))
            }
            {
              places && (
                <div className="list-group-item search-attribution text-secondary">
                  Search by <a href="https://nominatim.org" target="_blank" rel="noreferrer">Nominatim</a>,
                  data © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">
                    OpenStreetMap contributors
                  </a>
                </div>
              )
            }
          </div>
        )
      }
    </div>
  )
}

Search.propTypes = {
  onSelect: PropTypes.func
}

export default Search
