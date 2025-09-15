<template>
  <div class="project-detail-page">
    <!-- 项目详情页（占位） -->
    项目详情页 {{ $route.params.pid }}
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})
</script>

<style scoped lang="scss">
.project-detail-page {
  min-height: 60vh;
}
</style>


