import { readBody, defineEventHandler, setCookie } from 'h3'
import { UserService } from '../../database/services/UserService'
import { hashPassword } from '../../utils/crypto'
import { z } from 'zod'
import jwt from 'jsonwebtoken'

// 注册请求数据验证
const registerSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(6).max(18),
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
      ? Math.max(...allUsers.users.map((u: any) => u.uid)) 
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

    console.log('注册用户', userData)

    const user = await UserService.createUser(userData)

    // 使用 plain 对象以获得强类型下的字段访问
    const plain = user.toJSON() as any

    // 生成JWT token（与登录保持一致，7天）
    const config = useRuntimeConfig()
    const JWT_SECRET = config.jwtSecret
    const token = jwt.sign(
      {
        uid: plain.uid,
        id: plain.id,
        username: plain.username,
        role: plain.role
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    // 设置 HttpOnly Cookie，7天有效
    setCookie(event, 'token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    })

    // 返回用户信息（不包含密码）
    const { password: _, ...userWithoutPassword } = plain

    return {
      code: 0,
      data: { user: userWithoutPassword, token },
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
