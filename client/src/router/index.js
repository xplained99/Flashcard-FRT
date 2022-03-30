import Vue from 'vue'
import store from '@/store'
import VueRouter from 'vue-router'
import {app_loading} from '@/store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "LoginView" */ '@/views/LoginView.vue'),
    meta: {
      auth: false,
      title: 'Login - Flashcard',
    }
  },
  {
    path: '/create',
    name: 'create',
    component: () => import(/* webpackChunkName: "LoginView" */ '@/views/CreateView.vue'),
    meta: {
      auth: false,
      title: 'Create - Flashcard',
    }
  },
  {
    path: '/dashboard',
    name: 'dash',
    component: () => import(/* webpackChunkName: "DashboardIndex" */ "@/views/Dashboard/DashboardIndex.vue"),
    children: [
      {
        path: '/', 
        name: 'dash.home',
        component: () => import(/* webpackChunkName: "HomeView" */ '@/views/Dashboard/HomeView.vue'),
        meta: {
          title: 'Home Dashboard',
        }
      },
      {
        path: '/deck', 
        name: 'dash.deck',
        component: () => import(/* webpackChunkName: "DeckView" */ '@/views/Dashboard/DeckView.vue'),
        meta: {
          title: 'Deck Dashboard',
        }
      },
      {
        path: '/deck/:deck_id',
        name: 'dash.cards',
        component: () => import(/* webpackChunkName: "DeckView" */ '@/views/Dashboard/CardsView.vue'),
        meta: {
          title: 'Cards Dashboard'
        }
      },
      {
        path: '/review/:deck_id',
        name: 'dash.review',
        component: () => import(/* webpackChunkName: "DeckView" */ '@/views/Dashboard/ReviewView.vue'),
        meta: {
          title: 'Cards Review'
        }
      },
      {
        path: '/review',
        redirect: '/dashboard/deck'
      },

    ],
    meta: {
      auth: true,
      title: 'Dashboard - Flashcard'
    },
  },
  {
    path: '/',
    redirect: '/dashboard'
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  app_loading.then(
    () => {
      if (to.matched.some((record) => record.meta.auth)) {
        if (!store.state.auth.logged_in) {
          router.push({
            name: "login",
            params: { nextUrl: to.fullPath },
          });
        } else next();
      } else next();
    }
  )
});

router.afterEach((to) => {
  Vue.nextTick(() => {
    document.title = to.meta.title || "Flashcard"
  })
})


export default router
