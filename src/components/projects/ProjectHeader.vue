<template>
  <div class="page-header">
    <div class="header-content">
      <div class="title-section">
        <div class="title-wrapper">
          <h1 class="page-title">
            <span class="title-icon">🚀</span>
            项目管理
          </h1>
          <p class="page-description">高效管理你的 Mock 服务项目，让开发更简单</p>
          
        </div>
      </div>
      <div class="stats-row">
        <div class="stat-item">
          <span class="stat-number">{{ totalProjects }}</span>
          <span class="stat-label">项目</span>
        </div>
      </div>
      <div class="action-section">
        <NButton 
          type="primary" 
          size="large"
          @click="handleCreateClick"
          class="create-btn"
          round
        >
        <n-icon size="40">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path
              d="M368.5 240H272v-96.5c0-8.8-7.2-16-16-16s-16 7.2-16 16V240h-96.5c-8.8 0-16 7.2-16 16 0 4.4 1.8 8.4 4.7 11.3 2.9 2.9 6.9 4.7 11.3 4.7H240v96.5c0 4.4 1.8 8.4 4.7 11.3 2.9 2.9 6.9 4.7 11.3 4.7 8.8 0 16-7.2 16-16V272h96.5c8.8 0 16-7.2 16-16s-7.2-16-16-16z"
            />
          </svg>
        </n-icon>
        </NButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NButton, NIcon } from 'naive-ui'

// Props
interface Props {
  totalProjects: number
}

const props = defineProps<Props>()

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
.page-header {
  position: relative;
  z-index: 1;
  padding: 32px 24px 0;
  
  .header-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 24px;
    
    .title-section {
      flex: 1;
      
      .title-wrapper {
        .page-title {
          font-size: 36px;
          font-weight: 700;
          color: var(--text-1);
          margin: 0 0 12px 0;
          display: flex;
          align-items: center;
          gap: 12px;
          
          .title-icon {
            font-size: 32px;
            animation: bounce 2s infinite;
          }
        }
        
        .page-description {
          font-size: 16px;
          color: var(--text-2);
          margin: 0 0 20px 0;
          line-height: 1.5;
        }
        
      }
    }
  }
}

.stats-row {
  display: flex;
  gap: 24px;
}

.stat-item {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80px;
  height: 80px;
  padding: 12px 0;
  background: var(--card-hover);
  border-radius: 12px;
  border: 1px solid var(--border);
  
  .stat-number {
    line-height: 1;
    font-size: 30px;
    font-weight: 600;
    color: var(--text-1);
    margin-bottom: 4px;
  }
  
  .stat-label {
    font-size: 13px;
    color: var(--text-2);
  }
}

.action-section .create-btn {
  width: 80px;
  height: 80px;
  line-height: 80px;
  font-size: 14px;
  padding: 12px 0;
  border-radius: 10px;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

// 响应式设计
@media (max-width: 768px) {
  .page-header {
    padding: 20px 16px;
    
    .header-content {
      flex-direction: column;
      gap: 20px;
      
      .title-section .title-wrapper {
        .page-title {
          font-size: 28px;
          flex-direction: column;
          align-items: flex-start;
          gap: 8px;
        }
        
        .page-description {
          font-size: 14px;
        }
        
        .stats-row {
          gap: 16px;
          
          .stat-item {
            padding: 10px 16px;
            
            .stat-number {
              font-size: 18px;
            }
            
            .stat-label {
              font-size: 12px;
            }
          }
        }
      }
      
      .action-section .create-btn {
        font-size: 14px;
        padding: 12px 0;
        line-height: 80px;
        width: 80px;
        height: 80px;
      }
    }
  }
}
</style>
