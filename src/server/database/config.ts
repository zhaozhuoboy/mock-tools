import { Sequelize } from 'sequelize'

// 数据库配置
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3307'),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '123456',
  database: process.env.DB_NAME || 'nuxt_start_app',
  dialect: 'mysql' as const,
  logging: undefined,
  // logging: console.log,
  timezone: '+08:00',
  define: {
    timestamps: true,
    underscored: true,
    freezeTableName: true
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
}

// 创建 Sequelize 实例
export const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    timezone: dbConfig.timezone,
    define: dbConfig.define,
    pool: dbConfig.pool
  }
)