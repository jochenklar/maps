import React, { useEffect, useRef } from 'react'
import classNames from 'classnames'

import { findMap, getThumbnailUrl, useConfig } from '../stores/config'
import { getActivePane, usePanes } from '../stores/panes'
import { useUI } from '../stores/ui'

const Filmstrip = () => {
  const thumbnail = useConfig((s) => s.thumbnail)
  const groups = useConfig((s) => s.groups)

  const panes = usePanes((s) => s.panes)
  const changeMap = usePanes((s) => s.changeMap)
  const activePane = useUI((s) => s.activePane)

  // the filmstrip changes the map of the active pane, findMap falls back to the first map, which is shown
  // for panes without a map
  const pane = getActivePane(panes, activePane)
  const activeId = findMap(groups, pane.map)?.id

  const ref = useRef(null)

  // scroll the selected map into view, e.g. when it was set by a link
  useEffect(() => {
    ref.current.querySelector('.filmstrip-item.active')?.scrollIntoView({
      block: 'nearest', inline: 'nearest', behavior: 'smooth'
    })
  }, [activeId])

  // scroll sideways with the mouse wheel, since the strip can't be scrolled vertically
  const handleWheel = (event) => {
    if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
      ref.current.scrollLeft += event.deltaY
    }
  }

  return (
    <div className="filmstrip d-flex gap-2 p-2 mx-3 bg-white shadow rounded-3" ref={ref} onWheel={handleWheel}>
      {
        groups.flatMap((group) => group.maps).map((map) => (
          <button
            key={map.id}
            className={classNames('filmstrip-item btn p-0 position-relative', { active: map.id === activeId })}
            onClick={() => changeMap(pane, map.id)}
            title={map.name}
          >
            <img className="w-100 h-100" src={getThumbnailUrl(map, thumbnail)} alt="" fetchPriority="low" />
            <span className="filmstrip-name position-absolute bottom-0 end-0 px-1 text-white text-truncate">
              {map.name}
            </span>
          </button>
        ))
      }
    </div>
  )
}

export default Filmstrip
