import { ApiService, ProjectService } from '~/server/database/services/ProjectService'

export default defineEventHandler(async (event) => {
  try {
    const { pid } = getRouterParams(event)
    const projectPid = Number(pid)
    if (!projectPid || Number.isNaN(projectPid)) {
      return { code: -1201, message: '无效的项目ID', data: [] }
    }
    const project = await ProjectService.getProjectByPid(projectPid)
    if (!project) {
      return { code: -1203, message: '项目不存在', data: [] }
    }
    const list = await ApiService.listByProject(project.id)
    return { code: 0, message: 'ok', data: list }
  } catch (error: any) {
    return { code: -1202, message: error?.message || '获取接口列表失败', data: [] }
  }
})


