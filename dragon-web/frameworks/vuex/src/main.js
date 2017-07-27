// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import 'flexboxgrid/dist/flexboxgrid.css'
import 'dragon-styles'

Vue.config.productionTip = false

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		containers: [
          {
            items: [
              {text: 'test1'},
              {text: 'test2'},
              {text: 'test3'},
            ],
          },
          {
            items: [
              {text: 'test4'},
              {text: 'test5'},
              {text: 'test6'},
            ],
          },
        ],
	},
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App},
})
