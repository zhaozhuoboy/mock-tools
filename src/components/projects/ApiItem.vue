<template>
  <div class="api-item">
    <div class="left">
      <NTag :type="methodType" size="small" round class="method">{{ method.toUpperCase() }}</NTag>
      <span class="path">{{ path }}</span>
      <NTag v-if="group" size="small" class="group">{{ group }}</NTag>
      <span v-if="description" class="desc">{{ description }}</span>
    </div>
    <div class="right">
      <NButton size="small" quaternary @click="emit('edit')">
        编辑
      </NButton>
      <NButton size="small" quaternary type="error" @click="emit('delete')">
        删除
      </NButton>
    </div>
  </div>
  <NDivider v-if="!last" class="divider" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NButton, NTag, NDivider } from 'naive-ui'

interface Props {
  path: string
  group?: string
  method: 'get' | 'post' | 'put' | 'patch' | 'delete'
  last?: boolean
  description?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{ edit: []; delete: [] }>()

const methodType = computed(() => {
  const m = props.method.toLowerCase()
  if (m === 'get') return 'success'
  if (m === 'post') return 'primary'
  if (m === 'put' || m === 'patch') return 'warning'
  if (m === 'delete') return 'error'
  return 'default'
})
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
      color: #333;
    }
    .group {
      background: rgba(102, 126, 234, 0.08);
      border: 1px solid rgba(102, 126, 234, 0.18);
    }
    .desc {
      color: #666;
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
}
</style>


