import ContextMenu from './ContextMenu.vue'

export default {
  /**
   * @param {Vue} Vue - Vue instance
   * @param {Object} options
   */
  install(Vue, options = {}) {
    Vue.component('vue-context-menu', ContextMenu)
  }
}
