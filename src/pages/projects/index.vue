<template>
  <div class="projects-page">
    <!-- 背景装饰 -->
    <!-- <BackgroundDecoration /> -->

    <!-- 页面头部 -->
    <ProjectHeader 
      :total-projects="projects.length"
      @create="showCreateModal = true"
    />

    <!-- 项目列表 -->
    <div class="projects-content">
      <LoadingState v-if="loading" />

      <EmptyState 
        v-else-if="projects.length === 0"
        @create="showCreateModal = true"
      />

      <div v-else class="projects-grid">
        <ProjectCard
          v-for="(project, index) in projects"
          :key="project.id"
          :project="project"
          :delay="index * 0.1"
          @click="handleProjectClick"
          @edit="handleEditProject"
          @copy="handleCopyProject"
          @delete="handleDeleteProject"
        />
      </div>
    </div>

    <!-- 创建项目弹窗 -->
    <CreateProjectModal
      :show="showCreateModal"
      :loading="creating"
      :mode="modalMode"
      :project="editingProject || undefined"
      @update:show="showCreateModal = $event"
      @submit="handleSubmitModal"
      @cancel="showCreateModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useMessage } from 'naive-ui'
import type { Project } from '../../types/project'
import ajax from '../../utils/http'

// 导入组件
import ProjectHeader from '../../components/projects/ProjectHeader.vue'
import ProjectCard from '../../components/projects/ProjectCard.vue'
import EmptyState from '../../components/projects/EmptyState.vue'
import LoadingState from '../../components/projects/LoadingState.vue'
import CreateProjectModal from '../../components/projects/CreateProjectModal.vue'

// 页面元信息
definePageMeta({
  layout: 'default'
})

useHead({
  title: '项目列表'
})

// 响应式数据
const message = useMessage()
const loading = ref(false)
const creating = ref(false)
const showCreateModal = ref(false)
const modalMode = ref<'create' | 'edit'>('create')
const editingProject = ref<Project | null>(null)
const projects = ref<Project[]>([])


// 获取项目列表
const fetchProjects = async () => {
  try {
    loading.value = true
    const data: any = await ajax({
      url: '/api/project',
      method: 'get'
    })
    projects.value = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : [])
  } catch (error) {
    console.error('获取项目列表失败:', error)
    message.error('获取项目列表失败')
    projects.value = []
  } finally {
    loading.value = false
  }
}

// 创建/编辑提交
const handleSubmitModal = async (data: any) => {
  try {
    creating.value = true
    if (modalMode.value === 'edit' && editingProject.value) {
      await ajax({ url: `/api/project/${editingProject.value.id}`, method: 'put', data })
      message.success('保存成功！')
    } else {
      await ajax({ url: '/api/project', method: 'post', data })
      message.success('🎉 项目创建成功！')
    }
    showCreateModal.value = false
    editingProject.value = null
    modalMode.value = 'create'
    await fetchProjects()
  } catch (error) {
    message.error('提交失败')
  } finally {
    creating.value = false
  }
}

// 处理项目点击
const handleProjectClick = (project: Project) => {
  navigateTo(`/projects/${project.pid}`)
}

// 编辑项目
const handleEditProject = (project: Project) => {
  modalMode.value = 'edit'
  editingProject.value = project
  showCreateModal.value = true
}

// 复制项目
const handleCopyProject = (project: Project) => {
  message.info('复制功能开发中...')
}

// 删除项目后刷新列表
const handleDeleteProject = async (project: Project) => {
  await fetchProjects()
}

// 页面加载时获取数据
onMounted(() => {
  fetchProjects()
})
</script>

<style scoped lang="scss">
.projects-page {
  // background: var(--bg);
  position: relative;
  // min-height: 100vh;
}

.projects-content {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
  padding: 30px 0;
  animation: fadeInUp 0.6s ease-out;
}

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

// 响应式设计
@media (max-width: 1200px) {
  .projects-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 14px;
  }
}

@media (max-width: 768px) {
  .projects-content {
    padding: 0 16px 24px;
  }
  
  .projects-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}

@media (max-width: 480px) {
  .projects-content {
    padding: 0 12px 20px;
  }
  
  .projects-grid {
    gap: 10px;
  }
}
</style>
