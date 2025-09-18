import { Api, ApiAttributes, ApiCreationAttributes } from '../models/Api'

export class ApiService {
  static async listByProject(projectId: string): Promise<Api[]> {
    return Api.findAll({ where: { project_id: projectId }, order: [['created_at', 'DESC']] })
  }
  /**
   * 创建接口
   * @param projectId 项目ID
   * @param data 接口数据
   * @returns 创建的接口
   */
  static async create(projectId: string, data: ApiCreationAttributes): Promise<Api> {
    return Api.create({ ...data, project_id: projectId })
  }
  /**
   * 更新接口
   * @param id 接口ID
   * @param data 接口数据
   * @returns 
   */
  static async update(id: string, data: Partial<ApiAttributes>): Promise<Api | null> {
    const api = await Api.findByPk(id)
    if (!api) {
      return null
    }
    await api.update({ ...data })
    return api
  }

  /**
   * 删除接口
   * @param id 接口ID
   * @returns 
   */
  static async deleteApi(id: string): Promise<Api | null> {
    const api = await Api.findByPk(id)
    if (!api) {
      return null
    }
    await api.destroy()
    return api
  }
  /**
   * 统计接口数量
   * @param projectId 项目ID
   * @returns 接口数量
   */
  static async countByProject(projectId: string): Promise<number> {
    return Api.count({ where: { project_id: projectId } })
  }

  /**
   * 根据路径查找API
   * @param path 接口路径
   * @returns 找到的API
   */
  static async findByPath(path: string): Promise<Api | null> {
    try {
      const api = await Api.findOne({
        where: {
          path: path
        }
      })
      return api
    } catch (error) {
      throw new Error(`查找API失败: ${error}`)
    }
  }
}