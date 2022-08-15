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
            component: () => import('./components/Home'),
            redirect: '/home/welcome',
            children: [
                {
                    path: 'welcome',
                    component: () => import('./components/Welcome'),
                },
                {
                    path: '/users',
                    component: () => import('./components/user/User.vue')
                },
                {
                    path: '/rights',
                    component: () => import('./components/power/Rights.vue')
                },
                {
                    path: '/roles',
                    component: () => import('./components/power/Roles.vue')
                },
                {
                    path: '/categories',
                    component: () => import('./components/goods/Cate.vue')
                },
                {
                    path: '/params',
                    component: () => import('./components/goods/Params.vue')
                },
                {
                    path: '/goods',
                    component: () => import('./components/goods/List.vue'),
                },
                {
                    path: '/goods/add',
                    component: () => import('./components/goods/Add.vue')
                },
            ]
        },
    ]
})

router.beforeEach((to, _, next) => {
    if (to.path === '/login') next();
    const tokenStr = window.sessionStorage.getItem('token')
    // console.log(tokenStr)
    if (!tokenStr) next('/login')
    else {
        next()
    }
})

router.afterEach((to, from) => {
    console.log(to.path)
    window.sessionStorage.setItem('activePath', to.path);
})

export default router
