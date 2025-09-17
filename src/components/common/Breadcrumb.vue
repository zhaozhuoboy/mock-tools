<template>
  <NBreadcrumb :style="breadcrumbStyle">
    <NBreadcrumbItem v-for="item in normalizedConfig" :key="item.alias">
      <template v-if="item.path">
        <NuxtLink :to="item.path">
          <span v-if="item.icon" aria-hidden="true" style="margin-right: 4px;">{{ item.icon }}</span>
          {{ item.label }}
        </NuxtLink>
      </template>
      <template v-else>
        <span>
          <span v-if="item.icon" aria-hidden="true" style="margin-right: 4px;">{{ item.icon }}</span>
          {{ item.label }}
        </span>
      </template>
    </NBreadcrumbItem>
  </NBreadcrumb>
  
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NBreadcrumb, NBreadcrumbItem } from 'naive-ui'

interface BreadcrumbItemConfig {
  alias: string
  label: string
  path?: string
  icon?: string
}

const props = defineProps<{
  config: BreadcrumbItemConfig[] | BreadcrumbItemConfig
  style?: string
}>()

const normalizedConfig = computed<BreadcrumbItemConfig[]>(() => {
  return Array.isArray(props.config) ? props.config : [props.config]
})

const breadcrumbStyle = computed(() => props.style || 'margin-bottom: 16px;')
</script>

<style scoped>
</style>


