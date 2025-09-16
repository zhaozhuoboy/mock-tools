<template>
  <div class="api-item">
    <div class="left">
      <NTag :type="methodType" size="small" round class="method">{{ method.toUpperCase() }}</NTag>
      <span class="path">{{ path }}</span>
      <NTag v-if="group" size="small" class="group">{{ group }}</NTag>
      <span v-if="description" class="desc">{{ description }}</span>
    </div>
    <div class="right">
      <NButton size="small" quaternary type="info" @click="handleEdit">
        编辑
      </NButton>
      <NButton size="small" quaternary type="error" @click="handleDelete">
        删除
      </NButton>
      <NButton size="small" quaternary type="primary" @click="handleDetail">
        详情
      </NButton>
    </div>
  </div>
  <NDivider v-if="!last" class="divider" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NButton, NTag, NDivider } from 'naive-ui'
import { useRouter } from 'vue-router'

interface ApiData {
  id: string // 改为 UUID 类型
  path: string
  method: 'get' | 'post' | 'put' | 'patch' | 'delete'
  group?: string
  description?: string
}

interface Props {
  path: string
  group?: string
  method: 'get' | 'post' | 'put' | 'patch' | 'delete'
  last?: boolean
  description?: string
  apiData?: ApiData
}

const props = defineProps<Props>()
const emit = defineEmits<{ edit: [apiData: ApiData]; delete: [apiData: ApiData] }>()
const router = useRouter()
const methodType = computed(() => {
  const m = props.method.toLowerCase()
  if (m === 'get') return 'success'
  if (m === 'post') return 'primary'
  if (m === 'put' || m === 'patch') return 'warning'
  if (m === 'delete') return 'error'
  return 'default'
})

const handleEdit = () => {
  if (props.apiData) {
    emit('edit', props.apiData)
  }
}

const handleDelete = () => {
  console.log('handleDelete called, props.apiData:', props.apiData)
  if (props.apiData) {
    emit('delete', props.apiData)
  } else {
    console.error('apiData is undefined or null')
  }
}

const handleDetail = () => {
  if (props.apiData) {
    router.push(`/projects/api/${props.apiData.id}`)
  }
}
</script>

<style scoped lang="scss">
.api-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;

  .left {
    display: flex;
    align-items: center;
    gap: 12px;

    .method {
      font-weight: 600;
    }
    .path {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
      color: var(--text-1);
    }
    .group {
      background: var(--primary-tint-1);
      border: 1px solid var(--primary-tint-2);
    }
    .desc {
      color: var(--text-2);
      font-size: 12px;
      margin-left: 8px;
    }
  }

  .right {
    display: flex;
    gap: 8px;
  }
}

.divider {
  margin: 0;
  height: 1px;
  // background-color: var(--border);
  // border-color: var(--border);
}
</style>


