import { ApiDetailService } from '../../../database/services/ApiDetailService'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { apiId } = body

    if (!apiId) {
      throw createError({
        statusCode: 400,
        statusMessage: '缺少 apiId 参数'
      })
    }

    // 获取 API 基本信息
    const apiInfo = await ApiDetailService.getApiInfo(apiId)
    if (!apiInfo) {
      throw createError({
        statusCode: 404,
        statusMessage: 'API 不存在'
      })
    }

    // 获取所有数据详情
    const details = await ApiDetailService.getByApiId(apiId)

    return {
      success: true,
      data: {
        api: apiInfo,
        details
      }
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || '获取接口详情失败'
    })
  }
})
