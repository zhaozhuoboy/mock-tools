import { ApiDetail, ApiDetailAttributes, ApiDetailCreationAttributes } from '../models/ApiDetail'
import { Api } from '../models/Api'

export class ApiDetailService {
  /**
   * 获取指定 API 的所有数据详情
   */
  static async getByApiId(apiId: string): Promise<ApiDetail[]> {
    try {
      const details = await ApiDetail.findAll({
        where: { api_id: apiId },
        order: [['created_at', 'ASC']]
      })
      return details
    } catch (error) {
      throw new Error(`获取API详情失败: ${error}`)
    }
  }

  /**
   * 获取指定 API 的当前活跃数据
   */
  static async getActiveByApiId(apiId: string): Promise<ApiDetail | null> {
    try {
      const detail = await ApiDetail.findOne({
        where: { 
          api_id: apiId,
          is_active: true 
        }
      })
      return detail
    } catch (error) {
      throw new Error(`获取当前活跃数据失败: ${error}`)
    }
  }

  /**
   * 创建新的 API 数据详情
   */
  static async create(data: ApiDetailCreationAttributes): Promise<ApiDetail> {
    try {
      // 如果设置为活跃，先取消其他活跃状态
      if (data.is_active) {
        await ApiDetail.update(
          { is_active: false },
          { where: { api_id: data.api_id } }
        )
      }

      const detail = await ApiDetail.create(data)
      return detail
    } catch (error) {
      throw new Error(`创建API详情失败: ${error}`)
    }
  }

  /**
   * 更新 API 数据详情
   */
  static async update(id: string, data: Partial<ApiDetailAttributes>): Promise<ApiDetail | null> {
    try {
      const detail = await ApiDetail.findByPk(id)
      if (!detail) {
        return null
      }

      // 如果设置为活跃，先取消其他活跃状态
      if (data.is_active) {
        await ApiDetail.update(
          { is_active: false },
          { where: { api_id: detail.api_id } }
        )
      }

      await detail.update(data)
      return detail
    } catch (error) {
      throw new Error(`更新API详情失败: ${error}`)
    }
  }

  /**
   * 删除 API 数据详情
   */
  static async delete(id: string): Promise<boolean> {
    try {
      const detail = await ApiDetail.findByPk(id)
      if (!detail) {
        return false
      }

      await detail.destroy()
      return true
    } catch (error) {
      throw new Error(`删除API详情失败: ${error}`)
    }
  }

  /**
   * 设置指定数据为当前活跃数据
   */
  static async setActive(id: string): Promise<ApiDetail | null> {
    try {
      const detail = await ApiDetail.findByPk(id)
      if (!detail) {
        return null
      }

      // 先取消该 API 下所有数据的活跃状态
      await ApiDetail.update(
        { is_active: false },
        { where: { api_id: detail.api_id } }
      )

      // 设置当前数据为活跃
      await detail.update({ is_active: true })
      return detail
    } catch (error) {
      throw new Error(`设置活跃数据失败: ${error}`)
    }
  }

  /**
   * 获取 API 基本信息（用于详情页展示）
   */
  static async getApiInfo(apiId: string): Promise<Api | null> {
    try {
      const api = await Api.findByPk(apiId, {
        include: [
          {
            association: 'project',
            attributes: ['name', 'host']
          }
        ]
      })
      return api
    } catch (error) {
      throw new Error(`获取API信息失败: ${error}`)
    }
  }
}
