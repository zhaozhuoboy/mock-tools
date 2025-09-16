<template>
  <NDrawer 
    :show="show" 
    :width="600"
    placement="right"
    title="新建数据" 
    @update:show="emit('update:show', $event)"
  >
    <NDrawerContent>
      <NSpace justify="end">
        <NButton type="primary" @click="handleFillPreset">
          填充预置数据
        </NButton>
      </NSpace>
      <NForm ref="formRef" :model="form" :rules="formRules" label-placement="top">
        <NFormItem label="数据标签" path="name">
          <NInput v-model:value="form.name" placeholder="请输入数据标签" />
        </NFormItem>
        <NFormItem path="payload">
          <template #label>
            数据内容
          </template>
          <MonacoEditor
            v-model:modelValue="form.payload"
            :height="'calc(100vh - 420px)'"
            :autoFormatOnMount="true"
          />
        </NFormItem>
      </NForm>
      
      <template #footer>
        <NSpace justify="end">
          <NButton @click="handleCancel">取消</NButton>
          <NButton type="primary" :loading="loading" @click="handleSubmit">
            创建
          </NButton>
        </NSpace>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import MonacoEditor from '@/components/common/MonacoEditor.vue'
import { 
  NDrawer,
  NDrawerContent,
  NForm, 
  NFormItem, 
  NInput, 
  NSpace,
  NButton,
  useMessage 
} from 'naive-ui'
import type { FormInst, FormRules } from 'naive-ui'
import type { ApiDetailCreateParams, ApiDetailResponse } from '@/types/api-detail'
import ajax from '@/utils/http'

// 定义 props
interface Props {
  show: boolean
  apiId: string
}

// 定义 emits
interface Emits {
  (e: 'update:show', value: boolean): void
  (e: 'success'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 获取 message API
const message = useMessage()

// 响应式数据
const loading = ref(false)
const formRef = ref<FormInst | null>(null)
const form = ref({
  name: '',
  payload: ''
})

const formRules: FormRules = {
  name: [
    { required: true, message: '请输入数据标签', trigger: 'blur' }
  ],
  payload: [
    { required: true, message: '请输入数据内容', trigger: 'blur' },
    {
      validator: (rule, value) => {
        if (!value) return true
        try {
          JSON.parse(value)
          return true
        } catch {
          return new Error('请输入有效的 JSON 格式')
        }
      },
      trigger: 'blur'
    }
  ]
}

// 监听 show 变化，重置表单
watch(() => props.show, (newShow) => {
  if (!newShow) {
    // 弹窗关闭时重置表单
    form.value = { name: '', payload: '' }
    formRef.value?.restoreValidation()
  }
})

// 方法
const handleCancel = () => {
  emit('update:show', false)
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    loading.value = true
    
    const params: ApiDetailCreateParams = {
      apiId: props.apiId,
      name: form.value.name,
      payload: form.value.payload
    }
    
    const response: any = await ajax({
      url: '/api/project/interface/add',
      method: 'post',
      data: params
    })
    
    emit('update:show', false)
    emit('success')
    message.success('创建成功')
  } catch (error) {
    console.error('创建数据失败:', error)
    message.error('创建数据失败')
  } finally {
    loading.value = false
  }
}

const handleFillPreset = () => {
  const preset = {
    code: 0,
    data: {
      name: '测试数据',
    },
    message: 'success'
  }
  form.value.payload = JSON.stringify(preset, null, 2)
}
</script>
