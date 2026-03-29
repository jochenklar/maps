const PaneNav = ({ pane, onSplit, onRemove }) => {
  return (
    <nav className="position-absolute bottom-0 d-flex">
      <div className="ms-3 mb-3">
        <button className="btn btn-outline-secondary">
          <i className="bi bi-map"></i>
        </button>

        <div className="btn-group ms-2">
          {
            pane.level < 3 && (
              <>
                <button className="btn btn-outline-secondary" onClick={() => onSplit(pane, 'vertical')}>
                  <i className="bi bi-arrows-expand-vertical"></i>
                </button>
                <button className="btn btn-outline-secondary" onClick={() => onSplit(pane, 'horizontal')}>
                  <i className="bi bi-arrows-expand"></i>
                </button>
              </>
            )
          }
          {
            pane.level > 0 && (
              <button className="btn btn-outline-secondary" onClick={() => onRemove(pane)}>
                <i className="bi bi-x-lg"></i>
              </button>
            )
          }
        </div>
      </div>
    </nav>
  )
}

export default PaneNav
