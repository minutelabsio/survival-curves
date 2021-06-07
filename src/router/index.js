import Vue from 'vue'
import Router from 'vue-router'
// import About from '@/pages/about'
import Home from '@/pages/home'
import Humans from '@/pages/humans'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/'
      , name: 'home'
      , component: Home
    }
    , {
      path: '/humans'
      , name: 'humans'
      , component: Humans
    }
    // , {
    //   path: '/about'
    //   , name: 'about'
    //   , component: About
    // }
    , {
      path: '/video-helper'
      , name: 'video-helper'
      , component: () => import('@/pages/video.vue')
    }
    , {
      path: '/*'
      , redirect: { name: 'home' }
    }
  ]
})
