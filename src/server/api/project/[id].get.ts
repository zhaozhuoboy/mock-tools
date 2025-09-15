import { ApiService, ProjectService } from '~/server/database/services/ProjectService'

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event)
  const project = await ProjectService.getProjectByPid(Number(id))
  if (!project) {
    return { code: -1003, message: '项目不存在' }
  }
  const apiCount = await ApiService.countByProject(Number(id)) || 0
  return { code: 0, message: '获取项目成功', data: { project, apiCount } }
})