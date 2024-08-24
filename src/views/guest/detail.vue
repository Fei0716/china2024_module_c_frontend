<template>
  <header class=" shadow-sm px-8 py-4">
    <div class="container flex justify-center">
      <img class="h-7" src="../../assets/imgs/logo-fill.png" alt="Your Company">
    </div>

  </header>

  <main class="pt-5 container">
    <h1 class="mt-2">
      <span>{{knowledge.title}}</span>
    </h1>

    <div class="kl-tags">
      <div class="badge badge-indigo" v-for="t of knowledge.knowledge_tags" :key="t.id">{{t.tag.name}}</div>
    </div>

    <div class="kl-images mt-4">
      <div>
        <img :src="'http://192.168.10.2/china_module_c_backend/public/' + img.url" alt="Image of Knowledge" v-for="img of knowledge.images" :key="img.id">
      </div>

    </div>

    <div class="text-gray-400 mt-4 text-sm">
      Published on {{formatDate(knowledge.created_at)}} by {{knowledge.author.name}}
    </div>

    <div class="mt-2">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores provident deserunt praesentium maiores laudantium labore tempora, illo officia! Numquam, odio?
    </div>
    <div class="mt-4">
      <RouterLink :to="{name: 'GuestIndex'}"><button class="btn">Back</button></RouterLink>
    </div>
  </main>
</template>

<script setup>
//import external modules
import api from '../../api.js';
import {ref,computed} from 'vue';
import router from '../../router.js';
import {useRoute} from 'vue-router';
//states
const knowledge = ref([]);
const routes = useRoute();

//date formatter
const dateFormatter = new Intl.DateTimeFormat('en-uk',{
  dateStyle: 'short',
});


//methods call
getKnowledge();
//methods
async function getKnowledge(){
  try{
    const {data} = await api.get(`knowledge/${routes.params.id}`);
    knowledge.value = data.knowledge;
  }catch(e){
    console.error(e);
  }
}

function formatDate(t){
  return dateFormatter.format(new Date(t));
}
</script>

<style scoped>

</style>