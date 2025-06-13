<template>

<div class="container">

<div class="container_left">
    <div class="login_button">
           <button class="button"></button>
    </div>
    <div style="width: 100%;height: 50px;"></div>
    <div class="nav_comp" @click="learn">学习</div>
    <div class="nav_comp" @click="entertain">娱乐</div>
    <div class="nav_comp" @click="tool">工具</div>

</div>

<div class="container_right">

    <div class="content_area">
        <div class="time">

          <div class="time_container">

          <div class="time-display">
            {{ time }}
          </div>
          <div class="date-display">
            {{ date }}
          </div>

          </div>

        </div>


        <div class="search-container">
          <div class="search-input-container">
            <i>图标</i>
            <input
            v-model="keyword"
            @keyup.enter="search"
            placeholder="请输入搜索内容"
            class="search-input"
            />
          </div>
        </div>

        <div class="content">
            <div class="inner_container">
                <router-view></router-view>
            </div>
        </div>
    </div>

</div>


  <el-dialog v-model="dialogVisible" title="Tips" width="800px" draggable>

      <el-form :model="form" label-width="auto" style="max-width: 600px">
<el-form :model="form" label-width="auto" style="max-width: 600px">
    <el-form-item label="地址">
      <el-input class="input-long" v-model="form.url" @change="fetchWebsiteInfo"/>
      <span class="get-icon" style="width: 30px;height: 20px;background-color: blue;" @click="fetchWebsiteInfo"></span>
    </el-form-item>

    <el-form-item label="名称">
      <el-input class="input-long" v-model="form.name" />
    </el-form-item>

    <el-form-item label="图标名称">
      <el-input v-model="iconText" class="input-icon-name" maxlength="6" />
    </el-form-item>

  <!-- 其他表单项 -->
</el-form>
     <el-form-item label="图标颜色">
      <el-color-picker v-model="bgColor" show-alpha />
    </el-form-item>
    <!-- <el-form-item>
      <el-button type="primary" @click="onSubmit">Create</el-button>
      <el-button>Cancel</el-button>
    </el-form-item> -->
<div class="icon-container">

<!-- 图标选择区域 -->
<div class="icon-selection">
  <!-- 自定义图标 -->
  <div
    class="icon-option"
    :class="{ active: selectedIconType === 'custom' }"
    @click="selectIcon('custom')"
  >
    <div class="icon-box" ref="iconElement" :style="{ backgroundColor: bgColor }">
  <span
    ref="textElement"
    :style="{ fontSize: fontSize + 'px' }"
  >
    {{ iconText }}
  </span>
</div>
<p class="icon-text">文字图标</p>
  </div>

  <!-- 网站图标 -->
  <div
    class="icon-option"
    :class="{ active: selectedIconType === 'website' }"
    @click="selectIcon('website')"
  >
    <div style="
        border: 3px solid white;
        border-radius: 12.8px;
        width: 48px;
        height: 48px;
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
      ">
      <div v-if="result && imageError">
        <img
          :src="result.icon"
          alt="无图标"
          style="width: 100%; height: 100%; border-radius: 12.8px;"
          @error="handleError"
        />
      </div>
      <strong v-else>无</strong>
    </div>
      <p class="icon-text">官方图标</p>
  </div>
</div>

    </div>

  </el-form>

  <template #footer>
    <div class="dialog-footer">
      <el-button @click="dialogVisible = false">退出</el-button>
      <el-button type="primary" @click="saveIcon">
        保存
      </el-button>
    </div>
  </template>
  </el-dialog>

</div>



</template>

<script lang="ts" setup>

import { ref,onMounted,watch} from 'vue';
import { useRouter, useRoute} from 'vue-router';
import axios from 'axios';
import html2canvas from 'html2canvas'


const userId:any = 123 // 示例用户 ID

//弹窗默认关闭
const dialogVisible = ref(true);


    const saveIcon = async () => {
  if (!selectedIconData.value) {
    alert('请先选择一个图标');
    return;
  }

  try {
    const base64Image = selectedIconData.value;
    const filename = `${iconText.value || 'icon'}-${selectedIconType.value}.png`;

    const response = await axios.post('/user/common/upload', {
      image: base64Image,
      filename
    });

    console.log('保存成功:', response.data);
    alert('图标已保存到服务器目录');
  } catch (error) {
    console.error('保存失败:', error);
    alert('保存出错');
  }
};

//根据url获取图标和名称

