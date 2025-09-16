// import type { FetchOptions } from 'ofetch'
import { getToken } from "./token"
/**
 * 
 * @param option 
 * @param option.url
 * @param option.method
 * @param option.baseUrl
 * @param option.data
 * @param option.useCookie
 * 
 * @returns 
 */
export default function ajax (option: {
  url: string
  method?: string
  baseUrl?: string
  data?: any
  useCookie?: boolean
  headers?: HeadersInit
  [key: string]: any
}) {
  return new Promise((resolve, reject) => {
    let url = option.url
    let baseUrl = option.baseUrl || '/'
    const headers = new Headers(option.headers || {
      'Content-type': 'application/json'
    })

    const token: string | null = getToken()

    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }

    let opt: any = {
      method: option.method ?? 'post',
      headers
    }

    if (opt.method?.toLocaleLowerCase() === 'get') {
      const params = option.data || {}
      opt.query = params
  
      url += `?t=${Date.now()}`
    }
  
    const method = opt.method?.toLowerCase()
    if (method === 'post' || method === 'put' || method === 'patch' || method === 'delete') {
      opt.body = option.data
    }


    url = /^\bhttp(s)?\b|\/\//.test(url) ? url : `${baseUrl}${url.replace(/^\/*/, '')}`

    $fetch(url, opt).then((response: any) => {
      const { code, data, error = {}, message } = response
      let result
      let msg = message || ''

      if (code === undefined) {
        result = response
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
        message: msg
      }
      reject(errorRes)
    }).catch((err) => {
      console.log('http error', err)
    })
  })
}