import annotations from './annotations'

const TimelineSelector = annotations.selectors.TimelineSelector

const parseSelector = selector => {
  if (selector.indexOf('|') !== -1) {
    const parts = selector.split('|')
    return {
      start: TimelineSelector.fromISOString(parts[0]),
      end: TimelineSelector.fromISOString(parts[1])
    }
  }
  return {
    start: TimelineSelector.fromISOString(selector)
  }
}

export default parseSelector
