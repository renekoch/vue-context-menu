import ContextMenu from './ContextMenu.vue';

export {ContextMenu};
export default {
  /**
   * @param {Object} Vue - Vue instance
   * @param {Object} options
   */
  install(Vue, options = {}) {
    Vue.component(options.tag || 'vue-context-menu', ContextMenu);
  },
};
