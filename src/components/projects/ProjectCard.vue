<template>
  <div 
    class="project-card"
    :style="{ '--delay': delay + 's' }"
    @click="handleClick"
  >
    <div class="card-header">
      <div class="project-icon">
        <span class="icon-emoji">{{ projectIcon }}</span>
      </div>
      <div class="project-info">
        <h3 class="project-name">{{ project.name }}</h3>
      </div>
      <NDropdown 
        :options="actionOptions"
        @select="handleActionSelect"
        trigger="click"
        placement="bottom-end"
        @click.stop
      >
        <NButton quaternary circle size="small" class="action-btn" @click.stop>
          <template #icon>
            <NIcon size="16">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="12" cy="5" r="1"></circle>
                <circle cx="12" cy="19" r="1"></circle>
              </svg>
            </NIcon>
          </template>
        </NButton>
      </NDropdown>
    </div>

    <div class="card-body">
      <p class="project-description" v-if="project.description">
        {{ project.description }}
      </p>
      <div class="project-meta">
        <div class="meta-item">
          <NIcon size="16" class="meta-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>
          </NIcon>
          <span class="meta-text">{{ project.host || '未配置 Host' }}</span>
        </div>
        <div class="meta-item">
          <NIcon size="16" class="meta-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <path d="M9 9h6v6H9z"></path>
            </svg>
          </NIcon>
          <span class="meta-text">PID: {{ project.pid }}</span>
        </div>
      </div>
    </div>

    <div class="card-footer">
      <div class="footer-left">
        <span class="create-time">
          <NIcon size="14">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12,6 12,12 16,14"></polyline>
            </svg>
          </NIcon>
          {{ formattedDate }}
        </span>
      </div>
      <div class="footer-right">
        <NButton 
          text 
          type="primary" 
          size="small"
          @click.stop="handleClick"
        >
          进入项目
          <template #icon>
            <NIcon size="14">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7,7 17,7 17,17"></polyline>
              </svg>
            </NIcon>
          </template>
        </NButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, h } from 'vue'
import { NButton, NIcon, NDropdown, useDialog, useMessage } from 'naive-ui'
import ajax from '../../utils/http'

// 导入项目类型
import type { Project } from '../../types/project'

// Props
interface Props {
  project: Project
  delay?: number
}

const props = withDefaults(defineProps<Props>(), {
  delay: 0
})

// Emits
const emit = defineEmits<{
  click: [project: Project]
  edit: [project: Project]
  copy: [project: Project]
  delete: [project: Project]
}>()

// 计算属性
const projectIcon = computed(() => {
  const icons = ['🚀', '⚡', '🔥', '💎', '🌟', '🎯', '🚀', '⚡', '🔥', '💎']
  const hash = props.project.name.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0)
    return a & a
  }, 0)
  return icons[Math.abs(hash) % icons.length]
})


const formattedDate = computed(() => {
  return new Date(props.project.created_at).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
})

const actionOptions = computed(() => [
  {
    label: '编辑项目',
    key: 'edit',
    icon: () => h('span', '✏️'),
    props: {
      onClick: () => emit('edit', props.project)
    }
  },
  {
    label: '删除项目',
    key: 'delete',
    icon: () => h('span', '🗑️'),
    props: {
      onClick: () => confirmDelete()
    }
  }
])

// 方法
const handleClick = () => {
  emit('click', props.project)
}

const handleActionSelect = (key: string) => {
  // 操作已在 actionOptions 中定义
}

const dialog = useDialog()
const message = useMessage()
const confirmDelete = () => {
  dialog.warning({
    title: '删除确认',
    content: `确定删除项目「${props.project.name}」吗？该操作不可恢复。`,
    positiveText: '删除',
    negativeText: '取消',
    onPositiveClick: async () => {
      try {
        await ajax({
          url: `/api/project/${props.project.id}`,
          method: 'delete'
        })
        message.success('删除成功')
        emit('delete', props.project)
      } catch (err) {
        message.error('删除失败')
      }
    }
  })
}
</script>

<style scoped lang="scss">
.project-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid #f0f0f0;
  animation: slideInUp 0.6s ease-out var(--delay, 0s);
  animation-fill-mode: both;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    border-color: #e0e0e0;
  }
  
  .card-header {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 12px;
    
    .project-icon {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      
      .icon-emoji {
        font-size: 18px;
      }
    }
    
    .project-info {
      flex: 1;
      
      .project-name {
        font-size: 15px;
        font-weight: 600;
        color: #1a1a1a;
        margin: 0;
        line-height: 1.3;
      }
    }
    
    .action-btn {
      opacity: 0.6;
      transition: opacity 0.3s ease;
      
      &:hover {
        opacity: 1;
      }
    }
  }
  
  .card-body {
    margin-bottom: 12px;
    
    .project-description {
      color: #666;
      font-size: 12px;
      line-height: 1.4;
      margin: 0 0 10px 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    .project-meta {
      display: flex;
      flex-direction: column;
      gap: 8px;
      
      .meta-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 6px 10px;
        background: rgba(102, 126, 234, 0.05);
        border-radius: 6px;
        
        .meta-icon {
          color: #667eea;
          flex-shrink: 0;
        }
        
        .meta-text {
          color: #555;
          font-size: 11px;
          font-weight: 500;
          word-break: break-all;
        }
      }
    }
  }
  
  .card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 12px;
    border-top: 1px solid rgba(0, 0, 0, 0.05);
    
    .footer-left {
      .create-time {
        color: #999;
        font-size: 10px;
        display: flex;
        align-items: center;
        gap: 4px;
      }
    }
    
    .footer-right {
      .n-button {
        font-weight: 500;
        font-size: 12px;
      }
    }
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// 响应式设计
@media (max-width: 768px) {
  .project-card {
    padding: 14px;
  }
}
</style>
