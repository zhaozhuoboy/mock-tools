import { ProjectService } from '~/server/database/services/ProjectService'

export default defineEventHandler(async (event) => {
  try {
    const { id } = getRouterParams(event)
    const projectId = String(id).trim()
    if (!projectId) {
      return { code: -1101, message: '无效的项目ID' }
    }

    const body = await readBody(event)
    const payload: any = {}
    if (typeof body.name === 'string') payload.name = body.name
    if (typeof body.description === 'string') payload.description = body.description
    if (typeof body.host === 'string') payload.host = body.host

    if (Object.keys(payload).length === 0) {
      return { code: -1102, message: '没有需要更新的字段' }
    }

    const updated = await ProjectService.updateProject(projectId, payload)
    if (!updated) {
      return { code: -1103, message: '项目不存在或已删除' }
    }
    return { code: 0, message: '更新成功', data: updated }
  } catch (error: any) {
    if (error?.name === 'SequelizeUniqueConstraintError') {
      return { code: -1106, message: '名称或其他唯一字段重复，请更换后重试' }
    }
    return { code: -1105, message: error instanceof Error ? error.message : '更新失败' }
  }
})


