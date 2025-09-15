import { ProjectService } from '~/server/database/services/ProjectService'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    // 基础校验：名称
    if (!body.name || String(body.name).trim().length === 0) {
      return { code: -1001, message: '请输入项目名称' }
    }
    // 基础校验：host
    if (!body.host || String(body.host).trim().length === 0) {
      return { code: -1001, message: '请输入主机地址（host），例如：api.example.com' }
    }
    // 规范校验：host 格式
    const hostPattern = /^[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?)*$/
    if (!hostPattern.test(body.host)) {
      return { code: -1001, message: '主机地址格式不正确，应为域名形式：api.example.com' }
    }

    // 直接写入 host（可空），不再构造 base_url
    const projectData = {
      name: body.name,
      description: body.description || '',
      host: body.host || null,
      owner_id: body.owner_id || 1 // 临时使用固定值，后续从认证中获取
    }

    const project = await ProjectService.createProject(projectData)

    return {
      code: 0,
      message: '创建项目成功',
      data: project
    }
  } catch (error: any) {
    // 针对唯一约束等常见错误给出清晰文案
    if (error?.name === 'SequelizeUniqueConstraintError') {
      const first = Array.isArray(error?.errors) ? error.errors[0] : undefined
      const field = first?.path || ''
      if (field.includes('pid')) {
        return { code: -1006, message: '系统生成的项目编号冲突，请重试' }
      }
      if (field.includes('name')) {
        return { code: -1006, message: '项目名称已存在，请更换名称' }
      }
      return { code: -1006, message: '项目已存在或唯一性冲突，请稍后重试' }
    }
    // 业务错误统一返回负数 code，不抛 HTTP 错误
    return {
      code: -1002,
      message: error instanceof Error ? `创建项目失败: ${error.message}` : '创建项目失败'
    }
  }
})
