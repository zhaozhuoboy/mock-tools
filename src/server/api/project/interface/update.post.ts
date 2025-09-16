import { ApiDetailService } from '../../../database/services/ApiDetailService'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { id, name, payload, is_active } = body

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: '缺少 id 参数'
      })
    }

    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (payload !== undefined) {
      updateData.payload = typeof payload === 'string' ? payload : JSON.stringify(payload)
    }
    if (is_active !== undefined) updateData.is_active = is_active

    if (Object.keys(updateData).length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: '没有提供要更新的字段'
      })
    }

    // 更新数据详情
    const detail = await ApiDetailService.update(id, updateData)
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
      statusMessage: error.message || '更新数据失败'
    })
  }
})
