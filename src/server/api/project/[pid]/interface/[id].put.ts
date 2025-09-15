import { ApiService, ProjectService } from '~/server/database/services/ProjectService'
import { GroupService } from '~/server/database/services/GroupService'

export default defineEventHandler(async (event) => {
  try {
    /**
     * 更新接口
     * @param pid 项目ID
     * @param id 接口ID
     * @param body 请求体
     * @returns 更新结果
     */
    const { pid, id } = getRouterParams(event)
    const projectPid = parseInt(String(pid), 10)
    const apiId = parseInt(String(id), 10)
    if (!Number.isFinite(projectPid)) return { code: -1221, message: '无效的项目ID' }
    if (!Number.isFinite(apiId)) return { code: -1222, message: '无效的接口ID' }

    const body = await readBody(event)
    if (!body) return { code: -1223, message: '缺少请求体' }

    const project = await ProjectService.getProjectByPid(projectPid)
    if (!project) return { code: -1224, message: '项目不存在' }
    const rawId = (project as any)?.id ?? (typeof (project as any)?.get === 'function' ? (project as any).get('id') : undefined)
    const projectId = Number(rawId)
    if (!Number.isFinite(projectId)) return { code: -1225, message: '项目主键无效' }

    const payload: any = {}
    if (typeof body.path === 'string') payload.path = String(body.path).trim()
    if (typeof body.method === 'string') payload.method = String(body.method).toLowerCase().trim()
    if (typeof body.group === 'string') payload.group = String(body.group).trim()
    if (typeof body.description === 'string') payload.description = String(body.description).trim()

    if (payload.group) {
      await GroupService.findOrCreate(projectPid, payload.group)
    }

    const updated = await ApiService.update(apiId, payload)
    if (!updated) return { code: -1226, message: '接口不存在' }

    return { code: 0, message: '更新成功', data: updated }
  } catch (error: any) {
    const details = Array.isArray(error?.errors) ? error.errors.map((e: any) => e?.message || '').filter(Boolean).join('; ') : ''
    const msg = details || error?.message || '更新失败'
    return { code: -1227, message: msg }
  }
})


