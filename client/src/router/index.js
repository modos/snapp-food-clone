import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import EditProfile from '../views/EditProfile.vue'
import CreateFood from '../views/CreateFood.vue'
import FoodsList from '../views/FoodsList.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/about/:id',
    name: 'About',
    props: true,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
    children: [
      {
        path: 'editprofile',
        name: 'EditProfile',
        component: EditProfile,
        probs: true
      },
      {
        path: 'createfood/:id',
        name: 'CreateFood',
        component: CreateFood,
        probs: true
      },
      {
        path: 'foodslist/:id',
        name: 'FoodsList',
        component: FoodsList,
        probs: true
      },
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
