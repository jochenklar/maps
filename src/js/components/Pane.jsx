import PaneNav from './PaneNav.jsx'

const Pane = ({ pane, onSplit, onRemove }) => {
  return (
    <section className="position-relative flex-fill">
      <div className="pane h-100">
        {pane.level}
      </div>
      <PaneNav pane={pane} onSplit={onSplit} onRemove={onRemove} />
    </section>
  )
}

export default Pane
