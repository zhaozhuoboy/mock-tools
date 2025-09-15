<template>
  <div class="not-found-page">
    <NResult status="404" title="页面不存在" description="该页面可能已被移除或地址错误">
      <template #footer>
        <NButton type="primary" @click="goHome">返回首页</NButton>
      </template>
    </NResult>
  </div>
  
</template>

<script setup lang="ts">
import { NResult, NButton } from 'naive-ui'
const goHome = () => navigateTo('/')
</script>

<style scoped lang="scss">
.not-found-page {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>