interface result{
  title: string;
  icon: string;
}
const result = ref<result>();
const loading = ref(false);


const fetchWebsiteInfo = async () => {

  handleErrorTrue();

  if (!form.value.url) return;

  // 使用 cors-anywhere 代理解决跨域问题（仅用于开发测试）
  const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
  const targetUrl = form.value.url.trim();

  loading.value = true;
  try {
    const response = await fetch(proxyUrl + targetUrl);
    const html = await response.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const title = doc.querySelector('title')?.innerText || '无标题';

    let icon = null;
    const iconLink = doc.querySelector('link[rel="icon"], link[rel="shortcut icon"]');
    if (iconLink) {
      const href = iconLink.getAttribute('href');
      // 处理相对路径
      if(href){
      icon = new URL(href, targetUrl).href;
    }
    } else {
      // 默认尝试查找根目录下的 favicon.ico
      icon = new URL('/favicon.ico', targetUrl).href;
    }
    if(icon){
    result.value = { title, icon };
    console.log(result.value.icon)
    }
  } catch (error) {
    console.error('获取失败:', error);
    alert('无法获取网站信息，请检查链接或跨域权限');
  }
  loading.value = false;
};


async function uploadImage(event:any) {
  const file = event.target.files[0]
  if (!file) return

  const formData = new FormData()
  formData.append('file', file)
  formData.append('userId', userId) // 关键点：传入所属 ID

  try {
    const res = await axios.post('/admin/common/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    console.log('图片地址:', res.data.url)
  } catch (error) {
    console.error('上传失败:', error)
  }
}

const iconText = ref()       // 图标显示的文字
const bgColor = ref('#ffc200')  // 图标背景颜色



const iconElement = ref<HTMLElement | null>(null)
const textElement = ref<HTMLElement | null>(null)
const fontSize = ref(16)

function resizeText() {
  if (!iconElement.value || !textElement.value || !iconText.value.trim()) {
    fontSize.value = 16
    return
  }

  const container = iconElement.value
  const textSpan = textElement.value

  requestAnimationFrame(() => {
    const containerWidth = container.clientWidth
    const textWidth = textSpan.scrollWidth

    if (textWidth > containerWidth) {
      const scale = containerWidth / textWidth * 0.95
      fontSize.value = Math.floor(16 * scale)
    } else {
      fontSize.value = 16
    }
  })
}

onMounted(() => {
  setTimeout(() => {
    resizeText()
    window.addEventListener('resize', resizeText)
  }, 100)
})

watch(iconText, () => {
  setTimeout(resizeText, 50)
})

const router = useRouter();

const route = useRoute();

const time = ref();

const date = ref();

// do not use same name with ref
const form = ref({
  name: '',
  url: 'http://'
})

const onSubmit = () => {
  console.log('submit!')
}

function learn(){
  router.push("/container/learn")
}

function entertain(){
  router.push("/container/entertain");

}

function tool(){
  router.push("/container/tool")

}

function getTime(){
  const now = new Date();

  // 获取当前时间
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  time.value = hours + ":" + minutes

  // 获取当前日期
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  };
  const formattedDate = now.toLocaleDateString('zh-CN', options);
  date.value = formattedDate

}

setInterval(getTime, 1000);

const keyword = ref('')

function search() {
  const key = keyword.value.trim()
  if (!key) {
    alert('请输入关键词')
    return
  }

  // bing
  const encodedKey = encodeURIComponent(key)
  window.open(`https://www.bing.com/search?q=${encodedKey}`, '_blank')
}

onMounted(()=>{
  getTime();
})

const imageError = ref(true)

function handleError(){
  imageError.value = false;
}

function handleErrorTrue(){
  imageError.value = true;
}


const selectedIconType = ref<'custom' | 'website' | null>('custom'); // 当前选中的图标类型
const selectedIconData = ref<string | null>(null); // 存储选中的图标数据（base64 或 URL）

// 点击选择图标
const selectIcon = async (type: 'custom' | 'website') => {
  selectedIconType.value = type;

  if (type === 'custom' && iconElement.value) {
    // 使用 html2canvas 将自定义图标转为 base64
    const canvas = await html2canvas(iconElement.value, { backgroundColor: null });
    const base64 = canvas.toDataURL('image/png');
    selectedIconData.value = base64;
  } else if (type === 'website' && result.value?.icon) {
    // 直接使用网站图标的 URL
    selectedIconData.value = result.value.icon;
  }

  console.log('选中图标:', selectedIconData.value);
};


