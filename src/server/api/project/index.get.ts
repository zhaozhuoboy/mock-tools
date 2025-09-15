import { ProjectService } from '~/server/database/services/ProjectService'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const ownerId = query.owner_id ? Number(query.owner_id) : undefined

    const projects = await ProjectService.getProjects(ownerId)

    return {
      code: 0,
      message: '获取项目列表成功',
      data: projects
    }
  } catch (error) {
    // 业务错误统一返回负数 code，不抛 HTTP 错误
    return {
      code: -1000,
      message: error instanceof Error ? error.message : '获取项目列表失败',
      data: []
    }
  }
})
