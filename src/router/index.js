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
        component: () => import('@/components/Welcome.vue'),
        meta: {
          title: '首页'
        }
      },
      {
        path: 'users',
        name: 'users',
        component: () => import('@/components/user/Users.vue'),
        meta: {
          title: '用户列表'
        }
      },
      {
        path: 'roles',
        name: 'roles',
        component: () => import('@/components/power/Roles.vue'),
        meta: {
          title: '角色列表'
        }
      },
      {
        path: 'rights',
        name: 'rights',
        component: () => import('@/components/power/Rights.vue'),
        meta: {
          title: '权限列表'
        }
      },
      {
        path: 'goods',
        name: 'goods',
        component: () => import('@/components/goods/Goods.vue'),
        meta: {
          title: '商品列表'
        },
      },
      {
        path: 'add',
        name: 'add',
        component: () => import('@/components/goods/Add.vue'),
        meta: {
          title: '添加商品'
        }
      },
      {
        path: 'params',
        name: 'params',
        component: () => import('@/components/goods/Params.vue'),
        meta: {
          title: '分类参数'
        }
      },
      {
        path: 'categories',
        name: 'categories',
        component: () => import('@/components/goods/Categories.vue'),
        meta: {
          title: '商品分类'
        }
      },
      {
        path: 'orders',
        name: 'orders',
        component: () => import('@/components/order/Orders.vue'),
        meta: {
          title: '订单列表'
        }
      },
      {
        path: 'reports',
        name: 'reports',
        component: () => import('@/components/reports/Reports.vue'),
        meta: {
          title: '数据报表'
        }
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login.vue'),
    meta: {
      title: '登录'
    }
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, form, next) => {
  let token = sessionStorage.getItem('token')
  if (to.path === '/login') {
    if (token) {
      next('/home')
    } else {
      next()
    }
  } else if (to.path !== '/login') {
    if (token) {
      next()
    } else {
      next('/login')
    }
  } else {
    next()
  }
})

router.afterEach((to, form) => {
  document.title = to.meta.title;
})



export default router
