import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const router = new VueRouter({
    routes: [
        {
            path: '/',
            // component: () => import('./components/Login')
            redirect: '/login'
        },
        {
            path: '/login',
            component: () => import('./components/Login')
        },
        {
            path: '/home',
            component: () => import('./components/Home')
        },
    ]
})

router.beforeEach((to, _, next) => {
    if (to.path === '/login') next();
    const tokenStr = window.sessionStorage.getItem('token')
    console.log(tokenStr)
    if (!tokenStr) next('/login')
    else {
        next()
    }
})

export default router
