import { ObjectUtil } from 'mbjs-utils'
import sift from 'sift'

class Vocabulary {
  constructor (data = {}) {
    this._namespace = data.namespace || ObjectUtil.uuidNamespaces.NULL
    this._uuid = data._uuid || ObjectUtil.uuid5(ObjectUtil.uuid4(), this._namespace)
    this._title = data.title
    this._entries = data.entries ? [].concat(data.entries) : []

    for (let entry of this._entries) {
      if (!entry._uuid) entry._uuid = ObjectUtil.uuid5(entry.value, this._uuid)
      if (!entry.id) entry.id = `${this.id}/${entry._uuid}`
      entry.key = entry.key || []
    }
  }

  /**
   * Methods
   */

  find (query = {}) {
    const _this = this
    return new Promise(resolve => resolve(sift(query, _this._entries)))
  }

  get (id) {
    const _this = this
    return new Promise(resolve => {
      for (let entry of _this._entries) {
        if (entry.id === id) return resolve(entry)
      }
      resolve()
    })
  }

  addTerm (value, key = undefined) {
    const _this = this
    return new Promise(resolve => {
      const uuid = ObjectUtil.uuid5(value, _this._uuid)
      const entry = {
        value, key, uuid, id: `${_this.id}/${uuid}`
      }
      _this._entries.push(entry)
      resolve(entry)
    })
  }

  setKey (id, key = []) {
    const _this = this
    return new Promise(async resolve => {
      for (let entry of _this._entries) {
        if (entry.id === id) entry.key = [].concat(key)
      }
      resolve()
    })
  }

  /**
   * Statics
   */

  static fromTemplate (template) {
    return new Vocabulary(template)
  }

  /**
   * Getters
   */

  get entries () {
    return this._entries
  }

  get length () {
    return this._entries.length
  }

  get id () {
    return `${process.env.VOCABULARY_BASE_URI}${this._uuid}`
  }

  get uuid () {
    return this._uuid
  }

  get title () {
    return this._title
  }

  get slug () {
    return ObjectUtil.slug(this.title, false)
  }
}

export default Vocabulary
