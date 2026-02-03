import {createRouter, createWebHistory} from 'vue-router'
import Register from '@/pages/register.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/register',
            name: 'register',
            component: () => Register,
            beforeEnter: (to, from, next) => {
                if (localStorage.getItem('activeToken')) {
                    console.log('123');
                    next('/courses')
                } else {
                    next()
                }
            }
        },
        {
            path: '/login',
            name: 'login',
            alias: '/',
            component: () => import('@/pages/login.vue'),
            beforeEnter: (to, from, next) => {
                if (localStorage.getItem('activeToken')) {
                    next('/courses')
                } else {
                    next()
                }
            }
        },
        {
            path: '/courses',
            name: 'courses',
            component: () => import('@/pages/courses.vue'),
            beforeEnter: (to, from, next) => {
                if (localStorage.getItem('activeToken')) {
                    next()
                } else {
                    next('/login')
                }
            }
        },
        {
            path: '/course/:id',
            name: 'course',
            component: () => import('@/pages/course.vue'),
            beforeEnter: (to, from, next) => {
                if (localStorage.getItem('activeToken')) {
                    next()
                } else {
                    next('/login')
                }
            }
        },
        {
            path: '/element',
            name: 'element',
            components: () => import('../pages/element-page.vue')
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'NotFound',
            component: () => Register,
            beforeEnter: (to, from, next) => {
                if (localStorage.getItem('activeToken')) {
                    console.log('123');
                    next('/courses')
                } else {
                    next()
                }
            }
        }
    ],
})

export default router


// {
//     path: '/index',
//     name: 'index',
//     components: () => import('../pages/index.vue')
// },

// {
//     path: '/like-board',
//     name: 'like-board',
//     components: () => import('../pages/like-board.vue'),
// },
//
//
// {
//     path: '/share-board',
//     name: 'share-board',
//     components: () => import('../pages/share-board.vue')
// },
// {
//     path: '/update-board',
//     name: 'update-board',
//     components: () => import('../pages/update-board.vue')
// },
// {
//     path: '/pages-board',
//     name: 'pages-board',
//     components: () => import('../pages/course.vue')
// },
// {
//     path: '/pages-by-hash',
//     name: 'pages-by-hash',
//     components: () => import('../pages/pages-by-hash.vue')
// },