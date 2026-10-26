import { create } from 'zustand'
import { isArray, isPlainObject, mergeWith } from 'lodash'

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

// the first language of the browser which has strings, e.g. de for de-DE, or english if there is none
const getBrowserLang = (i18n) => {
  const langs = navigator.languages ?? [navigator.language]
  return langs.map((lang) => lang.split('-')[0].toLowerCase()).find((lang) => i18n[lang]) ?? 'en'
}

// a value which is either the same for all languages or given by language like { de, en },
// the latter falls back to english or the first language
const localize = (value, lang) => {
  if (!isPlainObject(value)) return value
  return value[lang] ?? value.en ?? Object.values(value)[0]
}

// find a map from the config by its id, fall back to the first map if the id is unknown
export const findMap = (groups, id) => {
  const maps = groups?.flatMap((group) => group.maps) ?? []
  return maps.find((map) => map.id === id) ?? maps[0]
}

// the config from maps.config.js merged into the defaults, it is set once by init and not persisted
export const useConfig = create((set) => ({
  init: (config) => {
    const data = mergeConfig(config)

    // the strings of the language of the browser, missing strings fall back to english
    data.lang = getBrowserLang(data.i18n)
    data.strings = { ...data.i18n.en, ...data.i18n[data.lang] }

    data.brand.text = localize(data.brand.text, data.lang)
    data.info = localize(data.info, data.lang)
    data.external = data.external.map((external) => ({ ...external, name: localize(external.name, data.lang) }))

    data.groups = data.groups.map((group) => ({
      ...group,
      name: localize(group.name, data.lang),
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
