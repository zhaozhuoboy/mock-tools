import { readBody, defineEventHandler } from 'h3'
import { UserService } from '../../database/services/UserService'
import { hashPassword } from '../../utils/crypto'
import { z } from 'zod'

// 注册请求数据验证
const registerSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(6).max(100),
  nickname: z.string().optional(),
  phone: z.string().optional()
})

/**
 * 用户注册接口
 */
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    // 验证请求数据
    const validatedData = registerSchema.parse(body)
    const { username, email, password, nickname, phone } = validatedData

    // 检查用户名是否已存在
    const existingUser = await UserService.findByUsername(username)
    if (existingUser) {
      return {
        code: 1,
        message: '用户名已存在'
      }
    }

    // 检查邮箱是否已存在
    const existingEmail = await UserService.findByEmail(email)
    if (existingEmail) {
      return {
        code: 1,
        message: '邮箱已被注册'
      }
    }

    // 加密密码
    const hashedPassword = await hashPassword(password)

    // 获取下一个可用的uid（从10000开始递增）
    const allUsers = await UserService.getUsers({ limit: 1000, page: 1 })
    const maxUid = allUsers.users.length > 0 
      ? Math.max(...allUsers.users.map(u => u.uid)) 
      : 9999
    const nextUid = maxUid + 1

    // 创建用户
    const userData = {
      username,
      email,
      password: hashedPassword,
      nickname: nickname || username,
      phone,
      status: 'active' as const,
      role: 'user' as const,
      uid: nextUid
    }

    const user = await UserService.createUser(userData)

    // 返回用户信息（不包含密码）
    const { password: _, ...userWithoutPassword } = user.toJSON()

    return {
      code: 0,
      data: userWithoutPassword,
      message: '注册成功'
    }
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return {
        code: 1,
        message: '请求参数格式错误',
        errors: error.errors
      }
    }

    console.error('用户注册失败:', error)
    return {
      code: 1,
      message: error.message || '注册失败，请稍后重试'
    }
  }
})
