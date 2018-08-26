import { VocabularyCollection } from '../lib/vocabularies'

export default ({ Vue }) => {
  const templates = require('../vocabularies')
  Vue.prototype.$vocabularies = new VocabularyCollection(templates)
}
