import TimelineSelector from './selectors/timeline'

class Sorting {
  static sortOnTarget (a, b) {
    const
      dta = a.target && a.target.selector ? TimelineSelector.fromISOString(a.target.selector.value) : null,
      dtb = b.target && b.target.selector ? TimelineSelector.fromISOString(b.target.selector.value) : null
    if (dta && dtb && dta.dateTime > dtb.dateTime) return 1
    if (dta && dtb && dta.dateTime < dtb.dateTime) return -1
    return 0
  }
}

export default Sorting
