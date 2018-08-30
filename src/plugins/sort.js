import { DateTime } from 'luxon'

class Sort {
  static onCreatedDesc (a, b) {
    return Sort.onCreated(a, b, -1)
  }
  static onCreated (a, b, mod = 1) {
    const
      dateA = DateTime.fromISO(a.created),
      dateB = DateTime.fromISO(b.created)
    if (dateA > dateB) return 1 * mod
    else if (dateA < dateB) return -1 * mod
    return 0
  }

  static onRefDesc (a, b) {
    return Sort.onRef(a, b, -1)
  }
  static onRef (a, b, mod = 1) {
    const
      dateA = DateTime.fromISO(a.target.selector.value),
      dateB = DateTime.fromISO(b.target.selector.value)
    if (dateA > dateB) return 1 * mod
    else if (dateA < dateB) return -1 * mod
    return 0
  }
}

export default ({ Vue }) => {
  Vue.prototype.$sort = Sort
}
