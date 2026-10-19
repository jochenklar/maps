import { create } from 'zustand'
import { isArray, mergeWith } from 'lodash'

import defaults from '../config/default'
import { isValidMapId } from '../utils/hash'

// the id of a map is the path of its url before the tile coordinates, or the hostname if there is no path,
// e.g. berlin/geoportal/luftbilder/2026-dop20rgb or tile.openstreetmap.org
const getMapId = (url) => {
  const [, hostname, path] = url.match(/^(?:[a-z]+:)?\/\/([^/]+)(.*)$/i) ?? [null, '', url]
  return path.split('{')[0].replace(/^\/+|\/+$/g, '') || hostname.replace(/^\{s\}\./, '')
}

// merge the config into the defaults, arrays are replaced and not merged by index
const mergeConfig = (config) => mergeWith({}, defaults, config, (_, value) => {
  if (isArray(value)) return value
})

// find a map from the config by its id, fall back to the first map if the id is unknown
export const findMap = (groups, id) => {
  const maps = groups?.flatMap((group) => group.maps) ?? []
  return maps.find((map) => map.id === id) ?? maps[0]
}

// the config from maps.config.js merged into the defaults, it is set once by init and not persisted
export const useConfig = create((set) => ({
  init: (config) => {
    const data = mergeConfig(config)
    data.groups = data.groups.map((group) => ({
      ...group,
      maps: group.maps.map((map) => ({ ...map, id: getMapId(map.url) })),
    }))

    const ids = data.groups.flatMap((group) => group.maps).map((map) => map.id)
    ids.forEach((id, index) => {
      if (!isValidMapId(id)) {
        console.warn(`the url path "${id}" of a map can't be used in links`)
      } else if (ids.indexOf(id) !== index) {
        console.warn(`more than one map has the url path "${id}", links will show the first of them`)
      }
    })

    set(data)
  },
}))
