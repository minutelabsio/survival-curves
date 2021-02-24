import Vue from 'vue'
import Router from 'vue-router'
import About from '@/pages/about'
import Home from '@/pages/home'

// const CDN = 'https://cdn.minutelabs.io/what-is-a-day/audio'
//
// function getTracks(name){
//   return [
//     `${CDN}/${name}.mp3`
//     , `${CDN}/${name}.ogg`
//   ]
// }

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/'
      , name: 'home'
      , component: Home
    }
    , {
      path: '/about'
      , name: 'about'
      , component: About
    }
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
