import Vue from 'vue'
import App from './App.vue'
import alipayBluetooth from '@/api/alipayBluetooth.js'

Vue.config.productionTip = false
//公共方法
Vue.prototype.$alipayBluetooth = alipayBluetooth
new Vue({
  render: h => h(App),
}).$mount('#app')
