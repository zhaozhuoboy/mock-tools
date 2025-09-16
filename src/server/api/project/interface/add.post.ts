import { ApiDetailService } from '../../../database/services/ApiDetailService'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { apiId, name, payload } = body

    if (!apiId || !name || !payload) {
      throw createError({
        statusCode: 400,
        statusMessage: '缺少必要参数：apiId, name, payload'
      })
    }

    // 创建新的数据详情
    const detail = await ApiDetailService.create({
      api_id: apiId,
      name,
      payload: typeof payload === 'string' ? payload : JSON.stringify(payload),
      is_active: false // 新建的数据默认不活跃，需要用户手动切换
    })

    return {
      code: 0,
      message: 'ok',
      data: detail
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || '添加新数据失败'
    })
  }
})
