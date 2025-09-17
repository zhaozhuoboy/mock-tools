import { initializeModels, syncAllModels } from './models'

/**
 * 初始化数据库
 */
export const initDatabase = async () => {
  try {
    // 初始化模型
    const success = await initializeModels()
    if (!success) {
      throw new Error('数据库初始化失败')
    }

    // 同步数据库结构（开发和生产环境都需要）
    await syncAllModels(false)

    console.log('✅ 数据库初始化完成')
    return true
  } catch (error) {
    console.error('❌ 数据库初始化失败:', error)
    return false
  }
}

/**
 * 关闭数据库连接
 */
export const closeDatabase = async () => {
  try {
    const { sequelize } = await import('./config')
    await sequelize.close()
    console.log('✅ 数据库连接已关闭')
  } catch (error) {
    console.error('❌ 关闭数据库连接失败:', error)
  }
} 