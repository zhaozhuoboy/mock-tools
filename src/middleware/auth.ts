import { useUserStore } from "@/store/user"

export default defineNuxtRouteMiddleware((to, from) => {
  const userStore = useUserStore()
  
  // 如果用户未登录，重定向到登录页面
  if (!userStore.isLoggedIn) {
    return navigateTo(`/auth/login?redirect=${encodeURIComponent(to.fullPath)}`)
  }
})