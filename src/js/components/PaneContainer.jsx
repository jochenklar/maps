import Pane from './Pane.jsx'

const PaneContainer = ({ id, panes, onSplit, onRemove }) => {
  const pane = panes[id]

  if (pane.children.length === 0) {
    return <Pane pane={pane} onSplit={onSplit} onRemove={onRemove} />
  }

  const directionClass = pane.direction === 'horizontal' ? (
    'd-flex flex-column flex-fill'
  ) : (
    'd-flex flex-row flex-fill'
  )

  return (
    <div className={directionClass}>
      {
        pane.children.map((childId) => (
          <PaneContainer key={childId} id={childId} panes={panes} onSplit={onSplit} onRemove={onRemove} />
        ))
      }
    </div>
  )
}

export default PaneContainer
