import { ApiService, ProjectService } from '~/server/database/services/ProjectService'
import { GroupService } from '~/server/database/services/GroupService'
import { Api } from '~/server/database/models/Api'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    console.log('body', body)
    
    // 验证必要参数
    if (!Number.isFinite(body.id)) {
      return { code: -1221, message: '无效的接口ID' }
    }
    if (!Number.isFinite(body.pid)) {
      return { code: -1222, message: '无效的项目ID' }
    }

    // 验证项目是否存在
    const project = await ProjectService.getProjectByPid(body.pid)
    if (!project) {
      return { code: -1223, message: '项目不存在' }
    }

    const rawId = (project as any)?.id ?? (typeof (project as any)?.get === 'function' ? (project as any).get('id') : undefined)
    const projectId = String(rawId).trim()
    if (!projectId) {
      return { code: -1224, message: '项目主键无效' }
    }

    // 验证接口是否存在
    const existingApi = await Api.findByPk(body.id)
    if (!existingApi) {
      return { code: -1225, message: '接口不存在' }
    }

    // 验证接口是否属于该项目
    const apiProjectId = (existingApi as any)?.project_id ?? (typeof (existingApi as any)?.get === 'function' ? (existingApi as any).get('project_id') : undefined)
    if (Number(apiProjectId) !== projectId) {
      return { code: -1226, message: '接口不属于该项目' }
    }

    // 数据验证和清理
    const updateData: any = {}
    
    if (body.path !== undefined) {
      const path = String(body.path).trim()
      if (path.length < 1 || path.length > 255) {
        return { code: -1227, message: '路径长度应在 1-255 个字符' }
      }
      updateData.path = path
    }

    if (body.method !== undefined) {
      const method = String(body.method).toLowerCase().trim()
      const allowedMethods = ['get', 'post', 'put', 'patch', 'delete']
      if (!allowedMethods.includes(method)) {
        return { code: -1228, message: '无效的请求方法' }
      }
      updateData.method = method
    }

    if (body.group !== undefined) {
      const group = String(body.group).trim()
      if (group && group.length > 100) {
        return { code: -1229, message: '分组名称长度不能超过 100 个字符' }
      }
      updateData.group = group || null
      
      // 如果设置了分组，确保分组存在
      if (group) {
        await GroupService.findOrCreate(body.pid, group)
      }
    }

    if (body.description !== undefined) {
      const description = String(body.description).trim()
      if (description && description.length > 500) {
        return { code: -1230, message: '描述长度不能超过 500 个字符' }
      }
      updateData.description = description || null
    }

    // 如果没有要更新的数据
    if (Object.keys(updateData).length === 0) {
      return { code: -1231, message: '没有提供要更新的数据' }
    }

    // 执行更新
    const updatedApi = await ApiService.update(body.id, updateData)
    if (!updatedApi) {
      return { code: -1232, message: '更新失败' }
    }

    return { 
      code: 0, 
      message: '更新成功', 
      data: updatedApi 
    }

  } catch (error: any) {
    // 输出到服务器日志便于定位
    console.error('Update API error:', error?.name, error?.message, error?.parent?.code, error?.parent?.sqlMessage)
    const detailsArr = Array.isArray(error?.errors) ? error.errors.map((e: any) => ({ message: e?.message, path: e?.path, value: e?.value })) : []
    const detailsText = detailsArr.map((e: any) => e?.message).filter(Boolean).join('; ')
    const dbMsg = error?.parent?.sqlMessage || error?.original?.sqlMessage || ''
    const msg = detailsText || dbMsg || error?.message || '更新失败'
    return { code: -1233, message: msg, errors: detailsArr, debug: { name: error?.name, code: error?.parent?.code } }
  }
})