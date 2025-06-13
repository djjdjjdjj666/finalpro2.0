<script lang="ts" setup>
import Container from './view/Container.vue';
</script>

<template>

<router-view></router-view>

</template>

<style>


body, html{
    height: 100%;
    width: 100%;
}

body{
    background-image: url("./assets/image/im.jpg");
    background-size: cover;
}

#app{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    height: 100%;
    width: 100%;
}

.container{
    width: 100%;
    height: 100%;
}

.el-dialog {
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(6px) brightness(95%);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.el-dialog__wrapper .el-overlay {
  background-color: rgba(255, 255, 255, 0.3);
}

</style>
