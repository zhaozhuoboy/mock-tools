import { sequelize } from '../config'
import User from './User'

// 导出所有模型
export { User }
export { sequelize }

// 定义模型关联关系
export const setupAssociations = () => {
  // 在这里可以定义模型之间的关联关系
  // 例如：User.hasMany(Post)
  // 例如：Post.belongsTo(User)
  
  console.log('✅ 模型关联关系设置完成')
}

// 初始化所有模型
export const initializeModels = async () => {
  try {
    // 设置模型关联
    setupAssociations()
    
    // 测试数据库连接
    await sequelize.authenticate()
    console.log('✅ 数据库连接成功')
    
    return true
  } catch (error) {
    console.error('❌ 数据库初始化失败:', error)
    return false
  }
}

// 同步数据库（开发环境使用）
export const syncAllModels = async (force = false) => {
  try {
    await sequelize.sync({ force })
    console.log('✅ 所有模型同步成功')
    return true
  } catch (error) {
    console.error('❌ 模型同步失败:', error)
    return false
  }
} 