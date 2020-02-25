const queue = {
  namespaced: true,
  state: {
    entries: [],
    isPending: false
  },
  actions: {
    enqueue (context, promise) {
      return new Promise((resolve, reject) => {
        console.debug('queue/enqueue')
        context.commit('add', { promise, resolve, reject })
        context.dispatch('dequeue')
      })
    },
    async dequeue (context) {
      if (context.state.isPending) return

      context.commit('setPending', true)
      const entry = await context.dispatch('getNext')
      if (entry) {
        console.debug('queue/dequeue', entry)
        try {
          const items = await entry.promise
          entry.resolve(items)
        }
        catch (err) {
          entry.reject(err)
        }
        context.commit('setPending', false)
        context.dispatch('dequeue')
      }
      else context.commit('setPending', false)
    },
    getNext (context) {
      const entry = context.state.entries.length ? context.state.entries[0] : undefined
      context.commit('next')
      return entry
    }
  },
  mutations: {
    add (state, item) {
      state.entries.push(item)
    },
    next (state) {
      state.entries.shift()
    },
    setPending (state, status) {
      state.isPending = status
    }
  }
}

export default queue
