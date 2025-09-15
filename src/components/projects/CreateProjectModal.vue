<template>
  <NModal 
    :show="show"
    preset="card"
    :title="modalTitle"
    size="huge"
    :bordered="false"
    style="width: 600px"
    class="create-modal"
    @update:show="handleUpdateShow"
  >
    <NForm
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-placement="top"
      label-width="auto"
      require-mark-placement="right-hanging"
      class="create-form"
    >
      <NFormItem label="项目名称" path="name">
        <NInput 
          v-model:value="formData.name"
          placeholder="给你的项目起个好听的名字"
          maxlength="50"
          show-count
          size="large"
        />
      </NFormItem>

      <NFormItem label="项目描述" path="description">
        <NInput 
          v-model:value="formData.description"
          type="textarea"
          placeholder="简单描述一下这个项目的用途（可选）"
          :rows="3"
          maxlength="500"
          show-count
          size="large"
        />
      </NFormItem>

      <NFormItem label="Host" path="host">
        <NInput 
          v-model:value="formData.host"
          placeholder="例如：api.example.com"
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
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </NIcon>
          </template>
          {{ submitText }}
        </NButton>
      </div>
    </template>
  </NModal>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { NModal, NForm, NFormItem, NInput, NButton, NIcon } from 'naive-ui'
import type { Project } from '@/types/project'

// 表单数据接口
interface FormData { id?: number; name: string; description: string; host: string }

// Props
interface Props {
  show: boolean
  loading?: boolean
  mode?: 'create' | 'edit'
  project?: Pick<Project, 'id' | 'name' | 'description' | 'host'>
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  mode: 'create'
})
// 动态标题/提交按钮
const modalTitle = computed(() => (props.mode === 'edit' ? '编辑项目' : '创建新项目'))
const submitText = computed(() => (props.mode === 'edit' ? '保存修改' : '创建项目'))

// Emits
const emit = defineEmits<{
  'update:show': [value: boolean]
  submit: [data: FormData]
  cancel: []
}>()

// 响应式数据
const formRef = ref()
const formData = ref<FormData>({
  id: undefined,
  name: '',
  description: '',
  host: ''
})

// 表单验证规则
const formRules = {
  name: [
    { required: true, message: '请输入项目名称', trigger: 'blur' },
    { min: 2, max: 100, message: '项目名称长度应在2-100个字符之间', trigger: 'blur' }
  ],
  host: [
    { required: true, message: '请输入主机地址', trigger: 'blur' },
    { 
      pattern: /^[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?)*$/,
      message: '请输入有效的主机地址，如：api.example.com',
      trigger: 'blur'
    }
  ]
}


// 监听 show 变化
watch(() => props.show, (newVal) => {
  if (newVal) {
    // 重置表单数据
    formData.value = {
      id: props.project?.id,
      name: '',
      description: '',
      host: ''
    }
    if (props.mode === 'edit' && props.project) {
      formData.value.name = props.project.name || ''
      formData.value.description = props.project.description || ''
      formData.value.host = props.project.host || ''
    }
  }
})

// 方法
const handleUpdateShow = (value: boolean) => {
  emit('update:show', value)
}

const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
    emit('submit', { ...formData.value })
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

const handleCancel = () => {
  emit('update:show', false)
  emit('cancel')
}
</script>

<style scoped lang="scss">
.create-modal {
  .modal-header {
    text-align: center;
    margin-bottom: 32px;
    
    .modal-icon {
      font-size: 48px;
      margin-bottom: 16px;
    }
    
    .modal-title {
      font-size: 24px;
      font-weight: 700;
      color: #1a1a1a;
      margin: 0 0 8px 0;
    }
    
    .modal-subtitle {
      color: #666;
      font-size: 14px;
      margin: 0;
    }
  }
  
  .modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 16px;
    margin-top: 32px;
  }
}
</style>
