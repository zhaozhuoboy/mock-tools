<template>
  <div class="header">
    <div class="inner">
      <NuxtLink to="/" class="logo">
        MockTools
      </NuxtLink>
      <nav class="nav-wrap">
        <NuxtLink to="/projects" class="nav-link">项目</NuxtLink>
      </nav>

      <div class="account">
        <!-- 使用 ClientOnly 避免 SSR 水合不匹配 -->
        <ClientOnly>
          <!-- 未登录状态 -->
          <template v-if="!userStore.isLoggedIn">
            <n-button 
              quaternary 
              size="small" 
              @click="navigateTo('/auth/login')"
            >
              登录
            </n-button>
            <n-button 
              type="primary" 
              size="small" 
              @click="navigateTo('/auth/register')"
            >
              注册
            </n-button>
          </template>

          <!-- 已登录状态 -->
          <template v-else>
            <n-dropdown
              :options="userMenuOptions"
              @select="handleUserMenuSelect"
              trigger="click"
            >
              <n-button quaternary>
                <n-avatar 
                  :src="userStore.user?.avatar" 
                  size="small"
                  round
                  style="margin-right: 8px"
                >
                  {{ userStore.user?.nickname?.[0] || userStore.user?.username?.[0] }}
                </n-avatar>
                {{ userStore.user?.nickname || userStore.user?.username }}
                <n-icon style="margin-left: 8px">
                  <ChevronDownIcon />
                </n-icon>
              </n-button>
            </n-dropdown>
          </template>
          
          <!-- 服务端渲染时的占位符 -->
          <template #fallback>
            <div style="display: flex; gap: 12px;">
              <div style="width: 60px; height: 32px; background: #f0f0f0; border-radius: 4px;"></div>
              <div style="width: 60px; height: 32px; background: #f0f0f0; border-radius: 4px;"></div>
            </div>
          </template>
        </ClientOnly>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronDownIcon } from '@heroicons/vue/24/outline'
import { NButton, NDropdown, NAvatar, NIcon } from 'naive-ui'
import type { DropdownOption } from 'naive-ui'
import { useUserStore } from '@/store/user'
import { useMessage } from 'naive-ui'

const userStore = useUserStore()
const message = useMessage()

// 用户菜单选项
const userMenuOptions: DropdownOption[] = [
  {
    label: '个人资料',
    key: 'profile',
    icon: () => h('span', '👤')
  },
  {
    label: '设置',
    key: 'settings',
    icon: () => h('span', '⚙️')
  },
  {
    type: 'divider'
  },
  {
    label: '退出登录',
    key: 'logout',
    icon: () => h('span', '🚪')
  }
]

/**
 * 处理用户菜单选择
 */
const handleUserMenuSelect = async (key: string) => {
  switch (key) {
    case 'profile':
      await navigateTo(`/profile/${userStore.user?.uid}`)
      break
    case 'settings':
      await navigateTo('/settings')
      break
    case 'logout':
      await userStore.logout()
      await navigateTo('/')
      message.success('已退出登录')
      break
  }
}
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 64px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.inner {
  flex-grow: 1;
  display: flex;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 64px;
  padding: 0 24px;
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    color: #667eea;
    transform: scale(1.05);
  }
}

.nav-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 40px;
  gap: 24px;
}

.nav-link {
  color: #374151;
  text-decoration: none;
  font-weight: 500;
  font-size: 15px;
  padding: 10px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    background-color: rgba(102, 126, 234, 0.1);
    color: #667eea;
    transform: translateY(-1px);
  }

  &.router-link-active {
    background-color: rgba(102, 126, 234, 0.15);
    color: #667eea;
    font-weight: 600;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 50%;
      transform: translateX(-50%);
      width: 20px;
      height: 2px;
      background: #667eea;
      border-radius: 1px;
    }
  }
}

.account {
  margin-left: auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  gap: 12px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .inner {
    padding: 0 16px;
  }
  
  .logo {
    padding: 0 16px;
    font-size: 18px;
  }
  
  .nav-wrap {
    margin: 0 20px;
    gap: 16px;
  }
  
  .nav-link {
    padding: 8px 12px;
    font-size: 14px;
  }
  
  .account {
    padding: 0 16px;
    gap: 8px;
  }
}

@media (max-width: 480px) {
  .header {
    height: 56px;
  }
  
  .logo {
    height: 56px;
    font-size: 16px;
  }
  
  .nav-wrap {
    margin: 0 12px;
    gap: 12px;
  }
  
  .nav-link {
    padding: 6px 10px;
    font-size: 13px;
  }
}
</style>
