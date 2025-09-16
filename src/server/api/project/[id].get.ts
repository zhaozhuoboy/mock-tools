import { ApiService, ProjectService } from '~/server/database/services/ProjectService'

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event)
  const projectId = Number(id)
  if (!projectId) {
    return { code: -1003, message: '无效的项目ID' }
  }
  
  const project = await ProjectService.getProjectByPid(projectId)
  if (!project) {
    return { code: -1003, message: '项目不存在' }
  }
  
  const apiCount = await ApiService.countByProject(project.get('id') as string) || 0
  return { code: 0, message: '获取项目成功', data: { project, apiCount } }
})