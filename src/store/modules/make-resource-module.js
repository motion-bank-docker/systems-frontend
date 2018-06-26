// const sift = require('sift')
import { Assert } from 'mbjs-utils'

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
        if (response.data) {
          context.commit(action, response.data)
          context.commit('setPending', action, false)
          return response.data
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
      create: (state, data) => {
        state[name].push(data)
      },
      update: (state, id, data) => {
        data.uuid = id
        const index = state[idList].indexOf(id)
        if (index > -1) {
          state[namePlural][index] = data
        }
        else throw new Error(`Update ${name} failed: not found`)
      },
      setPending: (state, action, status) => {
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
