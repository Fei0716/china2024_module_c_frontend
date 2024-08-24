<template>
  <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <h2 class="login-title">Sign in to your account</h2>
    </div>


    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">

      <!-- The toast of failed. -->
      <div class="toast toast-danger mb-6" v-if="error">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path
              d="M256,48C141.31,48,48,141.31,48,256s93.31,208,208,208,208-93.31,208-208S370.69,48,256,48Zm75.31,260.69a16,16,0,1,1-22.62,22.62L256,278.63l-52.69,52.68a16,16,0,0,1-22.62-22.62L233.37,256l-52.68-52.69a16,16,0,0,1,22.62-22.62L256,233.37l52.69-52.68a16,16,0,0,1,22.62,22.62L278.63,256Z" />
        </svg>
        <p>
          Incorrect username or password.
        </p>
      </div>

      <form class="space-y-6" action="#" method="POST" @submit.prevent="login">
        <div>
          <label for="username" class="login-label">Username</label>
          <div class="mt-2">
            <input id="username" name="username" type="text" class="w-full" v-model="username">
          </div>
          <p class="form-error-message" v-if="usernameError">{{usernameError}}</p>
        </div>

        <div>
          <div class="flex items-center justify-between">
            <label for="password" class="login-label">Password</label>
          </div>
          <div class="mt-2">
            <input id="password" name="password" type="password" class="w-full" v-model="password">
          </div>
          <p class="form-error-message" v-if="passwordError">{{passwordError}}</p>
        </div>

        <div>
          <button type="submit" class="btn w-full">Login</button>
        </div>
      </form>
    </div>
  </div>

</template>

<script setup>
import api from '../../api.js';
import router from '../../router.js';
import useAuthStore from '../../stores/auth.js';
import {ref} from 'vue';

//states
const username = ref('');
const password = ref('');
const usernameError = ref(null);
const passwordError = ref(null);
const error = ref(null);
const authStore = useAuthStore();

async function login(){
  try{
    const {data} = await api.post('admin/login',{
      name: username.value,
      password: password.value,
    })
    authStore.token = data.token;
    authStore.name = data.name;

    //redirect to admin dashboard
    await router.push({name: 'AdminIndex'});
  }catch (e) {
    if(e.response.status === 400){
      error.value = true;
      setTimeout(()=> {
        error.value = null;
      }, 5000);//remove the error message after 5sec
    }else if(e.response.status === 422){
      if(e.response.data.errors.name){
        usernameError.value = e.response.data.errors.name[0];
        setTimeout(()=> {
          usernameError.value = null;
        }, 5000);//remove the error message after 5sec
      }
      if(e.response.data.errors.password){
        passwordError.value = e.response.data.errors.password[0];

        setTimeout(()=> {
          passwordError.value = null;
        }, 5000);//remove the error message after 5sec
      }
    }
    console.error(e);
  }
}

</script>

<style scoped>

</style>