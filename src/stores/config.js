import { create } from 'zustand'
import { isArray, mergeWith } from 'lodash'

import defaults from '../config/default'
import { isValidMapId } from '../utils/hash'

// find a map from the config by its id, fall back to the first map if the id is unknown
export const findMap = (groups, id) => {
  const maps = groups?.flatMap((group) => group.maps) ?? []
  return maps.find((map) => map.id === id) ?? maps[0]
}

// the config from maps.config.js merged into the defaults, it is set once by init and not persisted
export const useConfig = create((set) => ({
  init: (config) => {
    // arrays are replaced and not merged by index
    const data = mergeWith({}, defaults, config, (_, value) => {
      if (isArray(value)) return value
    })
    data.groups.flatMap((group) => group.maps).forEach((map) => {
      if (!isValidMapId(map.id ?? '')) {
        console.warn(`map "${map.name}" needs an id with only letters, numbers, "_", "-" and "."`)
      }
    })
    set(data)
  },
}))
