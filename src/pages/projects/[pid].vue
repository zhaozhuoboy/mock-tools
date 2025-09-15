<template>
  <div class="project-detail-page">
    <div class="header">
      <div class="info">
        <h1 class="name">{{ project.name || '未命名项目' }}</h1>
        <div class="meta">
          <span class="meta-item">项目ID：{{ project.pid }}</span>
          <span class="meta-item">接口数量：{{ apis.length }}</span>
        </div>
      </div>
      <div class="actions">
        <NButton type="primary" round @click="onCreateApi">新建接口</NButton>
      </div>
    </div>

    <div class="api-list">
      <ApiItem
        v-for="(api, idx) in apis"
        :key="api.id"
        :path="api.path"
        :group="api.group"
        :method="api.method"
        :last="idx === apis.length - 1"
        @edit="onEditApi(api)"
        @delete="onDeleteApi(api)"
      />
      <div v-if="apis.length === 0" class="empty">暂无接口</div>
    </div>
    <CreateApiModal
      :show="showCreateApi"
      :loading="creatingApi"
      @update:show="showCreateApi = $event"
      @submit="handleCreateApi"
      @cancel="showCreateApi = false"
    />
  </div>
  
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { NButton, useMessage } from 'naive-ui'
import { useRouter } from 'vue-router'
import ApiItem from '@/components/projects/ApiItem.vue'
import CreateApiModal from '@/components/projects/CreateApiModal.vue'
import ajax from '@/utils/http'

definePageMeta({ layout: 'default' })

interface ApiDef { id: number; path: string; group?: string; method: 'get' | 'post' | 'put' | 'patch' | 'delete', description?: string }
interface ProjectLite { pid: number | string; name: string }

const project = ref<ProjectLite>({ pid: Number(useRoute().params.pid), name: '示例项目' })
const message = useMessage()
const apis = ref<ApiDef[]>([])
const showCreateApi = ref(false)
const creatingApi = ref(false)

useHead({
  title: project.value.name + ' - 项目详情'
})

const router = useRouter()
const loadApis = async () => {
  const res: any = await ajax({ url: `/api/project/${project.value.pid}/interface`, method: 'get' }).catch(err => err)
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
  const data = args[0]
  try {
    creatingApi.value = true
    await ajax({ url: `/api/project/${project.value.pid}/interface`, method: 'post', data })
    showCreateApi.value = false
    await loadApis()
    message.success('接口创建成功')
  } finally {
    creatingApi.value = false
  }
}
const onEditApi = (api: ApiDef) => {}
const onDeleteApi = async (api: ApiDef) => { await loadApis() }

onMounted(() => { loadApis() })
</script>

<style scoped lang="scss">
.project-detail-page {
  min-height: 60vh;
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  
  .info {
    .name {
      margin: 0 0 8px 0;
      font-size: 28px;
      font-weight: 800;
    }
    .meta {
      display: flex;
      gap: 16px;
      color: #666;
      .meta-item { font-size: 13px; }
    }
  }
}

.api-list {
  background: #fff;
  border-radius: 12px;
  padding: 12px 16px;
  border: 1px solid rgba(0,0,0,0.06);
}

.empty {
  padding: 24px;
  text-align: center;
  color: #999;
}
</style>


