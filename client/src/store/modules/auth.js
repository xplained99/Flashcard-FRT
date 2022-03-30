import Vue from 'vue'
import auth from '@/services/api/auth'

export default {
    namespaced: true,

    state: {
        logged_in: false,
        user_data: null,
        refresh_token: null,
        access_token: null,
        store_refresh_token: false,
    },

    getters: {
        access_token(state) {
            return Vue.$cookies.get("access_token") || state.access_token
        },
    },

    mutations: {    
        updateRefreshToken(state, {refresh_token}) {
          state.refresh_token = refresh_token
          if (state.store_refresh_token) {
              localStorage.setItem("refresh_token", state.refresh_token)
          }
        },
    
        updateAccessToken(state, {access_token}) {
          Vue.$cookies.set("access_token", access_token);
          state.access_token = access_token
          state.logged_in = true;
        },

        clearLoginSession(state) {
            state.store_refresh_token = state.logged_in = false;
            state.refresh_token = state.user_data = null;
            Vue.$cookies.remove("access_token")
            localStorage.removeItem("refresh_token")
        },

        updateSaveAuth(state, {store_refresh_token}) {
            state.store_refresh_token = store_refresh_token
        },

        updateLoginStatus(state, {logged_in}) {
            state.logged_in = logged_in
        }
    },

    actions: {
        async init({commit, getters}) {
            window.EventBus.$on('logout', () => commit('clearLoginSession'));

            let refresh_token = localStorage.getItem("refresh_token")
            if (refresh_token) {
                commit('updateRefreshToken', {refresh_token})
                commit('updateSaveAuth', {store_refresh_token: true})
            }

            if (getters.access_token) {
                commit('updateLoginStatus', {logged_in: true})
            }

            try{
                await auth.ping()
                commit('updateLoginStatus', {logged_in: true})
                window.EventBus.$emit("login")
            } catch(err) {
                commit('updateLoginStatus', {logged_in: false})
            }
            
        }
    }
}