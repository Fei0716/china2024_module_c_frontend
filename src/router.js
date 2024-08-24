import {createRouter , createWebHistory} from "vue-router";
import GuestIndex from './views/guest/index.vue';
import GuestDetail from './views/guest/detail.vue';

import AdminIndex from './views/admin/index.vue';
import AdminCreateKnowledge from './views/admin/knowledge-create.vue';
import AdminLogin from './views/admin/login.vue';

import useAuthStore from './stores/auth';

//list of routes
const routes = [
    {
        path: '/',
        name: 'GuestIndex',
        component: GuestIndex,
        meta: {
            guard: 'guest',
        }
    },
    {
        path: '/:id',
        name: 'GuestDetail',
        component: GuestDetail,
        meta: {
            guard: 'guest',
        }
    },


    {
        path: '/admin',
        name: 'AdminIndex',
        component: AdminIndex,
        meta: {
            guard: 'auth',
        }
    },
    {
        path: '/admin/create-knowledge',
        name: 'AdminCreateKnowledge',
        component: AdminCreateKnowledge,
        meta: {
            guard: 'auth',
        }
    },
    {
        path: '/admin/login',
        name: 'AdminLogin',
        component: AdminLogin,
        meta: {
            guard: 'guest',
        }
    },
    {
        //redirect all invalid route back to guest index page
        path: '/:catchAll(.*)',
        redirect: '/',
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

//add middlewares for the routes

router.beforeEach((to, from, next) => {
   if(to.meta.guard === 'auth'){
       //check for user token
        const authStore = useAuthStore();
        if(!authStore.isAuth){
            //redirect to login page
            next({name: 'AdminLogin'});
        }else{
            next();
        }
   } else{
       next();
   }
})


export default router;