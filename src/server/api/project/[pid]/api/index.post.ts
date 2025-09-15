import { ApiService, ProjectService } from '~/server/database/services/ProjectService'

export default defineEventHandler(async (event) => {
  try {
    const { pid } = getRouterParams(event)
    const projectPid = parseInt(String(pid), 10)
    if (!Number.isFinite(projectPid)) {
      return { code: -1211, message: '无效的项目ID' }
    }

    const body = await readBody(event)
    if (!body?.path) return { code: -1212, message: '请输入接口路径' }
    if (!body?.method) return { code: -1212, message: '请选择请求方法' }

    const project = await ProjectService.getProjectByPid(projectPid)
    if (!project) {
      return { code: -1213, message: '项目不存在' }
    }

    const projectId = Number(project.id)
    if (!Number.isFinite(projectId)) {
      return { code: -1214, message: '项目主键无效' }
    }

    const created = await ApiService.create(projectId, {
      path: String(body.path),
      method: String(body.method).toLowerCase(),
      group: body.group ? String(body.group) : undefined,
      description: body.description ? String(body.description) : undefined
    } as any)

    return { code: 0, message: '创建成功', data: created }
  } catch (error: any) {
    return { code: -1215, message: error?.message || '创建失败' }
  }
})


