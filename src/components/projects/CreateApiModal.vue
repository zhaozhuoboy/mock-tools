<template>
  <NModal 
    :show="show"
    preset="card"
    :title="isEditMode ? '编辑接口' : '新建接口'"
    size="huge"
    :bordered="false"
    style="width: 600px"
    class="create-api-modal"
    @update:show="handleUpdateShow"
  >
    <NForm
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-placement="top"
      label-width="auto"
      require-mark-placement="right-hanging"
      class="create-api-form"
    >
      <NFormItem label="接口路径 Path" path="path">
        <NInput 
          v-model:value="formData.path"
          placeholder="例如：/users/:id 或 /users"
          size="large"
        />
      </NFormItem>

      <NFormItem label="请求方法 Method" path="method">
        <NSelect 
          v-model:value="formData.method"
          :options="methodOptions"
          placeholder="选择请求方法"
          size="large"
        />
      </NFormItem>

      <NFormItem label="所属分组 Group（可选）" path="group">
        <NSelect
          v-model:value="formData.group"
          :options="groupOptions"
          filterable
          clearable
          placeholder="选择或输入新分组名称"
          size="large"
          :tag="true"
          :on-create="handleCreateTag"
        />
      </NFormItem>

      <NFormItem label="接口描述 Description（可选）" path="description">
        <NInput 
          v-model:value="formData.description"
          type="textarea"
          placeholder="简单描述接口用途"
          :rows="3"
          maxlength="500"
          show-count
          size="large"
        />
      </NFormItem>
    </NForm>

    <template #footer>
      <div class="modal-footer">
        <NButton 
          size="large"
          @click="handleCancel"
          round
        >
          取消
        </NButton>
        <NButton 
          type="primary" 
          size="large"
          @click="handleSubmit"
          :loading="loading"
          round
        >
          <template #icon>
            <NIcon>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path v-if="isEditMode" d="M20 6L9 17l-5-5"></path>
                <template v-else>
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </template>
              </svg>
            </NIcon>
          </template>
          {{ isEditMode ? '保存修改' : '创建接口' }}
        </NButton>
      </div>
    </template>
  </NModal>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import { NModal, NForm, NFormItem, NInput, NSelect, NButton, NIcon } from 'naive-ui'
import type { SelectOption } from 'naive-ui'
import { getProjectGroups } from '@/utils/server.request'
import { useRoute } from 'vue-router'

type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete'

interface ApiData {
  id: number
  path: string
  method: HttpMethod
  group?: string
  description?: string
}

interface FormData {
  id?: number
  path: string
  method: HttpMethod | null
  group?: string | null
  description?: string
}

interface Props {
  show: boolean
  loading?: boolean
  editData?: ApiData | null
}

const props = withDefaults(defineProps<Props>(), { 
  loading: false,
  editData: null
})

const emit = defineEmits<{
  'update:show': [value: boolean]
  submit: [data: FormData]
  edit: [data: FormData]
  cancel: []
}>()

// 计算是否为编辑模式
const isEditMode = computed(() => !!props.editData)

const formRef = ref()
const formData = ref<FormData>({
  path: '',
  method: null,
  group: null,
  description: ''
})

const groupOptions = ref<SelectOption[]>([])
const route = useRoute()
const pid = ref<string | number>(route.params.pid as any)

const methodOptions = [
  { label: 'GET', value: 'get' },
  { label: 'POST', value: 'post' },
  { label: 'PUT', value: 'put' },
  { label: 'PATCH', value: 'patch' },
  { label: 'DELETE', value: 'delete' }
]

const formRules = {
  path: [
    { required: true, message: '请输入接口路径', trigger: 'blur' },
    { min: 1, max: 200, message: '路径长度应在 1-200 个字符', trigger: 'blur' }
  ],
  method: [
    { required: true, message: '请选择请求方法', trigger: ['change', 'blur'] }
  ]
}

watch(() => props.show, (val) => {
  if (val) {
    if (props.editData) {
      // 编辑模式：预填充数据
      formData.value = {
        path: props.editData.path || '',
        method: props.editData.method || null,
        group: props.editData.group || null,
        description: props.editData.description || ''
      }
    } else {
      // 创建模式：清空数据
      formData.value = { path: '', method: null, group: null, description: '' }
    }
    loadGroups()
  }
})

// 监听编辑数据变化
watch(() => props.editData, (newEditData) => {
  if (newEditData && props.show) {
    formData.value = {
      path: newEditData.path || '',
      method: newEditData.method || null,
      group: newEditData.group || null,
      description: newEditData.description || ''
    }
  }
})

const loadGroups = async () => {
  try {
    const list = await getProjectGroups(pid.value) as any[]
    groupOptions.value = Array.isArray(list)
      ? list.map((g: any) => ({ label: g.name, value: g.name }))
      : []
  } catch (e) {
    groupOptions.value = []
  }
}

const handleCreateTag = (label: string): SelectOption => {
  const value = String(label).trim()
  if (!value) return { label: '', value: '' }
  if (!groupOptions.value.find(i => i.value === value)) {
    groupOptions.value.push({ label: value, value })
  }
  return { label: value, value }
}

const handleUpdateShow = (value: boolean) => {
  emit('update:show', value)
}

const handleSubmit = async () => {
  console.log('handleSubmit', isEditMode.value)
  await formRef.value?.validate()
  if (isEditMode.value) {
    emit('edit', { 
      id: props.editData?.id,
      path: formData.value.path.trim(),
      method: formData.value.method as HttpMethod | null,
      group: formData.value.group?.trim() || '',
      description: formData.value.description?.trim() || ''
    })
  } else {
    emit('submit', { 
      path: formData.value.path.trim(),
      method: formData.value.method as HttpMethod | null,
      group: formData.value.group?.trim() || '',
      description: formData.value.description?.trim() || ''
    })
  }
  
}

const handleCancel = () => {
  emit('update:show', false)
  emit('cancel')
}
</script>

<style scoped lang="scss">
.create-api-modal {
  .modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 16px;
    margin-top: 12px;
  }
}
</style>


