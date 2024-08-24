import {defineStore} from 'pinia';
import {ref, watchEffect, computed} from 'vue';
//define auth store
const useAuthStore = defineStore('auth',()=>{
    //states
    const name = ref(localStorage.getItem('name') !== undefined ?localStorage.getItem('name'): null);
    const token =ref(localStorage.getItem('token') !== undefined ?localStorage.getItem('token'): null);

    //setup watchers
    watchEffect( ()=>{
        if (name.value !== null) {
            localStorage.setItem('name', name.value);
        } else {
            localStorage.removeItem('name');
        }

        if (token.value !== null) {
            localStorage.setItem('token', token.value);
        } else {
            localStorage.removeItem('token');
        }
    });
    //actions

    //getters
    const isAuth = computed(() => {
        return token.value != null && name.value != null;  // This checks for both `null` and `undefined`.
    });

    return {
        name,
        token,
        isAuth
    }
});


export default useAuthStore;