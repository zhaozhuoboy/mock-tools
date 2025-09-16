import { defineEventHandler } from 'h3'

/**
 * 用户登出接口
 * 在实际应用中，这里可以处理token黑名单等逻辑
 */
export default defineEventHandler(async (event) => {
  try {
    // 这里可以添加token失效逻辑
    // 比如将token加入黑名单，记录登出日志等
    
    return {
      code: 0,
      message: '登出成功'
    }
  } catch (error: any) {
    console.error('用户登出失败:', error)
    return {
      code: 1,
      message: error.message || '登出失败'
    }
  }
})
