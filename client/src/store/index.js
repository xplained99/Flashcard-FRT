import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

var init_actions = []
const requireContext = require.context('./modules', false, /.*\.js$/)
const modules = requireContext.keys()
  .map(file =>
    [file.replace(/(^.\/)|(\.js$)/g, ''), requireContext(file)]
  )
  .reduce((modules, [name, module]) => {
    if (module.namespaced === undefined) {
      module.namespaced = true
    }

    init_actions.push(`${name}/init`)
    return { ...modules, [name]: module.default }
  }, {})
  

export default new Vuex.Store({
  getters: {
    cookies_prompt() {
      return Vue.$cookies.get("cookies_ack") != "1"
    },
  },

  actions: {
    async init({dispatch}) {
      await Promise.all(init_actions.map(dispatch));
    }
  },

  modules,
})

Promise.unwrapped = () => {
  let resolve, reject, promise = new Promise((_resolve, _reject) => {
    resolve = _resolve, reject = _reject
  })
  promise.resolve = resolve, promise.reject = reject
  return promise
}

export const app_loading = Promise.unwrapped();