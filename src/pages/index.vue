<template>
  <div class="page-index">
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">
          欢迎使用 Mock Tool
        </h1>
        <p class="hero-description">
          快速创建和管理 API Mock 服务，提高开发效率
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
            注册
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
            <h3>多数据管理</h3>
            <p>支持数据切换，快速返回指定数据</p>
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

// 页面加载时检查用户登录状态
onMounted(async () => {
  try {
    // 如果有 token 但没有用户信息，则尝试获取用户信息
    if (userStore.token && !userStore.user) {
      await userStore.fetchUserInfo()
    }
  } catch (error) {
    console.log('用户未登录或登录已过期')
  }
})
</script>

<style lang="scss" scoped>
.page-index {
  min-height: 100vh;
}

.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 120px 0;
  text-align: center;
  position: relative;
  overflow: hidden;
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/><circle cx="10" cy="60" r="0.5" fill="white" opacity="0.1"/><circle cx="90" cy="40" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>') repeat;
    animation: float 20s ease-in-out infinite;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100px;
    background: linear-gradient(180deg, transparent 0%, rgba(255, 255, 255, 0.1) 100%);
  }
}

.hero-content {
  max-width: 900px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  padding: 0 24px;
}

.hero-title {
  font-size: 4rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  line-height: 1.1;
  background: linear-gradient(45deg, #ffffff, #f0f9ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  animation: fadeInUp 1s ease-out;
}

.hero-description {
  font-size: 1.375rem;
  margin-bottom: 3rem;
  opacity: 0.95;
  line-height: 1.6;
  font-weight: 400;
  animation: fadeInUp 1s ease-out 0.2s both;
}

.hero-actions {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
  animation: fadeInUp 1s ease-out 0.4s both;
  
  .n-button {
    padding: 16px 32px;
    font-size: 1.1rem;
    font-weight: 600;
    border-radius: 12px;
    transition: all 0.3s ease;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }
    
    &[type="primary"] {
      background: linear-gradient(135deg, #ff6b6b, #ee5a24);
      border: none;
      
      &:hover {
        background: linear-gradient(135deg, #ff5252, #d63031);
      }
    }
    
    &[quaternary] {
      background: rgba(255, 255, 255, 0.1);
      border: 2px solid rgba(255, 255, 255, 0.3);
      color: white;
      backdrop-filter: blur(10px);
      
      &:hover {
        background: rgba(255, 255, 255, 0.2);
        border-color: rgba(255, 255, 255, 0.5);
      }
    }
  }
}

.features-section {
  padding: 100px 20px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.3), transparent);
  }
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.features-title {
  text-align: center;
  font-size: 2.75rem;
  font-weight: 700;
  margin-bottom: 4rem;
  color: #1f2937;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -16px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 4px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    border-radius: 2px;
  }
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-card {
  background: white;
  padding: 2.5rem 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  text-align: center;
  transition: all 0.3s ease;
  border: 1px solid rgba(102, 126, 234, 0.1);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
    border-color: rgba(102, 126, 234, 0.2);
    
    &::before {
      transform: scaleX(1);
    }
  }
}

.feature-icon {
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  display: inline-block;
  animation: bounce 2s ease-in-out infinite;
  
  &:nth-child(1) {
    animation-delay: 0s;
  }
  
  &:nth-child(2) {
    animation-delay: 0.2s;
  }
  
  &:nth-child(3) {
    animation-delay: 0.4s;
  }
}

.feature-card h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1f2937;
  position: relative;
}

.feature-card p {
  color: #6b7280;
  line-height: 1.7;
  font-size: 1rem;
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .hero-section {
    padding: 100px 0;
  }
  
  .hero-content {
    padding: 0 20px;
  }
  
  .hero-title {
    font-size: 3.5rem;
  }
  
  .features-section {
    padding: 80px 20px;
  }
  
  .features-grid {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
  }
}

@media (max-width: 768px) {
  .hero-section {
    padding: 80px 0;
  }
  
  .hero-content {
    padding: 0 16px;
  }
  
  .hero-title {
    font-size: 2.75rem;
  }
  
  .hero-description {
    font-size: 1.125rem;
  }
  
  .hero-actions {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    
    .n-button {
      width: 100%;
      max-width: 280px;
    }
  }
  
  .features-section {
    padding: 60px 16px;
  }
  
  .features-title {
    font-size: 2.25rem;
    margin-bottom: 3rem;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .feature-card {
    padding: 2rem 1.5rem;
  }
  
  .feature-icon {
    font-size: 3rem;
  }
}

@media (max-width: 480px) {
  .hero-section {
    padding: 60px 0;
  }
  
  .hero-content {
    padding: 0 12px;
  }
  
  .hero-title {
    font-size: 2.25rem;
  }
  
  .hero-description {
    font-size: 1rem;
  }
  
  .features-section {
    padding: 40px 12px;
  }
  
  .features-title {
    font-size: 1.875rem;
  }
  
  .feature-card {
    padding: 1.5rem 1rem;
  }
}

/* 动画效果 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

/* 滚动动画 */
.feature-card {
  animation: fadeInUp 0.6s ease-out;
  animation-fill-mode: both;
  
  &:nth-child(1) {
    animation-delay: 0.1s;
  }
  
  &:nth-child(2) {
    animation-delay: 0.2s;
  }
  
  &:nth-child(3) {
    animation-delay: 0.3s;
  }
}

/* 悬停效果增强 */
.hero-actions .n-button {
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s ease;
  }
  
  &:hover::before {
    left: 100%;
  }
}
</style>
