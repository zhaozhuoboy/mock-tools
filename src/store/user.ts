import { defineStore } from 'pinia'
import ajax from '../utils/http'

export interface User {
  id: number
  uid: number
  username: string
  email: string
  avatar?: string
  nickname?: string
  phone?: string
  status: 'active' | 'inactive' | 'banned'
  role: 'admin' | 'user' | 'guest'
  last_login_at?: string
  created_at: string
  updated_at: string
}

export interface LoginData {
  username: string
  password: string
}

export interface RegisterData {
  username: string
  email: string
  password: string
  nickname?: string
  phone?: string
}

export interface ApiResponse<T = any> {
  code: number
  data?: T
  message?: string
  error?: any
}

export const useUserStore = defineStore('user', () => {
  // 内部可修改的 ref
  const _user = ref<User | null>(null)
  const _token = ref<string | null>(null)

  // 对外暴露的 computed readonly 版本
  const user = computed(() => _user.value)
  const token = computed(() => _token.value)

  /**
   * 设置token
   */
  const setToken = (newToken: string) => {
    _token.value = newToken
    if (process.client) {
      localStorage.setItem('token', newToken)
    }
  }

  /**
   * 获取token
   */
  const getToken = () => {
    return _token.value
  }

  /**
   * 移除token
   */
  const removeToken = () => {
    _token.value = null
    if (process.client) {
      localStorage.removeItem('token')
    }
  }

  /**
   * 设置用户信息
   */
  const setUser = (userData: User) => {
    _user.value = userData
  }

  /**
   * 清除用户信息
   */
  const clearUser = () => {
    _user.value = null
    removeToken()
  }

  /**
   * 用户登录
   */
  const login = async (loginData: LoginData) => {
    try {
      const data = await ajax({
        url: '/api/user/login',
        method: 'post',
        data: loginData
      })

      const responseData = data as any
      if (responseData?.token && responseData?.user) {
        setToken(responseData.token)
        setUser(responseData.user)
        return { success: true, data: responseData.user }
      } else {
        return { success: false, message: '登录失败' }
      }
    } catch (error: any) {
      return { 
        success: false, 
        message: error.message || '登录失败，请稍后重试' 
      }
    }
  }

  /**
   * 用户注册
   */
  const register = async (registerData: RegisterData) => {
    try {
      const data = await ajax({
        url: '/api/user/register',
        method: 'post',
        data: registerData
      })

      return { success: true, data }
    } catch (error: any) {
      return { 
        success: false, 
        message: error.message || '注册失败，请稍后重试' 
      }
    }
  }

  /**
   * 获取当前用户信息
   */
  const fetchUserInfo = async () => {
    try {
      const token = getToken()
      if (!token) {
        return { success: false, message: '未登录' }
      }

      // 使用 ajax 封装方法请求
      const data = await ajax({
        url: '/api/user/auth',
        method: 'get'
      })

      // ajax 方法已经处理了响应格式，直接使用返回的 data
      if (data) {
        setUser(data as User)
        return { success: true, data: data as User }
      } else {
        return { 
          success: false, 
          message: '获取用户信息失败' 
        }
      }
    } catch (error: any) {
      console.error('获取用户信息失败:', error)
      return { 
        success: false, 
        message: error.message || '获取用户信息失败' 
      }
    }
  }

  /**
   * 用户登出
   */
  const logout = async () => {
    try {
      // 调用登出API
      await ajax({
        url: '/api/user/logout',
        method: 'post'
      })
    } catch (error) {
      console.error('登出API调用失败:', error)
    } finally {
      // 无论API调用是否成功，都要清除本地状态
      clearUser()
    }
  }

  /**
   * 检查是否已登录
   */
  const isLoggedIn = computed(() => {
    return !!(_user.value && _token.value)
  })

  return {
    user,
    token,
    isLoggedIn,
    setToken,
    getToken,
    removeToken,
    setUser,
    clearUser,
    login,
    register,
    fetchUserInfo,
    logout
  }
})
