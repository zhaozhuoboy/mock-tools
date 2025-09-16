import { ApiDetailService } from '../../../database/services/ApiDetailService'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { id } = body

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: '缺少 id 参数'
      })
    }

    // 优先设置用户维度活跃数据（从中间件获取 uid）
    const userUid = (event as any).context?.auth?.uid
    let detail
    if (userUid) {
      detail = await ApiDetailService.setUserActive(userUid, id)
    } else {
      // 兼容：无用户上下文时，沿用全局 is_active 逻辑
      detail = await ApiDetailService.setActive(id)
    }
    if (!detail) {
      throw createError({
        statusCode: 404,
        statusMessage: '数据详情不存在'
      })
    }

    return {
      success: true,
      data: detail
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || '设置活跃数据失败'
    })
  }
})
