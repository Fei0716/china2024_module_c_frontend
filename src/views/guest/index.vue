<template>
  <header class=" shadow-sm px-8 py-4">
    <div class="container flex justify-center">
      <img class="h-7" src="../../assets/imgs/logo-fill.png" alt="Your Company">
    </div>

  </header>

  <main class="pt-5 container">
    <h1 class="mt-2">
      <span>Find Your Knowledge</span>
    </h1>

    <div class="filter-container">
      <div class="filter-title">Filter by tag(s):</div>
      <div class="filter-value">
        <div class="tag-list">
          <div class="tag-item" v-for="t of tags">
            <input type="checkbox" class="radio" name="tags" :id="'tag-' + t.id" @change="filterByTags" :value="t" v-model="selectedTags">
            <label :for="'tag-' + t.id">{{t.name}}</label>
          </div>
        </div>
      </div>
    </div>

    <div class="flex mt-2">
      <div class="filter-container grow mr-6">
        <div class="filter-title">Filter by Publish Date:</div>
        <div class="filter-value">
          <input type="date" class="w-full" v-model="date" @change="filterByDate">
        </div>
      </div>

      <div class="filter-container grow">
        <div class="filter-title">Filter by Title:</div>
        <div class="filter-value">
          <input type="text" class="w-full" v-model="title">
        </div>
      </div>
    </div>
    <div class="mt-2">
      <button class="btn btn-sm btn-danger" @click="resetFilters">Reset</button>
    </div>

    <hr class="mt-5 mb-5">

    <div class="knowledge-list">
      <TransitionGroup name="list" appear mode="out-in">
        <div v-for="(k , i) of lists" :key="k.id" class="card kl-card" ref="knowledgesDom" :style="{'transition-delay': (i % 8 *  0.2) + 's'}">
          <div class="kl-card-head">
            <img :src="'http://192.168.10.2/china_module_c_backend/public/' + k.images[0].url" alt="Image Thumbnail of The Knowledge">
          </div>
          <div class="kl-card-body">
            <h3 class="kl-title">{{ k.title }}</h3>
            <div class="kl-tags">
              <div class="badge badge-indigo" v-for="t of k.knowledge_tags" :key="t.id">{{t.tag.name}}</div>
            </div>
            <div class="excerpt">
              {{ k.excerpt }}
            </div>
            <div class="bottom flex justify-between items-center">
              <span class="text-gray-400">{{ formatDate(k.created_at) }}</span>
              <RouterLink :to="{name: 'GuestDetail' , params:{ 'id': k.id}}"><button class="btn btn-sm">Detail</button></RouterLink>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </main>
</template>

<script setup>

//import external modules
import api from '../../api.js';
import {ref,computed, onMounted,  nextTick, watch} from 'vue';
import router from '../../router.js';

//states
let initialSize = 0;
const knowledges = ref([]);
const knowledgesDom = ref([]);
//create a copy of knowledges list

const tags = ref([]);
const selectedTags = ref([]);
const date = ref(null);
const title = ref(null);
//date formatter
const dateFormatter = new Intl.DateTimeFormat('en-uk',{
  dateStyle: 'short',
});
//methods call
getKnowledges();
getTags();
//for paginations
const pageSize = ref(1);//display 10 knowledges in one page
const currentPage = ref(1);
//computed props
const pageCount = computed(()=>{
  return Math.ceil(knowledges.value.length / pageSize.value);
});
const currentPageKnowledges = computed(() => {
  return knowledges.value.slice( ((currentPage.value - 1) * pageSize.value) , (currentPage.value * pageSize.value < knowledges.value.length ? currentPage.value * pageSize.value : knowledges.value.length ));
});
const currentPageShowing = computed(()=>{
  return currentPage.value * pageSize.value <= knowledges.value.length ? pageSize.value : knowledges.value.length % pageSize.value;
});

const lists = computed(()=>{

  let l =  [...knowledges.value];
  //filter by tag
  if(selectedTags.value.length > 0){
    l = l.filter( l =>{
      return l.knowledge_tags.some( (kt) => {
        //check whether the knowledge contains all the tags selected\
        return selectedTags.value.some((st) => {
          return kt.tag.id === st.id;
        })
      });
    });
  }
  let selectedDate = formatDate(date.value);
  let publishedDate;
  //filter by date
  if(date.value){
    //check whether  published after the selected date.
    l= l.filter( l => {
      publishedDate = formatDate(l.created_at);
      console.log(publishedDate ,  isAfterSelectedDate(selectedDate, publishedDate))
      return isAfterSelectedDate(selectedDate, publishedDate);
    }) ;
  }

  //filter by title
  if(title.value){
    l= l.filter( l => {
      return l.knowledge_tags.some((kt) => {
          return kt.tag.name.toLowerCase().includes(title.value.toLowerCase());
      });;
    }) ;
  }

  return l;
});

//observers
const observer = new IntersectionObserver((entries) =>{
  entries.forEach((entry, i) =>{
      if(entry.intersectionRatio > 0){
        //append new set to the list
        knowledges.value.push(...knowledges.value);
      }
  });
});



//methods
async function getKnowledges(){
  try{
    const {data} = await api.get('knowledge');
    knowledges.value = data.knowledges;

    lists.value = [...knowledges.value];
    initialSize = knowledges.value.length;
  }catch(e){
    console.error(e);
  }
}
async function getTags(){
  try{
    const {data} = await api.get('tag');
    tags.value = data.tags;

  }catch(e){
    console.error(e);
  }
}
function pageSwitch(pageNo){
  currentPage.value = pageNo;
}
function formatDate(t){
  return dateFormatter.format(new Date(t));
}

function resetFilters(){
  selectedTags.value = [];
  date.value = null;
  title.value = null;
}

function isAfterSelectedDate(s , p){
  //get the dates
  let dateSelected = parseInt(s.slice(0, 2));
  let datePublished = parseInt(p.slice(0, 2));
  //get the months
  let monthSelected = parseInt(s.slice(3, 5));
  let monthPublished = parseInt(p.slice(3, 5));
  //get the years
  let yearSelected = parseInt(s.slice(6, 11));
  let yearPublished = parseInt(p.slice(6,11));
  return yearPublished >= yearSelected && monthPublished >= monthSelected && (yearPublished === yearSelected && monthPublished === monthSelected ? datePublished > dateSelected : true);
}


// Lifecycle hook
onMounted(() => {
  watch(lists, (newVal) => {
    if (newVal.length > 0) {
      // Use nextTick to ensure DOM update
      nextTick(() => {
        const lastCard = document.querySelector(".knowledge-list > .card:last-child");
        if (lastCard) {
          observer.observe(lastCard);  // Observe the last item in the list
        }
      });
    }
  }, { immediate: true }); // Ensure the watch runs immediately
});
</script>

<style scoped>

.list-enter-from, .list-leave-to{
  transform: translateX(-100%);
  opacity: 0;
}
.list-enter-active, .list-leave-active{
  transition: all .4s ease;
}
.list-enter-to, .list-leave-from{
  transform: translateX(0);
  opacity: 1;
}
</style>