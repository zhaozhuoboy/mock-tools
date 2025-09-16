import { readBody, defineEventHandler } from 'h3'
import { UserService } from '../../database/services/UserService'
import { verifyPassword } from '../../utils/crypto'
import { generateJwtSecret } from '../../utils/crypto'
import jwt from 'jsonwebtoken'
import { z } from 'zod'

// 登录请求数据验证
const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1)
})

// JWT密钥（实际项目中应该从环境变量获取）
const JWT_SECRET = process.env.JWT_SECRET || generateJwtSecret()

/**
 * 用户登录接口
 */
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    // 验证请求数据
    const validatedData = loginSchema.parse(body)
    const { username, password } = validatedData

    // 查找用户（支持用户名或邮箱登录）
    let user = await UserService.findByUsername(username)
    if (!user) {
      user = await UserService.findByEmail(username)
    }

    if (!user) {
      return {
        code: 1,
        message: '用户名或密码错误'
      }
    }

    // 验证密码
    const isPasswordValid = await verifyPassword(password, user.password)
    if (!isPasswordValid) {
      return {
        code: 1,
        message: '用户名或密码错误'
      }
    }

    // 检查用户状态
    if (user.status !== 'active') {
      return {
        code: 1,
        message: '账户已被禁用，请联系管理员'
      }
    }

    // 更新最后登录时间
    await UserService.updateLastLogin(user.id)

    // 生成JWT token
    const token = jwt.sign(
      {
        uid: user.uid,
        id: user.id,
        username: user.username,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    // 返回用户信息和token（不包含密码）
    const { password: _, ...userWithoutPassword } = user.toJSON()

    return {
      code: 0,
      data: {
        user: userWithoutPassword,
        token
      },
      message: '登录成功'
    }
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return {
        code: 1,
        message: '请求参数格式错误',
        errors: error.errors
      }
    }

    console.error('用户登录失败:', error)
    return {
      code: 1,
      message: error.message || '登录失败，请稍后重试'
    }
  }
})
