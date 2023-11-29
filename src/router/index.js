import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/Home.vue'),
    redirect: '/home/welcome',
    children: [
      {
        path: 'welcome',
        name: 'welcome',
        component: () => import('@/components/Welcome.vue')
      },
      {
        path: 'users',
        name: 'users',
        component: () => import('@/components/Users.vue')
      },
      {
        path: 'roles',
        name: 'roles',
        component: () => import('@/components/Roles.vue')
      },
      {
        path: 'rights',
        name: 'rights',
        component: () => import('@/components/Rights.vue')
      },
      {
        path: 'goods',
        name: 'goods',
        component: () => import('@/components/Goods.vue')
      },
      {
        path: 'params',
        name: 'params',
        component: () => import('@/components/Params.vue')
      },
      {
        path: 'categories',
        name: 'categories',
        component: () => import('@/components/Categories.vue')
      },
      {
        path: 'orders',
        name: 'orders',
        component: () => import('@/components/Orders.vue')
      },
      {
        path: 'reports',
        name: 'reports',
        component: () => import('@/components/Reports.vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login.vue')
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, form, next) => {
  let token = sessionStorage.getItem('token')
  if (to.path == '/login') {
    if (token) {
      next('/home')
    } else {
      next()
    }
  } else if (to.path != '/login') {
    if (token) {
      next()
    } else {
      next('/login')
    }
  } else {
    next()
  }
})



export default router
