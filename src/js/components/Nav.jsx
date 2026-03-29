const Nav = () => {
  return (
    <nav className="position-absolute top-0 w-100 z-2 d-flex">
      <div className="search-group input-group mt-3 ms-3 me-auto">
        <input
          type="text" className="form-control border border-secondary" placeholder="Search"
          aria-label="Search" aria-describedby="search-button" />
        <button className="btn btn-outline-secondary" type="button" id="search-button">
          <i className="bi bi-search"></i>
        </button>
      </div>

      <div className="btn-group mt-3 me-3">
        <button className="btn btn-outline-secondary">
          <i className="bi bi-plus-lg"></i>
        </button>
        <button className="btn btn-outline-secondary">
          <i className="bi bi-dash-lg"></i>
        </button>
        <button className="btn btn-outline-secondary">
          <i className="bi bi-geo-alt"></i>
        </button>
      </div>
    </nav>
  )
}

export default Nav
