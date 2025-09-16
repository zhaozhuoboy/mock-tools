import { sequelize } from '../config'
import User from './User'
import Project from './Project'
import Api from './Api'
import ApiGroup from './ApiGroup'
import ApiDetail from './ApiDetail'
import ActiveDetailUserMap from './ActiveDetailUserMap'

// 导出所有模型
export { User, Project, Api, ApiGroup, ApiDetail, ActiveDetailUserMap }
export { sequelize }

// 定义模型关联关系
export const setupAssociations = () => {
  // 用户和项目的关联关系
  // 关闭外键约束以避免开发环境同步时因脏数据造成失败
  User.hasMany(Project, { foreignKey: 'owner_id', as: 'projects', constraints: false })
  Project.belongsTo(User, { foreignKey: 'owner_id', as: 'owner', constraints: false })
  // 项目与接口的关联
  Project.hasMany(Api, { foreignKey: 'project_id', as: 'apis', constraints: false })
  Api.belongsTo(Project, { foreignKey: 'project_id', as: 'project', constraints: false })
  // 项目与分组的关联：以 Project.pid 作为目标键，api_groups.project_id 存 pid
  Project.hasMany(ApiGroup, { foreignKey: 'project_id', as: 'groups', sourceKey: 'pid', constraints: false })
  ApiGroup.belongsTo(Project, { foreignKey: 'project_id', as: 'project', targetKey: 'pid', constraints: false })
  
  // API 与 API 详情的关联
  Api.hasMany(ApiDetail, { foreignKey: 'api_id', as: 'details', constraints: false })
  ApiDetail.belongsTo(Api, { foreignKey: 'api_id', as: 'api', constraints: false })
  
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
    if (force) {
      await sequelize.sync({ force: true })
    } else {
      // 开发环境：增量同步表结构，自动创建/修改列与新表
      await sequelize.sync({ alter: true })
    }
    console.log('✅ 所有模型同步成功')
    return true
  } catch (error) {
    console.error('❌ 模型同步失败:', error)
    return false
  }
}
