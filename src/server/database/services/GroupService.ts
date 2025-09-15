import { ApiGroup, ApiGroupAttributes, ApiGroupCreationAttributes } from '../models/ApiGroup'
import { Api } from '../models/Api'

export class GroupService {
  // 注意：以下方法的 projectId 均指项目的 pid（与 api_groups.project_id 对应）
  static async listByProject(projectPid: number): Promise<ApiGroup[]> {
    return ApiGroup.findAll({ where: { project_id: projectPid }, order: [['created_at', 'DESC']] })
  }

  static async findOrCreate(projectPid: number, name: string): Promise<ApiGroup> {
    const trimmed = String(name).trim()
    // 先查，避免无意义的唯一约束冲突
    const where = { project_id: projectPid, name: trimmed }
    const existed = await ApiGroup.findOne({ where })
    if (existed) return existed
    try {
      const created = await ApiGroup.create({ project_id: projectPid, name: trimmed })
      return created
    } catch (err: any) {
      // 并发或历史数据导致的唯一冲突，回退查询返回
      if (err?.name === 'SequelizeUniqueConstraintError') {
        const again = await ApiGroup.findOne({ where })
        if (again) return again
      }
      throw err
    }
  }

  /**
   * 获取项目所有分组名（包含已存于 api_groups 表和历史接口中的去重分组）
   */
  static async listAllGroupNames(projectPid: number): Promise<ApiGroup[]> {
    // 仅使用 pid 查询 api_groups
    const groups = await ApiGroup.findAll({ where: { project_id: projectPid } })
    return groups;
    
  }
}

export type { ApiGroup, ApiGroupAttributes, ApiGroupCreationAttributes }


