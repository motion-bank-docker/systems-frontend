import { DateTime } from 'luxon'

class Sort {
  static onCreatedDesc (a, b) {
    return Sort.onCreated(a, b, -1)
  }
  static onCreated (a, b, mod = 1) {
    const
      dateA = a._created,
      dateB = b._created
    if (dateA > dateB) return 1 * mod
    else if (dateA < dateB) return -1 * mod
    return 0
  }

  static onRefDesc (a, b) {
    return Sort.onRef(a, b, -1)
  }
  static onRef (a, b, mod = 1) {
    const
      dateA = a.target.selector._valueMillis,
      dateB = b.target.selector._valueMillis
    if (dateA > dateB) return 1 * mod
    else if (dateA < dateB) return -1 * mod
    return 0
  }

  static onDateValueDesc (a, b) {
    return Sort.onDateValue(a, b, -1)
  }
  static onDateValue (a, b, mod = 1) {
    const
      dateA = DateTime.fromISO(a),
      dateB = DateTime.fromISO(b)
    if (dateA > dateB) return 1 * mod
    else if (dateA < dateB) return -1 * mod
    return 0
  }
}

export default ({ Vue }) => {
  Vue.prototype.$sort = Sort
}
