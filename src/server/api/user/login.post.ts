import { readBody, defineEventHandler, setCookie } from 'h3'
import { UserService } from '../../database/services/UserService'
import type { UserAttributes } from '../../database/models/User'
import { verifyPassword } from '../../utils/crypto'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { useRuntimeConfig } from '#imports'

// 登录请求数据验证
const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1)
})

/**
 * 用户登录接口
 */
export default defineEventHandler(async (event) => {
  try {
    const { jwtSecret } = useRuntimeConfig()
    if (!jwtSecret) {
      throw new Error('JWT 密钥未配置')
    }
    const body = await readBody(event)
    
    // 验证请求数据
    const validatedData = loginSchema.parse(body)
    const { username, password } = validatedData
    console.log('登录用户', username, password)

    // 查找用户（支持用户名或邮箱登录）
    let user = await UserService.findByUsername(username)
    if (!user) {
      user = await UserService.findByEmail(username)
    }

    if (!user) {
      return {
        code: -1000,
        message: '用户名或密码错误'
      }
    } else {
      const userData = (user.get ? user.get({ plain: true }) : (user as any)) as UserAttributes
      // 验证密码
      const isPasswordValid = await verifyPassword(password, userData.password)
      console.log('验证密码', isPasswordValid)
      if (!isPasswordValid) {
        return {
          code: -1001,
          message: '用户名或密码错误'
        }
      }

      // 检查用户状态
      if (userData.status !== 'active') {
        return {
          code: -1002,
          message: '账户已被禁用，请联系管理员'
        }
      }

      // 更新最后登录时间
      await UserService.updateLastLogin(userData.id)

      // 生成JWT token
      const token = jwt.sign(
        {
          uid: userData.uid,
          id: userData.id,
          username: userData.username,
          role: userData.role
        },
        jwtSecret as jwt.Secret,
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

      // 返回用户信息和token（不包含密码）
      const { password: _, ...userWithoutPassword } = userData as any

      return {
        code: 0,
        data: {
          user: userWithoutPassword,
          token
        },
        message: '登录成功'
      }
    }

    
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return {
        code: -1003,
        message: '请求参数格式错误',
        errors: error.issues
      }
    }

    console.error('用户登录失败:', error)
    return {
      code: -1004,
      message: error instanceof Error ? error.message : '登录失败，请稍后重试'
    }
  }
})
