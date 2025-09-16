import { defineEventHandler, getHeader, getRequestURL, setResponseStatus } from "h3"
import jwt from 'jsonwebtoken'
import { UserService } from '../database/services/UserService'

export default defineEventHandler(async event => {
  const url = getRequestURL(event)
  const path = url.pathname || ''
  const isApi = path.startsWith('/api')
  const isAuthPage = path.startsWith('/auth')
  const isAuthApi = path.startsWith('/api/user/login') || path.startsWith('/api/user/register') || path.startsWith('/api/user/me')

  try {
    const authHeader = getHeader(event, 'authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // 未携带token：仅对 API 返回 401；页面不做服务端跳转，避免 SSR 水合不一致
      if (isApi && !isAuthApi) {
        setResponseStatus(event, 401)
        return { code: -2001, message: '未登录或登录已失效' }
      }
      return
    }

    const token = authHeader.substring(7)
    const config = useRuntimeConfig()
    const JWT_SECRET = (config as any).jwtSecret

    const decoded: any = jwt.verify(token, JWT_SECRET)
    const user = await UserService.findById(decoded.id)
    if (!user) {
      if (isApi && !isAuthApi) {
        setResponseStatus(event, 401)
        return { code: -2001, message: '用户不存在或登录已失效' }
      }
      return
    }

    const json = user.toJSON() as any
    event.context.auth = {
      id: json.id,
      uid: json.uid,
      username: json.username,
      role: json.role
    }
  } catch (e) {
    if (isApi && !isAuthApi) {
      setResponseStatus(event, 401)
      return { code: -2001, message: '认证失败或登录已失效' }
    }
    return
  }
})