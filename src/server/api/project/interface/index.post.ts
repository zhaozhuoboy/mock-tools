import { ApiService, ProjectService } from '~/server/database/services/ProjectService'
import { GroupService } from '~/server/database/services/GroupService'

export default defineEventHandler(async (event) => {
  try {

    const body = await readBody(event)
    console.log('body', body)
    if (!Number.isFinite(body.pid)) {
      return { code: -1211, message: '无效的项目ID' }
    }
    if (!body?.path) return { code: -1212, message: '请输入接口路径' }
    if (!body?.method) return { code: -1212, message: '请选择请求方法' }
    // 基础校验，提前失败避免 ORM 泛化错误
    const path = String(body.path).trim()
    const method = String(body.method).toLowerCase().trim()
    const group = body.group !== undefined ? String(body.group).trim() : ''
    const description = body.description !== undefined ? String(body.description).trim() : ''

    const allowedMethods = ['get', 'post', 'put', 'patch', 'delete']
    if (!allowedMethods.includes(method)) {
      return { code: -1216, message: '无效的请求方法' }
    }
    if (path.length < 1 || path.length > 255) {
      return { code: -1217, message: '路径长度应在 1-255 个字符' }
    }
    if (group && group.length > 100) {
      return { code: -1218, message: '分组名称长度不能超过 100 个字符' }
    }
    if (description && description.length > 500) {
      return { code: -1219, message: '描述长度不能超过 500 个字符' }
    }

    const project = await ProjectService.getProjectByPid(body.pid)
    if (!project) {
      return { code: -1213, message: '项目不存在' }
    }

    const rawId = (project as any)?.id ?? (typeof (project as any)?.get === 'function' ? (project as any).get('id') : undefined)
    const projectId = String(rawId).trim()
    if (!projectId) {
      return { code: -1214, message: '项目主键无效' }
    }

    // 若带分组，先确保分组存在（不存在则创建）
    if (group) {
      await GroupService.findOrCreate(body.pid, group)
    }

    const payload = { path, method: method as any, group: group || undefined, description: description || undefined }
    // 记录关键载荷，便于定位数据问题
    console.log('Creating API with:', { projectId, ...payload })
    const created = await ApiService.create(projectId, payload as any)

    return { code: 0, message: '创建成功', data: created }
  } catch (error: any) {
    // 输出到服务器日志便于定位
    console.error('Create API error:', error?.name, error?.message, error?.parent?.code, error?.parent?.sqlMessage)
    const detailsArr = Array.isArray(error?.errors) ? error.errors.map((e: any) => ({ message: e?.message, path: e?.path, value: e?.value })) : []
    const detailsText = detailsArr.map((e: any) => e?.message).filter(Boolean).join('; ')
    const dbMsg = error?.parent?.sqlMessage || error?.original?.sqlMessage || ''
    const msg = detailsText || dbMsg || error?.message || '创建失败'
    return { code: -1215, message: msg, errors: detailsArr, debug: { name: error?.name, code: error?.parent?.code } }
  }
})


