import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import { postKeyValueRequest } from './utils/api.js'
import { postRequest } from './utils/api.js'
import { getRequest } from './utils/api.js'
import { putRequest } from './utils/api.js'
import { deleteRequest } from './utils/api.js'


// 将utils/api.js中的导出的网络交互模块定义到Vue的原型链中，则所有的Vue实例将都拥有这些方法
Vue.prototype.postKeyValueRequest = postKeyValueRequest
Vue.prototype.getRequest = getRequest
Vue.prototype.putRequest = putRequest
Vue.prototype.deleteRequest = deleteRequest
Vue.prototype.postRequest = postRequest

Vue.config.productionTip = false

Vue.use(ElementUI);

// $mount('#app')挂载的页面是./public/index.html中的页面，不过该页面被挂载后会被render属性渲染为./App.vue中的页面。即./App.vue页面是展示在./public/index.html中的id=app的块域内
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
