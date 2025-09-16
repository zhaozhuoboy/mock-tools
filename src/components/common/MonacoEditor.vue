<template>
  <ClientOnly>
    <div class="monaco-editor-wrapper" :style="{ height: normalizedHeight }">
      <VueMonacoEditor
        ref="editorRef"
        v-model:value="innerValue"
        :theme="'vs-dark'"
        :language="'json'"
        :options="editorOptions"
        style="width: 100%; height: 100%;"
      />
    </div>
  </ClientOnly>
  
</template>

<script setup lang="ts">
import { computed, watch, ref, nextTick, onMounted } from 'vue'
import { VueMonacoEditor } from '@guolao/vue-monaco-editor'
import type { editor as MonacoEditorNS } from 'monaco-editor'

const props = defineProps<{
  modelValue: string
  height?: number | string
  readOnly?: boolean
  autoFormatOnMount?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const height = computed(() => props.height ?? 300)
const normalizedHeight = computed(() => typeof height.value === 'number' ? `${height.value}px` : String(height.value))
const innerValue = ref(props.modelValue ?? '')
const editorRef = ref()

watch(() => props.modelValue, (val) => {
  if (val !== innerValue.value) {
    // 如果启用自动格式化且内容变化，尝试格式化
    if (props.autoFormatOnMount !== false && val) {
      try {
        const pretty = JSON.stringify(JSON.parse(val), null, 2)
        innerValue.value = pretty
      } catch {
        // 非合法 JSON 时保持原值
        innerValue.value = val ?? ''
      }
    } else {
      innerValue.value = val ?? ''
    }
  }
}, { immediate: true })

const editorOptions = computed<MonacoEditorNS.IStandaloneEditorConstructionOptions>(() => ({
  readOnly: props.readOnly ?? false,
  automaticLayout: true,
  wordWrap: 'on',
  minimap: { enabled: false },
  scrollBeyondLastLine: false,
  folding: true,
  lineNumbers: 'on',
}))

watch(innerValue, (val) => {
  emit('update:modelValue', val)
})

// 初始化时也尝试格式化
onMounted(() => {
  if (props.autoFormatOnMount === false) return
  const value = props.modelValue
  if (!value) return
  
  try {
    const pretty = JSON.stringify(JSON.parse(value), null, 2)
    if (pretty !== value) {
      innerValue.value = pretty
    }
  } catch {
    // 非合法 JSON 时不处理
  }
})
</script>

<style scoped>
.monaco-editor-wrapper {
  width: 100%;
  /* keep borders subtle; can be adjusted to match design system */
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  overflow: hidden;
}
</style>


