<template>
  <div class="loading-container">
    <div class="loading-card">
      <NSpin size="large" />
      <p class="loading-text">正在加载项目...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NSpin } from 'naive-ui'
</script>

<style scoped lang="scss">
.loading-container {
  display: flex;
  justify-content: center;
  padding: 80px 0;
  
  .loading-card {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 20px;
    padding: 60px 40px;
    text-align: center;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
    
    .loading-text {
      margin-top: 20px;
      color: #666;
      font-size: 16px;
      font-weight: 500;
    }
  }
}
</style>
