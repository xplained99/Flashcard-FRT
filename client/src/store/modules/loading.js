export default {
    namespaced: true,

    state: {
        loader: null,
    },

    getters: {
        
    },

    mutations: {    
        start(state, params) {
            state.loader ? state.loader.close() : null
            state.loader = this._vm.$vs.loading(params)
        },

        stop(state) {
            state.loader ? state.loader.close() : null
            state.loader = null
        }
    },

    actions: {
        async init({commit}) {
            commit('start', {type: 'corners', 'text': 'Loading...'})
        }
    }
}