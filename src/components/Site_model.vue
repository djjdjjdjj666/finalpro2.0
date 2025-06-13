<template>

<div v-for="(values, index) in site_item" :key="index">
  <a class="site" :href="values.url"></a>
  <!-- :style="{backgroundImage : 'url(' + values.image + ')'}" -->
  <p class="site-text">{{ values.name }}</p>
</div>

<div>
  <div class="site" style='background-image: url("https://files.codelife.cc/icons/add.svg");
  background-color: white;' @click="dialogVisible = true"></div>
  <p class="site-text">添加图标</p>
</div>


</template>

<script lang="ts" setup>
import { ref,onMounted,watch } from 'vue';
import axios from 'axios';
import { useRoute,useRouter } from 'vue-router';

const route = useRoute();

const router = useRouter();

//对话框默认隐藏
const dialogVisible = ref(true)

interface SiteItem {
  name: string;
  url: string;
  image:string;
}

const site_item = ref<SiteItem[]>([]);

const parentId = 1;

onMounted(()=>{
  switch(route.path){

    case "/container/learn":
      axios.get("/user/site/1").then((response) => {
        console.log(response.data)
        site_item.value = response.data.data
      })
      break;

    case "/container/entertain":
      axios.get("/user/site/2").then((response) => {
        console.log(response.data)
        site_item.value = response.data.data
      })
      break;

    case "/container/tool":
      axios.get("/user/site/3").then((response) => {
        console.log(response.data)
        site_item.value = response.data.data
      })
      break;

  }
  console.log(route.path)
})

watch(() => route.path, (newPath) =>{
  switch(newPath){
    case "/container/learn":
      axios.get("/user/site/1").then((response) => {
        console.log(response.data)
        site_item.value = response.data.data
      })
      break;

    case "/container/entertain":
      axios.get("/user/site/2").then((response) => {
        console.log(response.data)
        site_item.value = response.data.data
      })
      break;

    case "/container/tool":
      axios.get("/user/site/3").then((response) => {
        console.log(response.data)
        site_item.value = response.data.data
      })
      break;
  }
})


</script>


<style scoped>

.site {
  display: inline-block;
  width: 48px;
  height: 48px;
  text-align: center;
  cursor: pointer;
  border-radius: 12.8px;
  /* transition: background-color 0.3s ease; */
  background-size: cover;
  background-image: url("https://files.codelife.cc/icons/coze.cn.svg");
}

.site:hover {
  background-color: #f0f0f03a;
}

.site-text{
  font-size: 12px;
  text-align: center;
  margin-top: 7px;
  line-height: 1px;
  color: white;
}



</style>
