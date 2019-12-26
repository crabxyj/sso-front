import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    redirect: '/RoleManager'
},
{
    path: '/',
    component: () => import(/* webpackChunkName: "about" */ '../views/Home.vue'),
    meta: {
        title: '后台管理系统'
    },
    children: [{
        path: '/BaseTable',
        component: () => import('../views/BaseTable.vue'),
        meta: {
            title: 'BaseTable'
        }
    }, {
        path: '/RoleManager',
        component: () => import('../views/RoleManager.vue'),
        meta: {
            title: '角色管理'
        }
    }]
}]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
