import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import VueCookies from 'vue-cookies'
import Vuesax from 'vuesax'
import 'boxicons'
import {intercept_api} from '@/services/api'
import {app_loading} from '@/store'
import 'chartjs-adapter-moment'

Vue.config.productionTip = false

Vue.use(Vuesax)
Vue.use(VueCookies)

window.EventBus = new Vue()

new Vue({
  router,
  store,

  data: {
    initLoader: null
  },

  created() {
    intercept_api(this.$store)
    var vs = this.$vs;

    window.EventBus.$on('logout', function(res) {
      router.push({name: 'login'})
      if (res.error) {
        vs.notification({
          duration: 'none',
          sticky: false,
          buttonClose: true,
          icon: "<i class='bx bx-bell' ></i>",
          color: 'danger',
          title: 'Logged out',
          text: res.error,
        })
      } else if (res.msg) {
        vs.notification({
          duration: '30000',
          progress: 'auto',
          sticky: false,
          buttonClose: true,
          icon: "<i class='bx bx-bell' ></i>",
          color: 'danger',
          title: 'Logged out',
          text: res.msg,
        })
      }
    })

		this.initLoader = this.$store.dispatch('init')
	},
  
  mounted() {
    var store = this.$store;
    const res = function () {
      app_loading.resolve(true)
      store.commit('loading/stop')
    }

    this.initLoader.then(res).catch(res)
  },

  render: h => h(App)
}).$mount('#app')
