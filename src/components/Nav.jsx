import React from 'react'
import PropTypes from 'prop-types'

const Nav = ({ onZoom }) => {
  return (
    <nav className="position-absolute top-0 w-100 d-flex">
      <div className="search-group input-group mt-3 ms-3 me-auto">
        <input
          type="text" className="form-control border border-secondary" placeholder="Search"
          aria-label="Search" aria-describedby="search-button" />
        <button className="btn btn-outline-secondary" type="button" id="search-button">
          <i className="bi bi-search"></i>
        </button>
      </div>

      <div className="btn-group mt-3 me-3">
        <button className="btn btn-outline-secondary" onClick={() => onZoom(1)} >
          <i className="bi bi-plus-lg"></i>
        </button>
        <button className="btn btn-outline-secondary" onClick={() => onZoom(-1)} >
          <i className="bi bi-dash-lg"></i>
        </button>
        <button className="btn btn-outline-secondary">
          <i className="bi bi-geo-alt"></i>
        </button>
      </div>
    </nav>
  )
}

Nav.propTypes = {
  onZoom: PropTypes.func
}

export default Nav
