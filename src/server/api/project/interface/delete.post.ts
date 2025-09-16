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

    // 删除数据详情
    const success = await ApiDetailService.delete(id)
    if (!success) {
      throw createError({
        statusCode: 404,
        statusMessage: '数据详情不存在'
      })
    }

    return {
      success: true,
      message: '删除成功'
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || '删除数据失败'
    })
  }
})
