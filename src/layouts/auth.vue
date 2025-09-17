<template>
  <div class="auth-layout">
    <div class="auth-container">
      <div class="auth-header">
        <NuxtLink to="/" class="logo-link">
          <span class="logo-text"> {{ title }} Mock Tool</span>
        </NuxtLink>
      </div>
      <div class="auth-content">
        <slot />
      </div>
      <div class="auth-footer">
        <p class="footer-text">
          © {{ year }} Mock Tool. All rights reserved.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 认证页面布局，用于登录和注册页面
const route = useRoute()

const year = ref(0)
const title = computed(() => {
  return route.meta.pageAlias === 'login' ? '登录' : '注册'
})

onMounted(() => {
  year.value = new Date().getFullYear()
})
</script>

<style scoped>
.auth-layout {
  min-height: 100vh;
  background: var(--bg);
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-container {
  width: 100%;
  max-width: 500px;
  background: var(--card);
  overflow: visible;
}

.auth-header {
  padding: 1rem 2rem 0.5rem;
}

.logo-link {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: var(--text-1);
  font-weight: 600;
  font-size: 1.25rem;
}

.logo {
  width: 2rem;
  height: 2rem;
  object-fit: contain;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-1);
}

.auth-content {
  padding: 1rem 2rem;
}

.auth-footer {
  padding: 0.5rem 2rem 1rem;
  text-align: center;
}

.footer-text {
  color: var(--text-2);
  font-size: 0.875rem;
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 640px) {
  .auth-container {
    margin: 1rem;
  }
  
  .auth-header {
    padding: 0.75rem 1.5rem 0.25rem;
  }
  
  .auth-content {
    padding: 0.75rem 1.5rem;
  }
  
  .auth-footer {
    padding: 0.25rem 1.5rem 0.75rem;
  }
}
</style>
