import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/components/mainPage/Home.vue'   
import SinglePlayer from '@/components/singlePlayer/SinglePlayer.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/home',
      redirect:{name:'home'}
    },
    {
      path: '/singleplayer',
      name: 'singleplayer',
      component: SinglePlayer
    }

  ]
})

export default router
