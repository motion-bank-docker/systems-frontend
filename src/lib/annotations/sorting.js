import parseSelector from '../parse-selector'

class Sorting {
  static sortOnTarget (a, b) {
    let selectorA, selectorB
    if (typeof a.target.selector.value === 'string') selectorA = parseSelector(a.target.selector.value).start
    else selectorA = a.target.selector.value.start
    if (typeof b.target.selector.value === 'string') selectorB = parseSelector(b.target.selector.value).start
    else selectorB = b.target.selector.value.start
    if (selectorA > selectorB) return 1
    if (selectorA < selectorB) return -1
    return 0
  }
}

export default Sorting
