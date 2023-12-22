import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import("../views/login/login.vue")
  },
  {
    path: "/:pathMatch(.*)*",
    component: () => import('../views/error/404.vue'),
    hidden: true
  },
  {
    path: '/worker',
    name: 'worker',
    redirect:"index",
    children: [
      {
        path: 'index',
        component:() => import('../views/worker/index.vue'),
        name: 'Index',
      },
      {
        path: 'home',
        component:() => import('../views/worker/pages/home.vue'),
        name: 'Home',
      },
      {
        path: 'edit',
        component:() => import('../views/worker/pages/edit.vue'),
        name: 'Edit',
      },
      {
        path: 'preference',
        component:() => import('../views/worker/pages/preference.vue'),
        name: 'Preference',
      },
      {
        path: 'schedule',
        component:() => import('../views/worker/pages/schedule.vue'),
        name: 'Schedule',
      },
      {
        path: 'leaveApplication',
        component:() => import('../views/worker/pages/leaveApplication.vue'),
        name: 'LeaveApplication',
      }
    ],
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
