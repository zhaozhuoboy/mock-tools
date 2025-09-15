import { GroupService } from '~/server/database/services/GroupService'
import { ProjectService } from '~/server/database/services/ProjectService'

export default defineEventHandler(async (event) => {
  try {
    const { pid } = getRouterParams(event)
    const projectPid = parseInt(String(pid), 10)
    if (!Number.isFinite(projectPid)) {
      return { code: -1311, message: '无效的项目ID' }
    }

    const project = await ProjectService.getProjectByPid(projectPid)
    if (!project) {
      return { code: -1312, message: '项目不存在' }
    }

    // 分组表以 pid 作为外键
    const groups = await GroupService.listAllGroupNames(projectPid)
    return { code: 0, message: 'ok', data: groups }
  } catch (error: any) {
    return { code: -1313, message: error?.message || '获取分组失败' }
  }
})


