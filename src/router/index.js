import Vue from 'vue'
import Router from 'vue-router'
// import About from '@/pages/about'
import Home from '@/pages/home'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/'
      , name: 'home'
      , component: Home
    }
    // , {
    //   path: '/about'
    //   , name: 'about'
    //   , component: About
    // }
    // , {
    //   path: '/video-helper'
    //   , name: 'video-helper'
    //   , component: () => import('@/pages/video.vue')
    // }
    , {
      path: '/*'
      , redirect: { name: 'home' }
    }
  ]
})
