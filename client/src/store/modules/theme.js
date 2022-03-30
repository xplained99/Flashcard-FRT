import Vue from 'vue'
import VueCookies from 'vue-cookies'

export default {
    namespaced: true,

    state: {
        theme: VueCookies.get('theme'),
    },

    getters: {
        
    },

    mutations: {    
        switchTheme(state, {theme}) {
            Vue.$cookies.set("theme", theme)
            state.theme = theme
            this._vm.$vs.setTheme(theme)
        },
    },

    actions: {
        async init({dispatch, state}) {
            let theme = state.theme || 'light'
            dispatch('toggleTheme', {theme})
        },

        toggleTheme({commit}, {theme}) {
            commit("switchTheme", {theme})
        },
    }
}