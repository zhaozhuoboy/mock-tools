import { defineEventHandler, getMethod, getRouterParam } from 'h3'
import { ApiDetailService } from '../../../../database/services/ApiDetailService'
import { ProjectService } from '../../../../database/services/ProjectService'
import { ApiService } from '~/server/database/services/ApiService'

/**
 * 代理接口 - 根据用户ID、项目ID和路径返回mock数据
 * 路径格式: /proxy/:uid/:projectId/:path
 * 示例: /proxy/10000/123123/user/list
 */
export default defineEventHandler(async (event) => {
  try {
    // 获取路由参数
    const uid = getRouterParam(event, 'uid')
    const projectId = getRouterParam(event, 'projectId')
    const path = getRouterParam(event, 'path')
    const method = getMethod(event)

    // 验证参数
    if (!uid || !projectId || !path) {
      throw createError({
        statusCode: 400,
        statusMessage: '缺少必要参数: uid, projectId, path'
      })
    }

    // 验证项目是否存在且属于该用户
    const project = await ProjectService.getProjectByPid(Number(projectId))
    if (!project) {
      return {
        code: -1001,
        message: '项目不存在'
      }
    }

    // 根据路径查找API
    const api = await ApiService.findByPath(`/${path}`)
    if (!api) {
      return {
        code: -1002,
        message: `未找到接口: ${method.toUpperCase()} /${path}`
      }
    }

    if (api.get('method') !== method.toLowerCase()) {
      return {
        code: -1003,
        message: `接口方法不匹配: ${method.toUpperCase()} /${path} 请使用: ${(api.get('method') as string).toUpperCase()} 方法`
      }
    }

    // 获取该API的激活状态数据（优先按 uid）
    const activeData = await ApiDetailService.getUserActiveDetail(Number(uid), api.get('id') as string)

    // 解析mock数据
    let mockData
    try {
      mockData = activeData ? JSON.parse(activeData.get('payload') as string) : {}
    } catch (error) {
      return {
        code: -1004,
        message: 'Mock数据格式错误，无法解析JSON'
      }
    }

    // 设置响应头
    setHeader(event, 'Content-Type', 'application/json')
    setHeader(event, 'Access-Control-Allow-Origin', '*')
    setHeader(event, 'Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
    setHeader(event, 'Access-Control-Allow-Headers', 'Content-Type, Authorization')

    // 返回mock数据
    return mockData

  } catch (error: any) {
    // 如果是我们创建的HTTP错误，直接抛出
    if (error.statusCode) {
      throw error
    }

    // 其他错误返回500
    console.error('代理接口错误:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message || '服务器内部错误'
    })
  }
})
