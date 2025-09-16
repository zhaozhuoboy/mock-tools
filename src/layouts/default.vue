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
    <NLayoutFooter class="layout-footer">
      <Footer />
    </NLayoutFooter>
  </NLayout>
</template>

<script>
import { NLayout, NLayoutContent, NLayoutHeader, NLayoutFooter } from 'naive-ui'
import Header from '../components/common/header/Index.vue'
import Footer from '../components/common/footer/Footer.vue'
export default {
  name: 'layout',
  components: {
    NLayout,
    NLayoutContent,
    NLayoutHeader,
    NLayoutFooter,
    Header,
    Footer
  }
}
</script>

<style lang="scss" scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #ffffff;
}

.layout-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #ffffff;
}

.layout-header {
  flex-shrink: 0;
  position: sticky;
  top: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.layout-footer {
  flex-shrink: 0;
  background: #f8fafc;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .layout-header {
    background: rgba(255, 255, 255, 0.98);
  }
  
  .layout-footer {
    min-height: 60px;
  }
}
</style>
