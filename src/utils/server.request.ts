import chalk from 'chalk'
import { useFetch } from 'nuxt/app'

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
    // const token = useUserStore().getToken()
    // headers.set('Authorization', `Bearer ${token}`)

    let opt: any = {
      method: option.method ?? 'post',
      headers,
      onRsponse (ctx: any) {
        console.log('onRsponse', ctx)
      }
    }

    if (opt.method?.toLocaleLowerCase() === 'get') {
      const params = option.data || {}
      opt.query = params

      url += `?t=${Date.now()}`
    }

    if (opt.method?.toLocaleLowerCase() === 'post') {
      opt.body = option.data
    }

    url = /^\bhttp(s)?\b|\/\//.test(url) ? url : `${baseUrl}${url.replace(/^\/*/, '')}`

    console.log(chalk.blue('server http url'), chalk.green(url))

    useFetch(url, opt).then(response => {
      const { data: res, error, clear, refresh, status } = response

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
