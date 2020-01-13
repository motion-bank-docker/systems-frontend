export default ({ Vue }) => {
  Vue.directive('intersection-observer', {
    bind: function (el, binding, vnode) {
      console.debug('intersection-observer: binding', binding.expression)
      const options = {
        // root: null,
        threshold: '0'
      }
      const observer = new IntersectionObserver(observerCallback, options)
      observer.observe(el)

      function observerCallback (entries) {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            el.dataset.left = 'xxx'
            // vnode.context.$emit('onIntersectionChanged')
            vnode.context.$emit('onIntersectionChanged')
            console.debug('intersection-observer', vnode)
            console.debug('intersection-observer', binding.expression)
            console.debug('intersection-observer', '=======')
          }
          else {
            el.dataset.left = entry.boundingClientRect.left
          }
        })
      }
    }
  })
}
