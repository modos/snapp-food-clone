import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import EditProfile from '../views/EditProfile.vue'
import CreateFood from '../views/CreateFood.vue'
import Orders from "../views/Orders.vue"
import Comments from "../views/Comments.vue"

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
        path: 'createfood',
        name: 'CreateFood',
        component: CreateFood,
        probs: true
      },
      {
        path: 'orders',
        name: 'Orders',
        component: Orders,
        probs: true
      },
      {
        path: 'comments',
        name: 'Comments',
        component: Comments,
        probs: true
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
