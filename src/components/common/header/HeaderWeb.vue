<template>
  <div :class="$style['header']">
    <div :class="$style['inner']">
      <NuxtLink to="/" :class="$style['logo']">
        MockTools
      </NuxtLink>
      <nav :class="$style['nav-wrap']">
        <NuxtLink to="/projects" class="nav-link">项目</NuxtLink>
        <NuxtLink to="/dashboard" class="nav-link">仪表盘</NuxtLink>
      </nav>

      <div :class="$style['account']">
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

<style lang="scss" module>
.header {
  @extend %center;
  height: 60px;
  box-shadow: 0 1px 20px rgba($color: #000000, $alpha: 0.1);
}

.inner {
  flex-grow: 1;
  display: flex;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.logo {
  @extend %center;
  height: 60px;
  padding: 0 20px;
  @include font(20, 500);
}

.nav-wrap {
  @extend %center;
  margin: 0 30px;
  gap: 20px;
}

.nav-link {
  color: #374151;
  text-decoration: none;
  font-weight: 500;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f3f4f6;
    color: #1f2937;
  }

  &.router-link-active {
    background-color: #e0e7ff;
    color: #3730a3;
  }
}

.account {
  margin-left: auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  gap: 12px;
}
</style>
