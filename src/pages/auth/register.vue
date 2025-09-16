<template>
  <div class="flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          创建新账户
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          或者
          <NuxtLink to="/auth/login" class="font-medium text-indigo-600 hover:text-indigo-500">
            登录现有账户
          </NuxtLink>
        </p>
      </div>
      
      <NForm
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-placement="left"
        label-width="auto"
        require-mark-placement="right-hanging"
        size="large"
        @submit.prevent="handleRegister"
      >
        <NFormItem label="用户名" path="username">
          <NInput
            v-model:value="formData.username"
            placeholder="请输入用户名"
            :input-props="{ autocomplete: 'username' }"
          />
        </NFormItem>
        
        <NFormItem label="邮箱" path="email">
          <NInput
            v-model:value="formData.email"
            placeholder="请输入邮箱地址"
            :input-props="{ autocomplete: 'email' }"
          />
        </NFormItem>
        
        <NFormItem label="昵称" path="nickname">
          <NInput
            v-model:value="formData.nickname"
            placeholder="请输入昵称（可选）"
          />
        </NFormItem>

        <NFormItem label="手机号" path="phone">
          <NInput
            v-model:value="formData.phone"
            placeholder="请输入手机号（可选）"
            :input-props="{ autocomplete: 'tel' }"
          />
        </NFormItem>
        
        <NFormItem label="密码" path="password">
          <NInput
            v-model:value="formData.password"
            type="password"
            placeholder="请输入密码"
            show-password-on="click"
            :input-props="{ autocomplete: 'new-password' }"
          />
        </NFormItem>

        <NFormItem label="确认密码" path="confirmPassword">
          <NInput
            v-model:value="formData.confirmPassword"
            type="password"
            placeholder="请再次输入密码"
            show-password-on="click"
            :input-props="{ autocomplete: 'new-password' }"
          />
        </NFormItem>

        <NFormItem>
          <NButton
            type="primary"
            size="large"
            block
            :loading="loading"
            @click="handleRegister"
          >
            {{ loading ? '注册中...' : '注册' }}
          </NButton>
        </NFormItem>
      </NForm>

      <!-- 错误提示 -->
      <NAlert
        v-if="errorMessage"
        type="error"
        :show-icon="true"
        closable
        @close="errorMessage = ''"
      >
        {{ errorMessage }}
      </NAlert>

      <!-- 成功提示 -->
      <NAlert
        v-if="successMessage"
        type="success"
        :show-icon="true"
        closable
        @close="successMessage = ''"
      >
        {{ successMessage }}
      </NAlert>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { NForm, NFormItem, NInput, NButton, NAlert } from 'naive-ui'
import type { FormInst, FormRules } from 'naive-ui'
import { useUserStore } from '@/store/user'
import { useMessage } from 'naive-ui'
import type { RegisterData } from '@/store/user'

// 页面元信息
definePageMeta({
  layout: 'auth',
  title: '用户注册'
})

// 用户store
const userStore = useUserStore()
const router = useRouter()
const message = useMessage()

// 表单引用
const formRef = ref<FormInst | null>(null)

// 表单数据
const formData = reactive<RegisterData & { confirmPassword: string }>({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  nickname: '',
  phone: ''
})

// 其他状态
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// 自定义验证函数
const validateConfirmPassword = (rule: any, value: string) => {
  if (value !== formData.password) {
    return new Error('两次输入的密码不一致')
  }
  return true
}

// 表单验证规则
const rules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 50, message: '用户名长度应在3-50个字符之间', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字和下划线', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
  ],
  nickname: [
    { max: 50, message: '昵称长度不能超过50个字符', trigger: 'blur' }
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 100, message: '密码长度应在6-100个字符之间', trigger: 'blur' },
    { 
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/,
      message: '密码必须包含大小写字母和数字',
      trigger: 'blur'
    }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

/**
 * 处理注册
 */
const handleRegister = async () => {
  try {
    // 验证表单
    await formRef.value?.validate()
    
    loading.value = true
    errorMessage.value = ''
    successMessage.value = ''

    // 准备注册数据
    const registerData: RegisterData = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      nickname: formData.nickname || undefined,
      phone: formData.phone || undefined
    }

    // 调用注册接口
    const result = await userStore.register(registerData)
    
    if (result.success) {
      // 注册成功
      successMessage.value = '注册成功！请登录您的账户。'
      
      // 清空表单
      Object.assign(formData, {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        nickname: '',
        phone: ''
      })
      
      // 延迟跳转到登录页面
      setTimeout(() => {
        router.push('/auth/login')
      }, 2000)
    } else {
      // 注册失败，显示错误信息
      errorMessage.value = result.message || '注册失败'
    }
  } catch (error) {
    console.error('注册错误:', error)
    errorMessage.value = '注册失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

// 如果用户已登录，重定向到项目页面
onMounted(() => {
  if (userStore.isLoggedIn) {
    router.push('/projects')
  }
})
</script>

<style scoped>
/* 可以在这里添加自定义样式 */
</style>
