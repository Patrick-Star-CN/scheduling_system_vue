import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import("../views/login/login.vue")
  },

  {
    path: '/superManager',
    name: 'superManager',
    redirect:"index",
    children: [
      {
        path: 'index',
        component:() => import('../views/super_manager/index.vue'),
      },
    ],
  },
  {
    path: '/worker',
    name: 'worker',
    redirect:"index",
    children: [
      {
        path: 'index',
        component:() => import('../views/worker/index.vue'),
      },
    ],
  },
  {
    path: '/manager',
    name: 'manager',
    redirect:"index",
    children: [
      {
        path: 'index',
        component:() => import('../views/manager/index.vue'),
      },
    ],
  },
  {
    path: '/groupManager',
    name: 'groupManager',
    redirect:"index",
    children: [
      {
        path: 'index',
        component:() => import('../views/group_manager/index.vue'),
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    component: () => import('../views/error/404.vue'),
    hidden: true
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
