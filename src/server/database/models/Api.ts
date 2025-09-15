import { Model, DataTypes, Optional } from 'sequelize'
import { sequelize } from '../config'

export interface ApiAttributes {
  id: number
  project_id: number
  path: string
  method: 'get' | 'post' | 'put' | 'patch' | 'delete'
  group?: string
  description?: string
  created_at: Date
  updated_at: Date
}

export interface ApiCreationAttributes extends Optional<ApiAttributes, 'id' | 'group' | 'description' | 'created_at' | 'updated_at'> {}

export class Api extends Model<ApiAttributes, ApiCreationAttributes> implements ApiAttributes {
  public id!: number
  public project_id!: number
  public path!: string
  public method!: 'get' | 'post' | 'put' | 'patch' | 'delete'
  public group?: string
  public description?: string
  public created_at!: Date
  public updated_at!: Date
}

Api.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    project_id: { type: DataTypes.INTEGER, allowNull: false, comment: '关联项目ID' },
    path: { type: DataTypes.STRING(255), allowNull: false, comment: '接口路径' },
    method: { type: DataTypes.ENUM('get', 'post', 'put', 'patch', 'delete'), allowNull: false, comment: 'HTTP 方法' },
    group: { type: DataTypes.STRING(100), allowNull: true, comment: '所属分组' },
    description: { type: DataTypes.STRING(500), allowNull: true, comment: '接口描述' },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
  },
  {
    sequelize,
    tableName: 'apis',
    modelName: 'Api',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      { fields: ['project_id'] },
      { fields: ['group'] },
      { fields: ['method'] }
    ]
  }
)

export default Api


