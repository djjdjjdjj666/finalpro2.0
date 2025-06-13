import { createWebHistory, createRouter } from 'vue-router'
import Container from "../view/Container.vue"
import Site_model from '@/components/Site_model.vue'



const router = createRouter({
  history: createWebHistory(),
  routes:[

    { path: '/', redirect: "/container"},

    { path: '/container', component:Container, children:[
      { path: 'learn' ,component:Site_model },
      { path: 'entertain', component:Site_model },
      { path: 'tool', component:Site_model }
    ]}
  ]
})

export default router