</script>

<style scoped>

.container{
  display: flex;
}

.container_left{
    background-color: rgba(56, 56, 56, 0.30);
    height: 100%;
    /* 元素整体透明度为 50% */
    display: flex;
    flex-direction: column;
    flex: 1 0 60px;/*flex-grow为1 flex-shrink为1 flex-basic为80px*/
    backdrop-filter: blur(6px);
}

.container_right{
    height: 100%;
    display: flex;
    flex-direction: column;
    flex: 40 0 1100px;
    backdrop-filter: blur(3px);

    /* opacity: 0.2; */
    /* 元素整体透明度为 50% */
}

.content_area{
    flex-grow: 9;
    display: flex;
    flex-direction: column;
    flex: 9 0 300px;
}

.time{
    background-color: rgb(89 89 89 / 30%);
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    flex: 1 0 100px;
}

.time_container{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.time-display {
  font-size: 70px; /* 大号时间 */
  font-family: Arial, sans-serif;
  text-align: center;
  color: white;
  text-shadow: 0 2px 6px rgb(0 0 0 / 16%);

}

.date-display {
  font-size: 17px; /* 较小的日期文字 */
  font-family: Arial, sans-serif;
  text-align: center;
  color: white;
  text-shadow: 0 2px 6px rgb(0 0 0 / 16%);
}


.search-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1 0 100px;
  background-color: rgb(89 89 89 / 30%);
}

.search-input-container{
  width: 500px;
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.383);
  border-radius: 25px;
}

.search-input {
  width: 400px;
  font-size: 16px;
  background-color: transparent;
  border: none;
  outline: none;
  margin-left: 43px;
}

input::placeholder{
  color: black;

}


.content{
    display: flex;
    flex: 8 0 300px;
    background-color: rgb(89 89 89 / 30%);
    /* 这里再加flex inner就会拉伸填满容器 */
    justify-content: center;
    align-items: flex-start;
}

.inner_container{
    display: flex;
    flex-wrap: wrap;
    width: 60%;
    gap: 25px;
    margin-top: 30px;
}



.inner_content{
    width: 60px;
    height: 60px;

}




.login_button{
    width: 100%;
    height: 75px;
    background-color: transparent;
    display: flex;
    justify-content: center;
    align-items: center;
}

.login_button .button{
    width: 30px;
    height: 30px;
    background-color:rgb(137, 89, 89);
    border: 0px;
    border-radius: 100%;
    cursor: pointer;
}

.nav_comp{
    background-color: transparent;
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    transition: background-color 0.2s;
    cursor: pointer;
}

.nav_comp:hover{
    background-color: rgba(218, 208, 208, 0.224);
}


:deep(.el-dialog){
  background-color: rgba(255, 255, 255, 0.6); /* 半透明白 */
  backdrop-filter: blur(6px) brightness(95%); /* 毛玻璃效果 */
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  height: 70%;
  padding: 40px;
}

:deep(.el-dialog__wrapper .el-overlay){
  background-color: rgba(255, 255, 255, 0.3); /* 遮罩层也透明 */
}

:deep(.el-dialog__body){
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

:deep(.el-input__wrapper){
  background-color: rgba(255, 255, 255, 0.6); /* 半透明白 */
  margin-left: 20px;
}


.icon-box {
  width: 48px;
  height: 48px;
  background-color: #ffc200;
  color: #fff;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 12.8px;
  overflow: hidden;
  white-space: nowrap;
}

.icon-box span {
  font-size: v-bind('fontSize');
  transition: font-size 0.2s ease;
}

.input-long {
  width: 400px;
}

.input-icon-name {
  width: 100px;
}


.icon-container{
  display: flex;
  gap: 10px;
}

.icon-selection {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.icon-option {
  cursor: pointer;
  padding: 5px;
  transition: transform 0.2s ease, border 0.2s ease;
  border: 2px solid transparent;
}

.icon-option.active {
  border: 2px solid #409EFF; /* 选中时的边框颜色 */
  transform: scale(1.1);
}

.dialog-footer{
  margin-top: 45px;
}

.icon-text{
  font-size: 12px;
  text-align: center;
  margin-top: 7px;
  color: black;
}



@media (min-width:2560px){
    .container_left{
        flex: 1 0 26px;/*flex-grow为1 flex-shrink为1 flex-basic为80px*/
    }


}

</style>
