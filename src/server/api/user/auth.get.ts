import { defineEventHandler } from 'h3'
import { UserService } from '../../database/services/UserService'
import jwt from 'jsonwebtoken'

// JWT密钥（实际项目中应该从环境变量获取）
const config = useRuntimeConfig()
const JWT_SECRET = config.jwtSecret

/**
 * 获取当前用户信息
 */
export default defineEventHandler(async (event) => {
  try {
    // 从请求头获取token
    const authHeader = getHeader(event, 'authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        code: 1,
        message: '未提供有效的认证token'
      }
    }

    const token = authHeader.substring(7) // 移除 'Bearer ' 前缀

    // 验证token
    let decoded: any
    try {
      decoded = jwt.verify(token, JWT_SECRET)
    } catch (error) {
      return {
        code: -2001,
        message: 'token无效或已过期'
      }
    }
    // 根据token中的用户ID获取用户信息
    const user = await UserService.findById(decoded.id)
    if (!user) {
      return {
        code: 1,
        message: '用户不存在'
      }
    }

    // 返回用户信息（不包含密码）
    const { password: _, ...userWithoutPassword } = user.toJSON()

    return {
      code: 0,
      data: userWithoutPassword,
      message: 'success'
    }
  } catch (error: any) {
    console.error('获取用户信息失败:', error)
    return {
      code: 1,
      message: error.message || '获取用户信息失败'
    }
  }
})
