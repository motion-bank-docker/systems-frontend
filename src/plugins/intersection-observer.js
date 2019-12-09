export default ({ Vue }) => {
  Vue.directive('intersection-observer', {
    // bind: function (el) {
    bind: function (el, binding, vnode) {
      console.log('binding', binding.expression)
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
            console.log(vnode)
            console.log(binding.expression)
            console.log('=======')
            // console.log(entry)
            // console.log(el.dataset)
            // console.log('########')
          }
          else {
            el.dataset.left = entry.boundingClientRect.left

            // console.log(entry)
            // console.log(el.dataset)
            // console.log('--------')
          }
        })
      }
    }
  })
}
