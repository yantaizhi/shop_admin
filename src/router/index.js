import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import Users from '../views/Users.vue'
import Roles from '../views/Roles.vue'
import Rights from '../views/Rights.vue'
import Category from '../views/category.vue'
import Goods from '../views/Goods.vue'
import GoodsAdd from '../views/GoodsAdd.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      children: [
        {
          path: '/users',
          component: Users
        },
        {
          path: '/roles',
          component: Roles
        },
        {
          path: '/rights',
          component: Rights
        },
        {
          path: '/categories',
          component: Category
        },
        {
          path: '/goods',
          component: Goods
        },
        {
          path: '/goods-add',
          component: GoodsAdd
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.path === '/login' || token) {
    next()
  } else {
    next('/login')
  }
})
export default router
