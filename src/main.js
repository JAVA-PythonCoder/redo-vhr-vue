import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import { postKeyValueRequest } from './utils/api.js'
import { postRequest } from './utils/api.js'
import { getRequest } from './utils/api.js'
import { putRequest } from './utils/api.js'
import { deleteRequest } from './utils/api.js'
import { initMenu } from './utils/menus.js'
import 'font-awesome/css/font-awesome.min.css'


// 将utils/api.js中的导出的网络交互模块定义到Vue的原型链中，则所有的Vue实例将都拥有这些方法
Vue.prototype.postKeyValueRequest = postKeyValueRequest
Vue.prototype.getRequest = getRequest
Vue.prototype.putRequest = putRequest
Vue.prototype.deleteRequest = deleteRequest
Vue.prototype.postRequest = postRequest

Vue.config.productionTip = false

Vue.use(ElementUI);

// router.beforeEach(to, from, next)注册全局前置导航守卫，to表示即将进入的包含路由的对象，from表示导航正要离开的包含路由的对象。
// 因为每个用户的权限不同，需要展示的页面也不同，所以当页面发生刷新时，vuex里的状态可能会发生变化，
router.beforeEach((to, from, next) => {
  console.log(from);
  console.log(to);
  if (to.path == '/') {
    // 如果去的地址是登录页，则直接跳转
      next();
  } else {
    // 如果当前sessionStorage里有用户信息，则初始化路由
    if (window.sessionStorage.getItem('user')) {
      // 调用initMenu模块，判断vuex中是否还有路由信息，如果没有说明可能是F5刷新导致，需要去后端再请求信息，如果有则只需要进行正常的网络跳转即可。
      initMenu(router, store);
      // next()在导航守卫里只能调用一次，表示进行跳转到to定义的路由地址。如果没有next()导航则不会进行跳转
      next();
    } else {
      // 当前页面的sessionStorage没有用户信息，则直接跳转到登录页。
      // 用户未登录，但需要登录后直接跳转到目的地址
      next('/?redirect=' + to.path)
    }
    
  }
  

});

// $mount('#app')挂载的页面是./public/index.html中的页面，不过该页面被挂载后会被render属性渲染为./App.vue中的页面。即./App.vue页面是展示在./public/index.html中的id=app的块域内
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
