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

    // 设置指定数据为当前活跃数据
    const detail = await ApiDetailService.setActive(id)
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
