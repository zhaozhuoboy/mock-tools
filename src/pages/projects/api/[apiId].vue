<template>
  <div class="page-api">
    <NSpin :show="loading">
      <!-- 页面头部 -->
      <div class="api-header">
        <NCard>
          <div class="header-content">
            <div class="api-info">
              <div class="api-title">
                <NTag :type="getMethodType(apiInfo?.method)" size="large">
                  {{ apiInfo?.method?.toUpperCase() }}
                </NTag>
                <span class="api-path">{{ apiInfo?.path }}</span>
              </div>
              <div class="api-description" v-if="apiInfo?.description">
                {{ apiInfo.description }}
              </div>
              <div class="project-info" v-if="apiInfo?.project">
                <NText depth="3">
                  项目：{{ apiInfo.project.name }}
                  <span v-if="apiInfo.project.host"> | Host：{{ apiInfo.project.host }}</span>
                </NText>
              </div>
            </div>
            
            <div class="data-selector">
              <NSelect
                v-model:value="selectedDetailId"
                :options="detailOptions"
                placeholder="选择数据"
                style="width: 200px; margin-right: 12px;"
                @update:value="handleDetailChange"
              />
              <NButton type="primary" @click="showCreateModal = true">
                <template #icon>
                  <NIcon><PlusOutlined /></NIcon>
                </template>
                新建数据
              </NButton>
            </div>
          </div>
        </NCard>
      </div>

      <!-- 数据详情展示区域 -->
      <div class="api-detail-content">
        <NCard v-if="currentDetail">
          <template #header>
            <div class="detail-header">
              <span>当前数据：{{ currentDetail.name }}</span>
            </div>
          </template>
          
          <div class="detail-content">
            <MonacoEditor
              :modelValue="currentDetail?.payload || ''"
              :readOnly="true"
              :height="'calc(100vh - 420px)'"
              :autoFormatOnMount="true"
            />
          </div>
        </NCard>
        
        <NEmpty v-else description="请选择或创建数据" />
      </div>
    </NSpin>

    <!-- 新建数据抽屉 -->
    <CreateApiDetailModal
      :show="showCreateModal"
      :api-id="apiId"
      @update:show="showCreateModal = $event"
      @success="handleCreateSuccess"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { PlusOutlined } from '@vicons/antd'
import MonacoEditor from '@/components/common/MonacoEditor.vue'
import CreateApiDetailModal from '@/components/projects/CreateApiDetailModal.vue'
import { 
  NSpin, 
  NCard, 
  NTag, 
  NText, 
  NSelect, 
  NButton, 
  NIcon, 
  NEmpty,
  useMessage 
} from 'naive-ui'
import type { ApiDetail, ApiInfoResponse } from '@/types/api-detail'

// 获取 message API
const message = useMessage()

definePageMeta({ 
  layout: 'default'
})

const route = useRoute()
const apiId = route.params.apiId as string

// 响应式数据
const loading = ref(false)
const showCreateModal = ref(false)
const apiInfo = ref<ApiInfoResponse['data']['api'] | null>(null)
const details = ref<ApiDetail[]>([])
const selectedDetailId = ref<string>('')

// 计算属性
const detailOptions = computed(() => {
  return details.value.map((detail: ApiDetail) => ({
    label: `${detail.name}`,
    value: detail.id
  }))
})

const currentDetail = computed(() => {
  return details.value.find((detail: ApiDetail) => detail.id === selectedDetailId.value)
})

// 方法
const getMethodType = (method?: string): 'default' | 'warning' | 'error' | 'primary' | 'info' | 'success' => {
  const typeMap: Record<string, 'default' | 'warning' | 'error' | 'primary' | 'info' | 'success'> = {
    get: 'info',
    post: 'success',
    put: 'warning',
    patch: 'warning',
    delete: 'error'
  }
  return typeMap[method || 'get'] || 'default'
}

const loadApiInfo = async () => {
  try {
    loading.value = true
    const response = await $fetch<ApiInfoResponse>('/api/project/interface/info', {
      method: 'POST',
      body: { apiId }
    })
    
    if (response.success) {
      apiInfo.value = response.data.api
      details.value = response.data.details
      
      // 设置默认选中的数据（当前活跃的数据）
      const activeDetail = details.value.find((detail: ApiDetail) => detail.is_active)
      if (activeDetail) {
        selectedDetailId.value = activeDetail.id
      } else if (details.value.length > 0) {
        selectedDetailId.value = details.value[0].id
      }
    }
  } catch (error) {
    console.error('加载 API 信息失败:', error)
    message.error('加载 API 信息失败')
  } finally {
    loading.value = false
  }
}

const handleDetailChange = async (detailId: string) => {
  try {
    await $fetch('/api/project/interface/set-active', {
      method: 'POST',
      body: { id: detailId }
    })
    
    // 更新本地状态
    details.value.forEach((detail: ApiDetail) => {
      detail.is_active = detail.id === detailId
    })
    
    message.success('切换成功')
  } catch (error) {
    console.error('切换数据失败:', error)
    message.error('切换数据失败')
    // 恢复原选择
    const activeDetail = details.value.find((detail: ApiDetail) => detail.is_active)
    selectedDetailId.value = activeDetail?.id || ''
  }
}

const handleCreateSuccess = async () => {
  // 重新加载数据
  await loadApiInfo()
}

// 生命周期
onMounted(async () => {
  await loadApiInfo()
})
</script>

<style lang="scss" scoped>
.page-api {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.api-header {
  margin-bottom: 20px;
  
  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 20px;
  }
  
  .api-info {
    flex: 1;
    
    .api-title {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 8px;
      
      .api-path {
        font-size: 18px;
        font-weight: 500;
        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      }
    }
    
    .api-description {
      color: #666;
      margin-bottom: 8px;
    }
    
    .project-info {
      font-size: 14px;
    }
  }
  
  .data-selector {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }
}

.api-detail-content {
  .detail-header {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .detail-content {
  }
}

@media (max-width: 768px) {
  .api-header .header-content {
    flex-direction: column;
    align-items: stretch;
  }
  
  .data-selector {
    justify-content: space-between;
  }
}
</style>
