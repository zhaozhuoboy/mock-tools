<template>
  <div class="empty-container">
    <div class="empty-card">
      <div class="empty-icon">📁</div>
      <h3 class="empty-title">还没有项目</h3>
      <p class="empty-description">创建你的第一个 Mock 项目，开始高效开发之旅</p>
      <NButton 
        type="primary" 
        size="large"
        @click="handleCreateClick"
        round
        class="empty-action-btn"
      >
        <template #icon>
          <NIcon>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </NIcon>
        </template>
        创建第一个项目
      </NButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NButton, NIcon } from 'naive-ui'

// Emits
const emit = defineEmits<{
  create: []
}>()

// 方法
const handleCreateClick = () => {
  emit('create')
}
</script>

<style scoped lang="scss">
.empty-container {
  display: flex;
  justify-content: center;
  padding: 80px 0;
  
  .empty-card {
    // background: rgba(255, 255, 255, 0.95);
    border-radius: 24px;
    padding: 80px 60px;
    text-align: center;
    // box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
    // backdrop-filter: blur(10px);
    max-width: 500px;
    
    .empty-icon {
      font-size: 80px;
      margin-bottom: 24px;
      animation: pulse 2s infinite;
    }
    
    .empty-title {
      font-size: 24px;
      font-weight: 700;
      color: #333;
      margin: 0 0 12px 0;
    }
    
    .empty-description {
      font-size: 16px;
      color: #666;
      margin: 0 0 32px 0;
      line-height: 1.6;
    }
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

// 响应式设计
@media (max-width: 768px) {
  .empty-container {
    padding: 60px 0;
    
    .empty-card {
      padding: 60px 40px;
      margin: 0 16px;
    }
  }
}
</style>
