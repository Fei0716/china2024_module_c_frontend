<template>

  <div class="flex h-full">
    <!-- Left Sidebar -->
    <LeftSidebar></LeftSidebar>
    <!-- Right Content -->
    <div class="right-content grow">

      <ContentHeader></ContentHeader>

      <!-- Toast Container -->
      <div class="toast-container px-8 pt-3">

      </div>

      <main class="p-8 pt-5">

        <h1 class="flex justify-between items-center">
          <span>Create New Knowledge</span>
        </h1>

        <div class="content">

          <form action="#" @submit.prevent="create">

            <div class="form-control mt-5">
              <label class="form-label">Title</label>
              <input type="text" name="title" class="w-94 " :class="{'form-error': titleError}" v-model="title">
              <p class="form-error-message">{{titleError}}</p>
            </div>

            <div class="form-control mt-5">
              <label class="form-label">Images</label>
              <input type="file" name="file[]" ref="file" @change="uploadImage" :class="{'form-error': fileError}" multiple>
              <p class="form-error-message">{{fileError}}</p>
            </div>

            <div id="image-previews" >
<!--                image previes here-->
            </div>

            <div class="form-control mt-5">
              <label class="form-label">Excerpt</label>
              <input type="text" name="excerpt" class="w-94 " :class="{'form-error': excerptError}" v-model="excerpt">
              <p class="form-error-message">{{excerptError}}</p>
            </div>

            <div class="form-control mt-5">
              <label class="form-label">Content</label>
              <textarea name="content" class="w-94" :class="{'form-error': contentError}" v-model="content"></textarea>
              <p class="form-error-message">{{contentError}}</p>

            </div>

            <div class="form-control mt-5">
              <label class="form-label">Publish Date</label>
              <input type="date" name="date" class="w-94" :class="{'form-error': dateError}" v-model="date">
              <p class="form-error-message">{{dateError}}</p>
            </div>

            <div class="form-control mt-5">
              <div class="form-label">
                <div class="flex">
                  <span class="mr-2">Tags</span>
                  <button class="btn btn-sm" type="button" @click="newTagToggle = true;">Create Tag</button>


                </div>
                <div class="form-control mt-1" v-if="newTagToggle">
                  <label class="form-label">New Tag</label>
                  <input type="text" name="new-tag" class="w-94" v-model="newTag">
                </div>
              </div>
              <div class="tag-list" :class="{'form-error': tagsError}">
                <div class="tag-item" v-for="t of tags" :key="t.id">
                  <input type="checkbox" class="radio"  name="tags" :value="t.id" :id="'tag-' + t.id" v-model="selectedTags">
                  <label :for="'tag-' + t.id">{{t.name}}</label>
                </div>
              </div>
              <p class="form-error-message">{{tagsError}}</p>

            </div>


            <div class="form-footer">
              <button type="submit" class="btn btn-long mr-3">Create</button>
              <RouterLink :to="{name: 'AdminIndex'}" class="link-danger py-2 px-2 text-sm">Cancel</RouterLink>
            </div>

          </form>

        </div>

      </main>

    </div>

  </div>
</template>

<script setup>
//import components
import LeftSidebar from "../../components/LeftSidebar.vue";
import ContentHeader from "../../components/ContentHeader.vue";

import api from '../../api.js';
import {ref} from 'vue';
import router from '../../router.js';


//states
const tags =  ref([]);
const newTagToggle = ref(false);
const hasError = ref(false);
//form models
const title  = ref('');
const excerpt  = ref('');
const file  = ref('');
const content  = ref('');
const date  = ref('');
const images = ref([]);
const selectedTags = ref([]);
const newTag = ref(null);
//form errors
const titleError = ref(null);
const excerptError = ref(null);
const contentError = ref(null);
const dateError = ref(null);
const fileError = ref(null);
const tagsError = ref(null);
//methods call
getTags();

//methods
async function getTags(){
  try{
    const {data}  = await api.get('tag');
    tags.value = data.tags;
  }catch(e){
    console.error(e);
  }
}

function uploadImage(e){
  const files = e.target.files;
  //check whether there 1 - 3 images
  if(files.length < 1 || files.length > 3){
    fileError.value = "Select at least one image and at most three images";
    file.value.value = ''
    setTimeout(()=>{ fileError.value  = null} ,  5000);
    return;
  }

  //load the images previews
  let fileReader;
  const previewsDom = document.querySelector('#image-previews');
  previewsDom.innerHTML = '<h2>Preview Images</h2>';
  for(let f of files){
    fileReader = new FileReader();
    fileReader.onload = (e) =>{
      previewsDom.innerHTML += `
        <img src="${e.target.result}" >
      `;
    }
    fileReader.readAsDataURL(f);
  }

}

function validateInputs(){
  if(title.value.trim() === ''){
    hasError.value = true;
    titleError.value = 'Please fill in the title';
  }
  if(excerpt.value.trim() === ''){
    hasError.value = true;
    excerptError.value = 'Please fill in the excerpt';
  }
  if(content.value.trim() === ''){
    hasError.value = true;
    contentError.value = 'Please fill in the content';
  }
  if(date.value.trim() === ''){
    hasError.value = true;
    dateError.value = 'Please pick a date';
  }
  if(selectedTags.value.length <= 0 && !newTag.value ){
    hasError.value = true;
    tagsError.value = "Select at least one tag or create a new tag. ";
  }
  if(file.value.files.length <= 0){
    hasError.value = true;
    fileError.value = "Select at least one image and at most three images";
  }

  //remove error message after 5sec
  setTimeout(()=>{
    titleError.value = null;
    excerptError.value = null;
    contentError.value = null;
    dateError.value = null;
    tagsError.value= null;
    fileError.value  = null
  } ,  5000);
}
function create(){
  hasError.value = false;
  validateInputs();
  if(hasError.value)return;
  //if no error submit the create request
  createKnowledge();
}

async function createKnowledge(){
  try{
    let formData = new FormData();
    formData.append('title', title.value);
    for (let i = 0; i < file.value.files.length; i++) {
      formData.append('images[]', file.value.files[i]);
    }
    formData.append('excerpt', excerpt.value);
    formData.append('content', content.value);
    formData.append('date', date.value);
    formData.append('newTag', newTag.value);

    formData.append('tags', selectedTags.value);
    await api.post('knowledge',formData);

    //redirect to Admin Index Page
    await router.push({name: 'AdminIndex'});
  }catch(e){
    console.error(e);
  }
}
</script>

<style scoped>
#image-previews{
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  width: 100%;
  overflow-x: auto;
}
</style>