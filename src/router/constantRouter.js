import { UserLayout } from '@/layouts'

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouters = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult')
      }
    ]
  },

  {
    path: '/403',
    name: '403',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception')
  },
  {
    path: '/404',
    name: '404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception')
  },
  {
    path: '/500',
    name: '500',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception')
  }

]
