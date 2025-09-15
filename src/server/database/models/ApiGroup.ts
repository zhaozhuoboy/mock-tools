import { Model, DataTypes, Optional } from 'sequelize'
import { sequelize } from '../config'

export interface ApiGroupAttributes {
  id: number
  project_id: number
  name: string
  created_at: Date
  updated_at: Date
}

export interface ApiGroupCreationAttributes extends Optional<ApiGroupAttributes, 'id' | 'created_at' | 'updated_at'> {}

export class ApiGroup extends Model<ApiGroupAttributes, ApiGroupCreationAttributes> implements ApiGroupAttributes {
  public id!: number
  public project_id!: number
  public name!: string
  public created_at!: Date
  public updated_at!: Date
}

ApiGroup.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    // 这里存项目的 pid，而非 projects.id
    project_id: { type: DataTypes.INTEGER, allowNull: false, comment: '关联项目PID' },
    name: { type: DataTypes.STRING(100), allowNull: false, comment: '分组名称' },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
  },
  {
    sequelize,
    tableName: 'api_groups',
    modelName: 'ApiGroup',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      { fields: ['project_id'] },
      { unique: true, fields: ['project_id', 'name'] }
    ]
  }
)

export default ApiGroup



