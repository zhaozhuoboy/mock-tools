import { getQuery, defineEventHandler } from 'h3'
import { UserService } from '../../database/services/UserService'

/**
 * 获取用户列表（分页）
 * @returns 用户列表及分页信息
 */
export default defineEventHandler(async (event) => {
  // 获取查询参数
  const query = getQuery(event)
  const page = Number(query.page) || 1
  const limit = Number(query.limit) || 10
  const status = query.status as string | undefined
  const role = query.role as string | undefined
  const search = query.search as string | undefined

  try {
    const result = await UserService.getUsers({ page, limit, status, role, search })
    // 过滤掉 password 字段
    const users = result.users.map(user => {
      const { password, ...rest } = user.toJSON()
      return rest
    })
    return {
      code: 0,
      data: {
        list: users,
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages
      },
      message: 'success'
    }
  } catch (error: any) {
    return {
      code: 1,
      message: error.message || '获取用户列表失败'
    }
  }
})
