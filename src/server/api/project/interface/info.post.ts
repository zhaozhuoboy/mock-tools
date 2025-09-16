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

    // 获取用户维度的当前选中 detailId（如无，则回退全局/第一个）
    const userUid = (event as any).context?.auth?.uid
    let activeDetailId: string | null = null
    if (userUid) {
      const userActive = await ApiDetailService.getUserActiveDetail(userUid, apiId)
      activeDetailId = userActive ? (userActive.get('id') as string) : null
    } else {
      const globalActive = await ApiDetailService.getActiveByApiId(apiId)
      activeDetailId = globalActive ? (globalActive.get('id') as string) : (details[0]?.get('id') as string) || null
    }

    return {
      code: 0,
      message: 'ok',
      data: {
        api: apiInfo,
        details,
        activeDetailId
      }
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || '获取接口详情失败'
    })
  }
})
