import { createWebHistory, createRouter } from 'vue-router'

import Home from '../views/Home.vue'
import Game from '../views/Game.vue'
import Waiting from '../views/Waiting.vue'

const routes= [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/game',
        name: 'Game',
        component: Game
    },
    {
        path: '/waiting',
        name: 'Waiting',
        component: Waiting
    }
]

const router = createRouter({
    routes,
    history: createWebHistory()
})

export default router