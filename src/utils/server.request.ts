import chalk from 'chalk'
import { useFetch, useRequestHeaders } from 'nuxt/app'

type ServiceResponse = {
  code: string | number,
  msg: string,
  data: any,
  error: any,
  [key: string]: any
}

export const serverFetch = (option: {
  url: string
  method?: string
  baseUrl?: string
  data?: any
  useCookie?: boolean
  headers?: HeadersInit
  [key: string]: any
}) => {
  return new Promise((resolve, reject) => {
    let url = option.url
    let baseUrl = option.baseUrl || '/'
    const headers = new Headers(option.headers || {
      'Content-type': 'application/json'
    })
    
    // 优先转发入站 Authorization；否则从 Cookie 读取 token 并写入 Authorization
    try {
      const reqHeaders = useRequestHeaders(['authorization', 'cookie']) || {}
      const incomingAuth = (reqHeaders as any).authorization as string | undefined
      if (incomingAuth && !headers.has('Authorization')) {
        headers.set('Authorization', incomingAuth)
      } else {
        const cookieHeader = (reqHeaders as any).cookie as string | undefined
        if (cookieHeader) {
          const token = (() => {
            const parts = cookieHeader.split(';')
            for (const rawPart of parts) {
              const part = rawPart.trim()
              const eqIndex = part.indexOf('=')
              if (eqIndex === -1) continue
              const k = part.substring(0, eqIndex).trim()
              const v = part.substring(eqIndex + 1)
              if (k === 'token') return decodeURIComponent(v || '')
            }
            return ''
          })()
          if (token && !headers.has('Authorization')) {
            headers.set('Authorization', `Bearer ${token}`)
          }
        }
      }
    } catch (e) {
      // ignore cookie parsing errors on client or non-SSR contexts
    }
    

    let opt: any = {
      method: option.method ?? 'post',
      headers,
      onRsponse (ctx: any) {
        console.log('onRsponse', ctx)
      }
    }
    // 保证同源请求在客户端携带 Cookie
    opt.credentials = 'include'
    const method = opt.method?.toLocaleLowerCase()
    if (method === 'get') {
      const params = option.data || {}
      opt.query = params

      url += `?t=${Date.now()}`
    }

    if (['post', 'put', 'delete', 'patch'].includes(method)) {
      opt.body = option.data
    }

    url = /^\bhttp(s)?\b|\/\//.test(url) ? url : `${baseUrl}${url.replace(/^\/*/, '')}`

    console.log(chalk.blue('Server request url'), chalk.green(url))

    useFetch(url, opt).then(response => {
      const { data: res, error, clear, refresh, status } = response
      console.log('status', error.value)

      if (status.value === 'success') {
        const { code, data, error = {}, msg } = res.value as ServiceResponse
        let result
        let message = msg || error.msg || ''
        if (code === undefined) {
          result = res.value
        }

        if (code === 0) {
          result = data || {}
        }

        if (result) {
          resolve(result)
          return
        }

        const errorRes = {
          api: 1,
          code,
          error,
          message: message
        }

        reject(errorRes)
      } else {
        reject({
          code: -1000,
          message: 'http error'
        })
      }
    }).catch(err => {
      reject({
        api: -1,
        error: err,
        message: '未知错误'
      })
    })
  })
}

// export function getProjectGroups (pid: number | string) {
//   return serverFetch({
//     url: `/api/project/${pid}/group`,
//     method: 'get'
//   })
// }
