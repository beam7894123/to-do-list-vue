import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // {
    //   path: '/',
    //   name: '',
    //   component: HomeView
    // },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/old',
      name: 'main',
      meta: {
        title: 'Todo App (Cookie Mode)'
      },
      component: () => import('../views/mainCookie.vue')
    },
    {
      path: '/',
      name: 'guest',
      meta: {
        title: 'Todo App (Guest Mode)'
      },
      component: () => import('../views/guest/index.vue')
    },

  ]
})
router.beforeEach((to, from) => {
  document.title = to.meta?.title ?? 'Default Title (meow)'
})

export default router
