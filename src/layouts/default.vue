<template>
  <NLayout
    class="layout"
    :native-scrollbar="false"
    :content-class="'layout-content'"
  >
    <NLayoutHeader class="layout-header">
      <Header />
    </NLayoutHeader>
    <NLayoutContent class="layout-content">
      <slot />
    </NLayoutContent>
    <NLayoutFooter v-if="!hideFooter" class="layout-footer">
      <Footer />
    </NLayoutFooter>
  </NLayout>
</template>

<script setup>
import { computed } from 'vue'
import { NLayout, NLayoutContent, NLayoutHeader, NLayoutFooter } from 'naive-ui'
import Header from '../components/common/header/Index.vue'
import Footer from '../components/common/footer/Footer.vue'

const route = useRoute()

// 从页面元信息中获取 hideFooter 设置
const hideFooter = computed(() => {
  return route.meta.layoutProps?.hideFooter === true
})
</script>

<style lang="scss" scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--bg);
}

.layout-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--bg);
}

.layout-header {
  flex-shrink: 0;
  position: sticky;
  top: 0;
  z-index: 1000;
  background: var(--bg-elevated);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.layout-footer {
  flex-shrink: 0;
  background: var(--card-hover);
  border-top: 1px solid var(--border);
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .layout-header {
    background: var(--bg-elevated);
  }
  
  .layout-footer {
    min-height: 60px;
  }
}
</style>
