import { sequelize } from '../config'
import User from './User'
import Project from './Project'

// 导出所有模型
export { User, Project }
export { sequelize }

// 定义模型关联关系
export const setupAssociations = () => {
  // 用户和项目的关联关系
  User.hasMany(Project, { foreignKey: 'owner_id', as: 'projects' })
  Project.belongsTo(User, { foreignKey: 'owner_id', as: 'owner' })
  
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
