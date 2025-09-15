<template>
  <div class="error-page">
    <NResult status="404" title="页面不存在" description="你访问的页面不存在或已被移除">
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
.error-page {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>


