<template>
  <div class="flex h-full">
    <!-- Left Sidebar -->
    <LeftSidebar></LeftSidebar>
    <!-- Right Content -->
    <div class="right-content grow">

      <ContentHeader></ContentHeader>
      <!-- Toast Container -->
      <div class="toast-container px-8 pt-3">
        <!-- The toast of failed. -->
        <!-- <div class="toast toast-danger">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path
                    d="M256,48C141.31,48,48,141.31,48,256s93.31,208,208,208,208-93.31,208-208S370.69,48,256,48Zm75.31,260.69a16,16,0,1,1-22.62,22.62L256,278.63l-52.69,52.68a16,16,0,0,1-22.62-22.62L233.37,256l-52.68-52.69a16,16,0,0,1,22.62-22.62L256,233.37l52.69-52.68a16,16,0,0,1,22.62,22.62L278.63,256Z" />
            </svg>
            <p>
                Custom your message!
            </p>
        </div> -->

        <!-- The toast of succesed. -->
        <!-- <div class="toast toast-success">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path
                    d="M256,48C141.31,48,48,141.31,48,256s93.31,208,208,208,208-93.31,208-208S370.69,48,256,48ZM364.25,186.29l-134.4,160a16,16,0,0,1-12,5.71h-.27a16,16,0,0,1-11.89-5.3l-57.6-64a16,16,0,1,1,23.78-21.4l45.29,50.32L339.75,165.71a16,16,0,0,1,24.5,20.58Z" />
            </svg>
            <p>
                Custom your message!
            </p>
        </div> -->
      </div>

      <main class="p-8 pt-5">

        <h1 class="flex justify-between items-center">
          <span>Knowledge List</span>
        </h1>

        <div class="content">

          <!-- Package List -->

          <!-- Table Data -->
          <table class="mt-2 data-table">
            <thead class="bg-gray-0">
            <tr>
              <th class="w-10">ID</th>
              <th class="w-28">Images</th>
              <th class="w-60">Content</th>
              <th class="w-10 ">Publish Date</th>
              <th class="w-10 ">Author</th>
              <th class="w-6">Operation</th>
            </tr>
            </thead>
            <tbody>

            <!-- Loop through the knowledges list-->
            <tr v-for="(k, i) of currentPageKnowledges" :key="k.id">
              <td>{{k.id}}</td>
<!--              Loop through all the images-->
              <td class="table-imgs flex">
                <img class="w-10" :src="'http://192.168.10.2/china_module_c_backend/public/' + img.url" alt="Image of the Knowledge" v-for="img of k.images">
              </td>
              <td>
               {{k.content}}
              </td>
              <td>{{k.created_at}}</td>
              <td>{{k.author.name}}</td>
              <td>
                <a  class="link-danger" @click.prevent="deleteKnowledge(k.id)">Delete</a>
              </td>
            </tr>
            </tbody>
          </table>

          <!-- Table Footer -->
          <div class="table-footer">
            <p class="pagination-info">
              Showing
              <span class="font-medium">{{Math.max(currentPageShowing - pageSize + 1 , 1)}}</span>
              to
              <span class="font-medium">{{currentPageShowing}}</span>
              of
              <span class="font-medium">{{ knowledges.length }}</span>
              results
            </p>

            <nav class="pagination-function">

              <a href="#" class="pg-prev-btn" disabled>
                <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd"
                        d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                        clip-rule="evenodd" />
                </svg>
              </a>
              <a href="#" class="page-btn " :class="{'cur-pg-btn': n === currentPage}" v-for="n of pageCount" @click="pageSwitch(n)">{{n}}</a>
              <a href="#" class="pg-next-btn">
                <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd"
                        d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                        clip-rule="evenodd" />
                </svg>
              </a>
            </nav>
          </div>


        </div>
      </main>
    </div>
  </div>

</template>

<script setup>
import LeftSidebar from "../../components/LeftSidebar.vue";
import ContentHeader from "../../components/ContentHeader.vue";

//import external modules
import api from '../../api.js';
import {ref,computed} from 'vue';
import router from '../../router.js';

//states
const knowledges = ref([]);

//for paginations
const pageSize = ref(10);//display 10 knowledges in one page
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
//methods call
getKnowledges();
//methods
async function getKnowledges(){
  try{
    const {data} = await api.get('knowledge');
    knowledges.value = data.knowledges;

  }catch(e){
    console.error(e);
  }
}
async function deleteKnowledge(id){
  try{
    await api.delete('knowledge/'+ id);
    //reload the list of knowledges
    await getKnowledges();
  }catch(e){
    console.error(e);
  }
}

function pageSwitch(pageNo){
  currentPage.value = pageNo;

}
</script>

<style scoped>

</style>