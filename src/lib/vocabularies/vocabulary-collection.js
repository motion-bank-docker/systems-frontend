import sift from 'sift'
import { Vocabulary } from './index'

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

  find (query = {}) {
    const _this = this
    return new Promise(resolve => resolve(sift(query, _this._vocabularies)))
  }

  get (id) {
    const _this = this
    return new Promise(resolve => {
      for (let entry of _this._vocabularies) {
        if (entry.id === id) return resolve(entry)
      }
    })
  }

  async getEntry (id) {
    const
      uriPath = id.split('/'),
      vocabularyId = uriPath.slice(0, uriPath.length - 1).join('/'),
      vocabulary = await this.get(vocabularyId),
      entry = await vocabulary.get(id)
    return entry
  }

  /**
   * Getters
   */

  get vocabularies () {
    return this._vocabularies
  }
}

export default VocabularyCollection
