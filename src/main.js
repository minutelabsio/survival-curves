import Vue from 'vue'
import App from '@/app'
import VueAnalytics from 'vue-analytics'
// import router from '@/router'
import Filters from '@/plugins/filters'
import Gestures from '@/plugins/gestures'
import Buefy from 'buefy'

import '@mdi/font/css/materialdesignicons.css'
// require styles
import './styles/main.scss'
import labConfig from '../lab-config'

const isProduction = process.env.NODE_ENV === 'production'
Vue.use(VueAnalytics, {
  id: 'UA-46248430-1'
  // , router
  , debug: {
    enabled: !isProduction
    , trace: false
    , sendHitTask: isProduction
  }
  , autoTracking: {
    exception: true
    , pageviewTemplate (route) {
      return {
        title: route.name
        , page: `/${labConfig.repo}${route.path}`
        , location: window.location.href
      }
    }
  }
})

Vue.use(Buefy, {
  defaultContainerElement: '#app'
  // , defaultIconPack: 'fas'
})

Vue.use(Filters)
Vue.use(Gestures)

Vue.config.productionTip = false
Vue.prototype.$labConfig = labConfig

new Vue({
  render: h => h(App)
}).$mount('#app')
