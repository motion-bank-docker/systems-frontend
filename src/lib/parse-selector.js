import { DateTime } from 'luxon'

const parseSelector = selector => {
  if (typeof selector === 'string') {
    if (selector.indexOf('|') !== -1) {
      const parts = selector.split('|')
      return {
        start: DateTime.fromISO(parts[0]),
        end: DateTime.fromISO(parts[1])
      }
    }
    return {
      start: DateTime.fromISO(selector)
    }
  }
  return selector
}

export default parseSelector
