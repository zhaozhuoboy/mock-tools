<template>
  <div :class="$style['page-index']">
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">
          欢迎使用 Mock Tool
        </h1>
        <p class="hero-description">
          快速创建和管理API Mock服务，提高开发效率
        </p>
        
        <!-- 未登录状态显示登录注册按钮 -->
        <div v-if="!userStore.isLoggedIn" class="hero-actions">
          <n-button 
            size="large" 
            type="primary" 
            @click="navigateTo('/auth/login')"
          >
            立即登录
          </n-button>
          <n-button 
            size="large" 
            quaternary 
            @click="navigateTo('/auth/register')"
          >
            免费注册
          </n-button>
        </div>
        
        <!-- 已登录状态显示项目入口 -->
        <div v-else class="hero-actions">
          <n-button 
            size="large" 
            type="primary" 
            @click="navigateTo('/projects')"
          >
            我的项目
          </n-button>
          <n-button 
            size="large" 
            quaternary 
            @click="navigateTo('/dashboard')"
          >
            控制台
          </n-button>
        </div>
      </div>
    </div>
    
    <!-- 功能特性展示 -->
    <div class="features-section">
      <div class="container">
        <h2 class="features-title">核心功能</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">🚀</div>
            <h3>快速Mock</h3>
            <p>快速创建API Mock服务，支持多种HTTP方法和状态码</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📝</div>
            <h3>项目管理</h3>
            <p>组织和管理多个Mock项目，支持分组和标签</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">⚡</div>
            <h3>实时响应</h3>
            <p>实时修改Mock响应，支持动态数据和条件逻辑</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NButton } from 'naive-ui'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()

// 页面元信息
definePageMeta({
  title: 'Mock Tool - API Mock服务'
})
</script>

<style lang="scss" module>
.page-index {
  min-height: 100vh;
}

.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 80px 20px;
  text-align: center;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

.hero-description {
  font-size: 1.25rem;
  margin-bottom: 3rem;
  opacity: 0.9;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.features-section {
  padding: 80px 20px;
  background: #f8fafc;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.features-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 3rem;
  color: #1f2937;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1);
  }
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1f2937;
}

.feature-card p {
  color: #6b7280;
  line-height: 1.6;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-description {
    font-size: 1.125rem;
  }
  
  .hero-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>
