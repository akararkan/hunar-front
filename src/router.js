import { createRouter, createWebHistory } from 'vue-router'
import Login from './components/Login.vue'
import Home from './components/Home.vue'
import Factory from './components/Factory.vue'
import Quarry from './components/Quarry.vue'
import Stone from './components/factory/Stone.vue'
import quarryOrder from './components/quarry/quarryOrder.vue'
const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
  },  
  {
    path: '/home',
    name: 'Home',
    component: Home,
  },
  {
    path: "/factory", component: Factory
  },
  {
    path: "/quarry", component: Quarry
  },
  {
    path: "/stone" , component: Stone
  },
  {
    path: "/orders" , component: quarryOrder
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router