import { ObjectUtil } from 'mbjs-utils'
import sift from 'sift'

class Vocabulary {
  constructor (data = {}) {
    this._namespace = data.namespace || ObjectUtil.uuidNamespaces.NULL
    this._uuid = data.uuid || ObjectUtil.uuid5(ObjectUtil.uuid4(), this._namespace)
    this._title = data.title
    this._entries = [].concat(data._entries) || []

    for (let entry of this._entries) {
      if (!entry.uuid) entry.uuid = ObjectUtil.uuid5(entry.value, this._uuid)
      if (!entry.id) entry.id = `${this.id}/${entry.uuid}`
    }
  }

  /**
   * Methods
   */

  find (query) {
    return sift(query, this.entries)
  }

  get (id) {
    for (let entry of this.entries) {
      if (entry.id === id) return entry
    }
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

  get id () {
    return `${process.env.VOCABULARY_BASE_URI}${this._uuid}`
  }

  get title () {
    return this._title
  }

  get slug () {
    return ObjectUtil.slug(this.title, false)
  }
}

class VocabularyCollection {
  constructor (templates) {
    this._vocabularies = []
    const _this = this
    Object.keys(templates).forEach(key => {
      const vocabulary = Vocabulary.fromTemplate(templates[key])
      _this._vocabularies.push(vocabulary)
    })
  }

  /**
   * Methods
   */

  find (query) {
    return sift(query, this.vocabularies)
  }

  get (id) {
    for (let entry of this.vocabularies) {
      if (entry.id === id) return entry
    }
  }

  /**
   * Getters
   */

  get vocabularies () {
    return this._vocabularies
  }
}

export default ({ Vue }) => {
  const templates = require('../vocabularies')
  Vue.prototype.$vocabularies = new VocabularyCollection(templates)
}
