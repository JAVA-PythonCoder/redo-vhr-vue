import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import Test1 from '../views/Test1.vue'
import Test2 from '../views/Test2.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login,
    hidden: true
  },
  {
    path: "/home",
    name: 'home',
    component: Home,
    hidden: true
  },
  {
    path: '/home',
    name: '导航一',
    component: Home,
    // 在父组件路由的基础上注册自组件children，这样子组件就能在父组件的router-view里显示
    children: [
      {
        path: '/test1',
        name: '选项1',
        component: Test1
      },
      {
        path: '/test2',
        name: '选项2',
        component: Test2
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
