import { ProjectService } from '~/server/database/services/ProjectService'

export default defineEventHandler(async (event) => {
  try {
    const { id } = getRouterParams(event)
    const projectId = Number(id)
    if (!projectId || Number.isNaN(projectId)) {
      return { code: -1003, message: '无效的项目ID' }
    }

    const ok = await ProjectService.deleteProject(projectId)
    if (!ok) {
      return { code: -1004, message: '项目不存在或已删除' }
    }

    return { code: 0, message: '删除项目成功' }
  } catch (error) {
    return { code: -1005, message: error instanceof Error ? error.message : '删除项目失败' }
  }
})


