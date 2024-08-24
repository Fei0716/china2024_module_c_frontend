<script setup>
  import useAuthStore from "../stores/auth.js";
  import api from '../api.js';
  import router from '../router.js';

  const authStore = useAuthStore();

  async function logoutAdmin(){
    try{
      await api.post('admin/logout');

      //remove token and name from store
      authStore.token = null;
      authStore.name = null;

      router.push({name: 'AdminLogin'});
    }catch (e) {
      console.error(e);
    }
  }

  function logout(e){
    e.preventDefault();
    logoutAdmin();
  }
</script>

<template>
  <!-- Content Header -->
  <header class="flex justify-between shadow-sm px-8 py-4">
    <div class="content-header-left text-gray-500">
      Dashboard
    </div>
    <div class="flex items-end content-header-right text-sm">
      <div class="mr-3 text-stone-800">{{authStore.name}}</div>
      <button :to="{name: 'AdminLogin'}" class="logout-func" @click="logout">Logout</button>
    </div>
  </header>
</template>

<style scoped>

</style>