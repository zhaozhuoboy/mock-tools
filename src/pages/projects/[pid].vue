<template>
  <div class="project-detail-page">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <NSkeleton height="60px" width="100%" style="margin-bottom: 16px;" />
      <NSkeleton height="200px" width="100%" />
    </div>
    
    <!-- 错误状态 -->
    <div v-else-if="error" class="error-container">
      <div class="error-content">
        <h2>加载失败</h2>
        <p>{{ error }}</p>
        <NButton type="primary" @click="loadProjectInfo">重新加载</NButton>
      </div>
    </div>
    
    <!-- 正常内容 -->
    <div v-else-if="project">
      <div class="header">
        <div class="info">
          <h1 class="name">{{ project.name }}</h1>
          <div class="description" v-if="project.description">{{ project.description }}</div>
          <div class="meta">
            <span class="meta-item">项目ID：{{ project.pid }}</span>
            <span class="meta-item">接口数量：{{ apis.length }}</span>
            <span class="meta-item" v-if="project.host">域名：{{ project.host }}</span>
            <span class="meta-item">创建时间：{{ formatDate(project.created_at) }}</span>
          </div>
        </div>
        <div class="actions">
          <NButton type="primary" round @click="onCreateApi">新建接口</NButton>
        </div>
      </div>
      <div class="mock-url">
        <NInputGroup>
          <NInputGroupLabel>Mock URL:</NInputGroupLabel>
          <NTooltip
            content="点击复制"
            placement="top"
          >
            <template #trigger>
              <NInput :value="mockUrl" disabled readonly style="flex: 1;" />
            </template>
            <span>MockTools域名/proxy/用户ID/项目ID/接口路径</span>
          </NTooltip>
        </NInputGroup>
        <NButton type="primary" ghost @click="copyMockUrl">复制</NButton>
      </div>

      <div class="api-list">
        <ApiItem
          v-for="(api, idx) in apis"
          :key="api.id"
          :path="api.path"
          :group="api.group"
          :method="api.method"
          :description="api.description"
          :api-data="api"
          :last="idx === apis.length - 1"
          @edit="onEditApi"
          @delete="onDeleteApi"
        />
        <div v-if="apis.length === 0" class="empty">
          <NEmpty size="large" description="没有接口～"></NEmpty>
        </div>
      </div>
    </div>
    
    <CreateApiModal
      :edit-data="currentApi"
      :show="showCreateApi"
      :loading="currentApi ? updatingApi : creatingApi"
      @update:show="showCreateApi = $event"
      @submit="handleCreateApi"
      @edit="handleUpdateApi"
      @cancel="showCreateApi = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { NButton, useMessage, useDialog, NSkeleton, NInput, NInputGroup, NInputGroupLabel, NTooltip, NEmpty } from 'naive-ui'
import { useRouter } from 'vue-router'
import ApiItem from '@/components/projects/ApiItem.vue'
import CreateApiModal from '@/components/projects/CreateApiModal.vue'
import ajax from '@/utils/http'
import type { Project } from '@/types/project'
import { useUserStore } from '@/store/user'

definePageMeta({
  layout: 'default',
  layoutProps: {
    // hideFooter: true
  }
})

interface ApiDef { id: string; path: string; group?: string; method: 'get' | 'post' | 'put' | 'patch' | 'delete', description?: string }

const route = useRoute()
const userStore = useUserStore()
const project = ref<Project | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const message = useMessage()
const dialog = useDialog()
const apis = ref<ApiDef[]>([])
const showCreateApi = ref(false)
const creatingApi = ref(false)
const updatingApi = ref(false)
const currentApi = ref<ApiDef | null>(null)

const router = useRouter()
// 计算 Mock URL
const mockUrl = computed(() => {
  if (!project.value || !userStore.user) return ''

  return `${location.origin}/proxy/${userStore.user.uid}/${project.value.pid}`
})

