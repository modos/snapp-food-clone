import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import EditProfile from '../views/EditProfile.vue'
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
    path: '/dashboard/:id',
    name: 'Dashboard',
    props: true,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Dashboard.vue'),
    children: [
      {
        path: 'editprofile',
        name: 'EditProfile',
        component: EditProfile,
        probs: true
      },
      {
        path: 'foodslist',
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
