import { Op } from 'sequelize'
import { User, UserAttributes, UserCreationAttributes } from '../models/User'

export class UserService {
  /**
   * 创建新用户
   */
  static async createUser(userData: UserCreationAttributes): Promise<User> {
    try {
      // 直接创建用户，uid 由数据库自增
      const user = await User.create(userData)
      return user
    } catch (error) {
      console.error('创建用户失败:', error)
      throw error
    }
  }

  /**
   * 根据ID查找用户
   */
  static async findById(id: number): Promise<User | null> {
    try {
      return await User.findByPk(id, {
        attributes: ['uid', 'email', 'avatar', 'nickname', 'username']
      })
    } catch (error) {
      console.error('查找用户失败:', error)
      throw error
    }
  }

  /**
   * 根据UID查找用户
   */
  static async findByUid(uid: number): Promise<User | null> {
    try {
      return await User.findOne({
        where: { uid },
        attributes: ['uid', 'email', 'avatar', 'nickname', 'username']
      })
    } catch (error) {
      console.error('查找用户失败:', error)
      throw error
    }
  }

  /**
   * 根据用户名查找用户
   */
  static async findByUsername(username: string): Promise<User | null> {
    try {
      return await User.findOne({
        where: { username }
      })
    } catch (error) {
      console.error('查找用户失败:', error)
      throw error
    }
  }

  /**
   * 根据邮箱查找用户
   */
  static async findByEmail(email: string): Promise<User | null> {
    try {
      return await User.findOne({
        where: { email }
      })
    } catch (error) {
      console.error('查找用户失败:', error)
      throw error
    }
  }

  /**
   * 更新用户信息
   */
  static async updateUser(id: number, updateData: Partial<UserAttributes>): Promise<User | null> {
    try {
      const user = await User.findByPk(id)
      if (!user) {
        return null
      }
      
      await user.update(updateData)
      return user
    } catch (error) {
      console.error('更新用户失败:', error)
      throw error
    }
  }

  /**
   * 删除用户
   */
  static async deleteUser(id: number): Promise<boolean> {
    try {
      const user = await User.findByPk(id)
      if (!user) {
        return false
      }
      
      await user.destroy()
      return true
    } catch (error) {
      console.error('删除用户失败:', error)
      throw error
    }
  }

  /**
   * 获取用户列表
   */
  static async getUsers(params: {
    page?: number
    limit?: number
    status?: string
    role?: string
    search?: string
  } = {}): Promise<{
    users: User[]
    total: number
    page: number
    limit: number
    totalPages: number
  }> {
    try {
      const { page = 1, limit = 10, status, role, search } = params
      const offset = (page - 1) * limit
      
      const where: any = {}
      
      if (status) {
        where.status = status
      }
      
      if (role) {
        where.role = role
      }
      
      if (search) {
        where[Op.or] = [
          { username: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
          { nickname: { [Op.like]: `%${search}%` } }
        ]
      }
      
      const { count, rows } = await User.findAndCountAll({
        where,
        limit,
        offset,
        order: [['created_at', 'DESC']]
      })
      
      return {
        users: rows,
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      }
    } catch (error) {
      console.error('获取用户列表失败:', error)
      throw error
    }
  }

  /**
   * 更新用户最后登录时间
   */
  static async updateLastLogin(id: number): Promise<void> {
    try {
      await User.update(
        { last_login_at: new Date() },
        { where: { id } }
      )
    } catch (error) {
      console.error('更新最后登录时间失败:', error)
      throw error
    }
  }

  /**
   * 检查用户名是否存在
   */
  static async isUsernameExists(username: string, excludeId?: number): Promise<boolean> {
    try {
      const where: any = { username }
      if (excludeId) {
        where.id = { [Op.ne]: excludeId }
      }
      
      const count = await User.count({ where })
      return count > 0
    } catch (error) {
      console.error('检查用户名失败:', error)
      throw error
    }
  }

  /**
   * 检查邮箱是否存在
   */
  static async isEmailExists(email: string, excludeId?: number): Promise<boolean> {
    try {
      const where: any = { email }
      if (excludeId) {
        where.id = { [Op.ne]: excludeId }
      }
      
      const count = await User.count({ where })
      return count > 0
    } catch (error) {
      console.error('检查邮箱失败:', error)
      throw error
    }
  }
} 