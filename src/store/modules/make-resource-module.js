// const sift = require('sift')
import { Assert, ObjectUtil } from 'mbjs-utils'

const makeResourceModule = function (client, resourceName, resourceNamePluralised = undefined) {
  const
    name = resourceName,
    namePlural = resourceNamePluralised || `${name}s`,
    idList = `${resourceName}IDs`

  const makeResourceAction = (action) => {
    return (context, ...args) => {
      context.commit('setPending', action)
      /**
       * Execute action
       */
      return client[action](namePlural, args[0], args.length > 1 ? args[1] : undefined).then(response => {
        console.log(response)
        if (response) {
          context.commit(action, response)
          context.commit('setPending', action, false)
          return response
        }
        else throw new Error(`${action} ${name} failed: empty API response`)
      }).catch(err => {
        context.commit('setPending', action, false)
        throw err
      })
    }
  }

  return {
    namespaced: true,
    state: {
      [namePlural]: [],
      [idList]: [],
      currentItem: undefined,
      currentQuery: undefined,
      isPending: {
        find: false,
        get: false,
        create: false,
        update: false,
        patch: false,
        remove: false
      }
    },
    mutations: {
      find: (state, data) => {
        state[namePlural] = data.items
      },
      get: (state, data) => {
        state.currentItem = data
      },
      create: (state, data) => {
        state[namePlural].push(data)
      },
      update: (state, id, data) => {
        data.uuid = id
        const index = state[idList].indexOf(id)
        if (index > -1) {
          state[namePlural][index] = data
        }
        else throw new Error(`Update ${name} failed: not found`)
      },
      patch: (state, id, data) => {
        data.uuid = id
        const index = state[idList].indexOf(id)
        if (index > -1) {
          state[namePlural][index] = ObjectUtil.merge(state[namePlural][index], data)
        }
        else throw new Error(`Update ${name} failed: not found`)
      },
      setPending: (state, action, status = true) => {
        Assert.isType(status, 'boolean', 'setPending: status must be boolean')
        state.isPending[action] = status
      }
    },
    actions: {
      find: makeResourceAction('find'),
      get: makeResourceAction('get'),
      create: makeResourceAction('create'),
      update: makeResourceAction('update'),
      patch: makeResourceAction('patch'),
      remove: makeResourceAction('remove')
    }
  }
}

export default makeResourceModule
