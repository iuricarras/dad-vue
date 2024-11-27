import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/components/mainPage/Home.vue'   
import SinglePlayer from '@/components/singlePlayer/SinglePlayer.vue'
import Login from '@/components/auth/Login.vue'
import Statistics from '@/components/statistics/Statistics.vue'
import Scoreboard from '@/components/scoreboard/Scoreboard.vue'
import GameHistory from '@/components/game/GameHistory.vue'
import Shop from '@/components/shop/shop.vue'
import Transactions from '@/components/transaction/Transactions.vue'
import Users from '@/components/user/Users.vue'

import { useAuthStore } from '@/stores/auth'





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
    },
    {
      path: '/transactions',
      name: 'Transactions',
      component: Transactions 
    },
    {
      path: '/users',
      name: 'users',
      component: Users 
    },
    { path: '/scoreboard', 
      name: 'Scoreboard', 
      component: Scoreboard 
    },
    {
      path: '/gamehistory',
      name: 'GameHistory',
      component: GameHistory
    },
    {
      path: '/shop',
      name: 'shop',
      component: Shop 
    }
  ]
})

let handlingFirstRoute = true

router.beforeEach(async (to, from, next) => {
    const storeAuth = useAuthStore()
    if (handlingFirstRoute) {
        handlingFirstRoute = false
        await storeAuth.restoreToken()
    }


    // routes "updateTask" and "updateProject" are only accessible when user is logged in
    if (((to.name == 'updateTask') || (to.name == 'updateProject')) && (!storeAuth.user)) {
        next({ name: 'login' })
        return
    }
    
    // all other routes are accessible to everyone, including anonymous users
    
    next()
})



export default router
