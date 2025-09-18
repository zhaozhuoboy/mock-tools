import { ProjectService } from '~/server/database/services/ProjectService'
import { ApiService } from '~/server/database/services/ApiService'

/**
 * 查询 api 列表
 */
export default defineEventHandler(async (event) => {
  try {
    const { projectId: pid } = getRouterParams(event)
    const { page, size } = getQuery(event)
    const projectPid = Number(pid)
    const currentPage = Number(page)
    const pageSize = Number(size)
    console.log('xxxxx', page, size)

    if (!projectPid || Number.isNaN(projectPid)) {
      return { code: -1201, message: '无效的项目ID', data: [] }
    }

    const project = await ProjectService.getProjectByPid(projectPid)
    if (!project) {
      return { code: -1203, message: '项目不存在', data: [] }
    }

    const rawId = (project as any)?.id ?? (typeof (project as any)?.get === 'function' ? (project as any).get('id') : undefined)
    const projectId = String(rawId).trim()
    if (!projectId) {
      return { code: -1204, message: '项目主键无效', data: [] }
    }
    const list = await ApiService.listByProject(projectId, currentPage, pageSize)
    const totalCount = await ApiService.countByProject(projectId)

    return {
      code: 0,
      message: 'ok',
      data: {
        list,
        page: {
          page: currentPage,
          size: pageSize,
          total: totalCount
        }
      }
    }
  } catch (error: any) {
    return { code: -1202, message: error?.message || '获取接口列表失败', data: [] }
  }
})


