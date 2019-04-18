import { Assert } from 'mbjs-utils'

const filterDuplicates = (acc, val) => {
  if (acc.indexOf(val) === -1) {
    acc.push(val)
    acc.sort()
  }
  return acc
}

const hasTag = (tag, annotations) => {
  for (let annotation of annotations) {
    if (annotation.body.value === tag) return annotation
  }
}

const tags = {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
    async get (context, payload) {
      Assert.isType(payload.id, 'string', 'Payload must be annotation object with ID property')
      const results = await context.dispatch('annotations/find', {
        'target.id': payload.id,
        'body.type': 'TextualBody',
        'body.purpose': 'tagging'
      }, {root: true})
      return Array.isArray(results.items) ? results.items.map(annotation => annotation.body.value) : []
    },
    async getAnnotations (context, payload) {
      Assert.isType(payload.id, 'string', 'Payload must be annotation object with ID property')
      const results = await context.dispatch('annotations/find', {
        'target.id': payload.id,
        'body.type': 'TextualBody',
        'body.purpose': 'tagging'
      }, {root: true})
      return Array.isArray(results.items) ? results.items : []
    },
    async set (context, [target, tags]) {
      Assert.isType(target.id, 'string', 'Target must be annotation object with ID property')
      Assert.ok(Array.isArray(tags), 'Tags must be array')
      tags.forEach(tag => Assert.isType(tag, 'string', 'Tags must be array of strings'))

      tags = tags.reduce(filterDuplicates, [])
      const originalTags = await context.dispatch('getAnnotations', target)
      for (let tag of tags) {
        const existingTag = hasTag(tag, originalTags)
        if (!existingTag) {
          await context.dispatch('annotations/post', {
            target: {
              id: target.id,
              type: 'Annotation'
            },
            body: {
              type: 'TextualBody',
              purpose: 'tagging',
              value: tag
            }
          }, {root: true})
          console.debug('added tag', tag)
        }
      }
      for (let tag of originalTags) {
        if (tags.indexOf(tag.body.value) === -1) {
          await context.dispatch('annotations/delete', tag._uuid, {root: true})
          console.debug('removed tag', tag.body.value)
        }
      }

      return tags
    },
    async list (context) {
      const results = await context.dispatch('annotations/find', {
        'body.type': 'TextualBody',
        'body.purpose': 'tagging'
      }, {root: true})
      const tags = Array.isArray(results.items) ? results.items.map(annotation => annotation.body.value) : []
      return tags.reduce(filterDuplicates, [])
    }
  }
}

export default tags
