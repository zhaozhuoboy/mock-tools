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
          <div class="stats-row">
            <div class="stat-item">
              <span class="stat-number">{{ totalProjects }}</span>
              <span class="stat-label">个项目</span>
            </div>
          </div>
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
          <template #icon>
            <NIcon size="18">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </NIcon>
          </template>
          创建新项目
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
  padding: 32px 24px;
  
  .header-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 40px;
    
    .title-section {
      flex: 1;
      
      .title-wrapper {
        .page-title {
          font-size: 36px;
          font-weight: 700;
          color: #1a1a1a;
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
          color: #666;
          margin: 0 0 20px 0;
          line-height: 1.5;
        }
        
        .stats-row {
          display: flex;
          gap: 24px;
          
          .stat-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 12px 20px;
            background: #f8f9fa;
            border-radius: 12px;
            border: 1px solid #e9ecef;
            
            .stat-number {
              font-size: 20px;
              font-weight: 600;
              color: #1a1a1a;
              margin-bottom: 4px;
            }
            
            .stat-label {
              font-size: 13px;
              color: #666;
            }
          }
        }
      }
    }
    
    .action-section {
      .create-btn {
        background: linear-gradient(135deg, #ff6b6b, #ee5a24);
        border: none;
        box-shadow: 0 4px 16px rgba(255, 107, 107, 0.3);
        font-weight: 600;
        font-size: 15px;
        padding: 14px 28px;
        transition: all 0.3s ease;
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
        }
      }
    }
  }
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
        padding: 12px 24px;
      }
    }
  }
}
</style>
