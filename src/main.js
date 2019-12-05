import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import VueQuillEditor from 'vue-quill-editor'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import moment from 'moment'

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(VueQuillEditor)

Vue.prototype.$axios = axios
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

Vue.filter('time', function (val) {
  return moment(val * 1000).format('YYYY-MM-DD HH:mm:ss')
})

axios.interceptors.request.use(function (config) {
  // Do something before request is sent
  if (config !== 'login') {
    config.headers.Authorization = localStorage.getItem('token')
  }
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

axios.interceptors.response.use(function (response) {
  // console.log('响应的数据', response)
  // 拦截到所有的响应，直接把res的data返回
  return response.data
}, function (error) {
  return Promise.reject(error)
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
