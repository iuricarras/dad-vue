import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/components/mainPage/Home.vue'   
import SinglePlayer from '@/components/singlePlayer/SinglePlayer.vue'
import Login from '@/components/auth/Login.vue'
import Statistics from '@/components/statistics/Statistics.vue'
import Transactions from '@/components/transaction/Transactions.vue'
import Users from '@/components/user/Users.vue'

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
      name: 'Singleplayer',
      component: SinglePlayer
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
      {
      path: '/statistics',
      name: 'Statistics',
      component: Statistics,
    },{
      path: '/transactions',
      name: 'Transactions',
      component: Transactions 
    },
    {
      path: '/users',
      name: 'users',
      component: Users 
    }
  ]
})

export default router
