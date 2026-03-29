import { useState } from 'react'
import { omit, uniqueId } from 'lodash'

import Nav from './Nav.jsx'
import PaneContainer from './PaneContainer.jsx'

const createPane = (id, parentId = null, level = 0) => ({
  id,
  parentId,
  level,
  direction: null,
  children: [],
})

const App = () => {
  const [panes, setPanes] = useState({ root: createPane('root') })

  const handleSplit = (pane, direction) => {
    setPanes((prev) => {
      const id1 = uniqueId('node')
      const id2 = uniqueId('node')

      return  {
        ...prev,
        [id1]: createPane(id1, pane.id, pane.level + 1),
        [id2]: createPane(id2, pane.id, pane.level + 1),
        [pane.id]: {
          ...prev[pane.id],
          direction,
          children: [id1, id2],
        },
      }
    })
  }

  const handleRemove = (pane) => {
    setPanes((prev) => {
      const parentId = prev[pane.id].parentId
      const parent = prev[parentId]

      return {
        ...omit(prev, parent.children),
        [parentId]: {
          ...prev[parentId],
          direction: null,
          children: [],
        },
      }
    })
  }

  return (
    <main>
      <Nav />
      <div className="d-flex vh-100">
        <PaneContainer id="root" panes={panes} onSplit={handleSplit} onRemove={handleRemove} />
      </div>
    </main>
  )
}

export default App