// 复制到剪贴板
const copyMockUrl = async () => {
  try {
    await navigator.clipboard.writeText(mockUrl.value)
    message.success('已复制到剪贴板')
  } catch (e) {
    message.error('复制失败，请手动复制')
  }
}

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 加载项目详细信息
const loadProjectInfo = async () => {
  try {
    loading.value = true
    error.value = null
    
    const pid = route.params.pid as string
    console.log('loadProjectInfo', pid)
    const res: any = await ajax({ 
      url: `/api/project/${pid}`, 
      method: 'get' 
    }).catch(err => {
      if (err.code === -1003) {
        router.replace('/404')
        return
      }
      return err
    })
    
    project.value = res.project
    // 更新页面标题
    if (project.value) {
      useHead({
        title: `${project.value.name}`,
        meta: [
          { name: 'description', content: project.value.description || `项目 ${project.value.name} 的接口管理页面` }
        ]
      })
    }
  } catch (err: any) {
    error.value = err?.message || '加载项目信息失败'
    console.error('加载项目信息失败:', err)
  } finally {
    loading.value = false
  }
}
const loadApis = async () => {
  if (!project.value) return
  
  const res: any = await ajax({ url: `/api/project/interface/${project.value.pid}`, method: 'get' }).catch(err => err)
  // 当项目不存在时，接口会返回业务错误 code（非 0）且 data: []
  if (res && res.api === 1) {
    // 业务错误
    if (res.code === -1203) {
      router.replace('/404')
      return
    }
  }
  const list = Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : [])
  apis.value = list
}

const onCreateApi = () => { showCreateApi.value = true }
const handleCreateApi = async (...args: any[]) => {
  console.log('handleCreateApi', args)
  const data = args[0]
  if (!project.value) return
  
  try {
    creatingApi.value = true
    const postData = {
      pid: project.value.pid,
      ...data
    }
    await ajax({ url: `/api/project/interface`, method: 'post', data: postData })
    showCreateApi.value = false
    await loadApis()
    message.success('接口创建成功')
  } finally {
    creatingApi.value = false
  }
}
const onEditApi = (api: ApiDef) => {
  currentApi.value = api
  showCreateApi.value = true
}

const onDeleteApi = async (api: ApiDef) => { 
  if (!api || !api.id || !project.value) {
    message.error('接口数据无效')
    return
  }
  
  // 显示确认对话框
  dialog.error({
    title: '确认删除',
    content: `确定要删除接口 "${api.path}" 吗？此操作不可撤销。`,
    positiveText: '删除',
    negativeText: '取消',
    onPositiveClick: async () => {
      try {
        await ajax({ 
          url: `/api/project/interface`, 
          method: 'delete', 
          data: { 
            id: api.id,
            pid: project.value!.pid 
          } 
        })
        await loadApis() 
        message.success('接口删除成功')
      } catch (error: any) {
        console.error('删除接口失败:', error)
        message.error(error?.message || '删除接口失败')
      }
    }
  })
}

const handleUpdateApi = async (data: any) => {
  if (!currentApi.value || !project.value) return
  
  try {
    updatingApi.value = true
    const payload = {
      id: currentApi.value.id,
      pid: project.value.pid,
      ...data
    }
    const res: any = await ajax({ 
      url: `/api/project/interface`, 
      method: 'put', 
      data: payload
    })
    
    showCreateApi.value = false
    currentApi.value = null
    await loadApis()
    message.success('接口更新成功')
  } catch (error: any) {
    message.error(error?.message || '更新失败')
  } finally {
    updatingApi.value = false
  }
}

onMounted(async () => { 
  await loadProjectInfo()
  if (project.value) {
    await loadApis()
  }
})
</script>

<style scoped lang="scss">
.project-detail-page {
  min-height: 60vh;
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px;
}

.loading-container {
  padding: 24px;
}

.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  
  .error-content {
    text-align: center;
    
    h2 {
      margin: 0 0 16px 0;
      color: var(--primary);
    }
    
    p {
      margin: 0 0 24px 0;
      color: var(--text-2);
    }
  }
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  
  .info {
    flex: 1;
    
    .name {
      margin: 0 0 12px 0;
      font-size: 28px;
      font-weight: 800;
      color: var(--text-1);
    }
    
    .description {
      margin: 0 0 16px 0;
      font-size: 16px;
      color: var(--text-2);
      line-height: 1.5;
      max-width: 600px;
    }
    
    .meta {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      color: var(--text-2);
      
      .meta-item { 
        font-size: 14px;
        padding: 4px 8px;
        background: var(--card-hover);
        border-radius: 6px;
      }
    }
  }
  
  .actions {
    margin-left: 24px;
  }
}

.api-list {
  background: var(--card);
  border-radius: 12px;
  padding: 16px;
  border: 1px solid var(--border);
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.empty {
  padding: 48px 24px;
  text-align: center;
  color: var(--text-3);
  font-size: 16px;
}

.mock-url {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 12px 0 20px;
}
</style>


