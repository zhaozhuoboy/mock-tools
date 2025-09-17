<template>
  <div class="flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          登录到您的账户
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          或者
          <NuxtLink to="/auth/register" class="font-medium text-indigo-600 hover:text-indigo-500">
            创建新账户
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
        @submit.prevent="handleLogin"
      >
        <NFormItem label="用户名/邮箱" path="username">
          <NInput
            v-model:value="formData.username"
            placeholder="请输入用户名或邮箱"
            :input-props="{ autocomplete: 'username' }"
          />
        </NFormItem>
        
        <NFormItem label="密码" path="password">
          <NInput
            v-model:value="formData.password"
            type="password"
            placeholder="请输入密码"
            show-password-on="click"
            :input-props="{ autocomplete: 'current-password' }"
          />
        </NFormItem>

        <NFormItem>
          <div class="flex items-center justify-between w-full">
            <NCheckbox v-model:checked="rememberMe">
              记住我
            </NCheckbox>
            <!-- <NuxtLink to="/auth/forgot-password" class="text-sm text-indigo-600 hover:text-indigo-500">
              忘记密码？
            </NuxtLink> -->
          </div>
        </NFormItem>

        <NFormItem>
          <NButton
            type="primary"
            size="large"
            block
            :loading="loading"
            @click="handleLogin"
          >
            {{ loading ? '登录中...' : '登录' }}
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { NForm, NFormItem, NInput, NButton, NCheckbox, NAlert } from 'naive-ui'
import type { FormInst, FormRules } from 'naive-ui'
import { useUserStore } from '@/store/user'
import { useMessage } from 'naive-ui'
import type { LoginData } from '@/store/user'

// 页面元信息
definePageMeta({
  layout: 'auth',
  title: '用户登录'
})

useHead({
  title: '登录'
})

// 用户store
const userStore = useUserStore()
const router = useRouter()
const route = useRoute()
const message = useMessage()

// 表单引用
const formRef = ref<FormInst | null>(null)

// 表单数据
const formData = reactive<LoginData>({
  username: '',
  password: ''
})

// 其他状态
const loading = ref(false)
const errorMessage = ref('')
const rememberMe = ref(false)

// 表单验证规则
const rules: FormRules = {
  username: [
    { required: true, message: '请输入用户名或邮箱', trigger: 'blur' },
    { min: 3, message: '用户名至少3个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少6个字符', trigger: 'blur' }
  ]
}

/**
 * 处理登录
 */
const handleLogin = async () => {
  try {
    // 验证表单
    await formRef.value?.validate()
    
    loading.value = true
    errorMessage.value = ''

    // 调用登录接口
    const result = await userStore.login(formData)
    
    if (result.success) {
      // 登录成功，跳转到目标页面或项目页面
      const redirectTo = (route.query.redirect as string) || '/projects'
      await router.push(redirectTo)
      
      // 显示成功消息
      message.success('登录成功')
    } else {
      // 登录失败，显示错误信息
      errorMessage.value = result.message || '登录失败'
    }
  } catch (error) {
    console.error('登录错误:', error)
    errorMessage.value = '登录失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

// 如果用户已登录，重定向到项目页面
onMounted(() => {
  if (userStore.isLoggedIn) {
    const redirectTo = (route.query.redirect as string) || '/projects'
    router.push(redirectTo)
  }
})
</script>

<style scoped>
/* 可以在这里添加自定义样式 */
</style>
