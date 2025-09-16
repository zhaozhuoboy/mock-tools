import { ApiService, ProjectService } from "~/server/database/services/ProjectService";
import { Api } from '~/server/database/models/Api'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    
    // 验证必要参数
    if (!Number.isFinite(body.id)) {
      return { code: -1241, message: '无效的接口ID' }
    }
    if (!Number.isFinite(body.pid)) {
      return { code: -1242, message: '无效的项目ID' }
    }

    // 验证项目是否存在
    const project = await ProjectService.getProjectByPid(body.pid)
    if (!project) {
      return { code: -1243, message: '项目不存在' }
    }

    const rawId = (project as any)?.id ?? (typeof (project as any)?.get === 'function' ? (project as any).get('id') : undefined)
    const projectId = String(rawId).trim()
    if (!projectId) {
      return { code: -1244, message: '项目主键无效' }
    }

    // 验证接口是否存在
    const existingApi = await Api.findByPk(body.id)
    if (!existingApi) {
      return { code: -1245, message: '接口不存在' }
    }

    // 验证接口是否属于该项目
    const apiProjectId = (existingApi as any)?.project_id ?? (typeof (existingApi as any)?.get === 'function' ? (existingApi as any).get('project_id') : undefined)
    if (Number(apiProjectId) !== projectId) {
      return { code: -1246, message: '接口不属于该项目' }
    }

    // 执行删除
    const deletedApi = await ApiService.deleteApi(body.id)
    if (!deletedApi) {
      return { code: -1247, message: '删除失败' }
    }

    return { 
      code: 0, 
      message: '删除成功', 
      data: deletedApi 
    }
  } catch (error: any) {
    // 输出到服务器日志便于定位
    console.error('Delete API error:', error?.name, error?.message, error?.parent?.code, error?.parent?.sqlMessage)
    const detailsArr = Array.isArray(error?.errors) ? error.errors.map((e: any) => ({ message: e?.message, path: e?.path, value: e?.value })) : []
    const detailsText = detailsArr.map((e: any) => e?.message).filter(Boolean).join('; ')
    const dbMsg = error?.parent?.sqlMessage || error?.original?.sqlMessage || ''
    const msg = detailsText || dbMsg || error?.message || '删除失败'
    return { code: -1248, message: msg, errors: detailsArr, debug: { name: error?.name, code: error?.parent?.code } }
  }
})