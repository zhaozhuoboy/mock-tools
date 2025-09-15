export default defineNuxtRouteMiddleware((to, from) => {
  // isAuthenticated() is an example method verifying if a user is authenticated
  console.log('use auth middeware === 在此处理校验登录态的逻辑')
})