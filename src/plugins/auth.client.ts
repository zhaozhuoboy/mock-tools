import { useUserStore } from "@/store/user"

/**
 * 全局认证插件
 * 在应用初始化时处理认证状态和路由保护
 */
export default defineNuxtPlugin(async () => {
  const userStore = useUserStore()
  const router = useRouter()
  
  // 只在客户端执行
  if (!process.client) {
    return
  }

  // 需要认证的路由
  const protectedRoutes = ['/projects', '/dashboard', '/profile']
  
  // 登录相关路由
  const authRoutes = ['/auth/login', '/auth/register']

  // 从 localStorage 恢复 token
  const token = localStorage.getItem('token')
  if (token) {
    userStore.setToken(token)
  }

  // 全局路由守卫
  router.beforeEach(async (to, from, next) => {
    // 检查是否需要认证
    const needsAuth = protectedRoutes.some(route => to.path.startsWith(route))
    const isAuthRoute = authRoutes.some(route => to.path.startsWith(route))

    // 如果不需要认证，直接放行
    if (!needsAuth) {
      return next()
    }

    // 检查是否有 token
    if (!userStore.token) {
      console.log('认证插件：未找到 token，跳转到登录页')
      return next(`/auth/login?redirect=${encodeURIComponent(to.fullPath)}`)
    }

    // 检查是否已有用户信息
    if (userStore.user) {
      return next()
    }

    // 验证 token 有效性
    try {
      console.log('认证插件：验证 token 有效性')
      const result = await userStore.fetchUserInfo()
      
      if (result.success) {
        console.log('认证插件：token 验证成功，放行')
        return next()
      } else {
        console.log('认证插件：token 验证失败，跳转到登录页')
        userStore.clearUser()
        return next(`/auth/login?redirect=${encodeURIComponent(to.fullPath)}`)
      }
    } catch (error) {
      console.error('认证插件：token 验证出错:', error)
      userStore.clearUser()
      return next(`/auth/login?redirect=${encodeURIComponent(to.fullPath)}`)
    }
  })

  // 如果用户在登录页面但已登录，重定向到项目页面
  router.beforeEach(async (to, from, next) => {
    const isAuthRoute = authRoutes.some(route => to.path.startsWith(route))
    
    if (isAuthRoute) {
      // 检查是否有 token 但用户信息未加载
      if (userStore.token && !userStore.user) {
        try {
          console.log('认证插件：登录页面验证 token')
          const result = await userStore.fetchUserInfo()
          if (result.success) {
            const redirectTo = to.query.redirect as string || '/projects'
            console.log('认证插件：登录页面验证成功，重定向到:', redirectTo)
            return next(redirectTo)
          }
        } catch (error) {
          console.error('认证插件：登录页面验证失败:', error)
        }
      }
      
      // 如果已经完整登录，直接重定向
      if (userStore.isLoggedIn) {
        const redirectTo = to.query.redirect as string || '/projects'
        console.log('认证插件：已登录用户访问登录页，重定向到:', redirectTo)
        return next(redirectTo)
      }
    }

    return next()
  })
})
