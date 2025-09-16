import { Model, DataTypes, Optional } from 'sequelize'
import { sequelize } from '../config'
import { v4 as uuidv4 } from 'uuid'

export interface ApiDetailAttributes {
  id: string // 使用 UUID 作为主键
  api_id: string // 关联的 API ID
  name: string // 数据名称，用于下拉展示
  payload: string // 数据内容（JSON 字符串）
  is_active: boolean // 是否为当前使用的数据
  created_at: Date
  updated_at: Date
}

export interface ApiDetailCreationAttributes extends Optional<ApiDetailAttributes, 'id' | 'is_active' | 'created_at' | 'updated_at'> {}

export class ApiDetail extends Model {}

ApiDetail.init(
  {
    id: { 
      type: DataTypes.STRING(36), 
      defaultValue: () => uuidv4(), 
      primaryKey: true, 
      comment: '数据详情ID (UUID)' 
    },
    api_id: { 
      type: DataTypes.STRING(36), 
      allowNull: false, 
      comment: '关联的API ID (UUID)' 
    },
    name: { 
      type: DataTypes.STRING(100), 
      allowNull: false, 
      comment: '数据名称' 
    },
    payload: { 
      type: DataTypes.TEXT, 
      allowNull: false, 
      comment: '数据内容（JSON字符串）' 
    },
    is_active: { 
      type: DataTypes.BOOLEAN, 
      allowNull: false, 
      defaultValue: false,
      comment: '是否为当前使用的数据' 
    },
    created_at: { 
      type: DataTypes.DATE, 
      allowNull: false, 
      defaultValue: DataTypes.NOW 
    },
    updated_at: { 
      type: DataTypes.DATE, 
      allowNull: false, 
      defaultValue: DataTypes.NOW 
    }
  },
  {
    sequelize,
    tableName: 'api_details',
    modelName: 'ApiDetail',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      { fields: ['api_id'] },
      { fields: ['is_active'] }
    ]
  }
)

export default ApiDetail
