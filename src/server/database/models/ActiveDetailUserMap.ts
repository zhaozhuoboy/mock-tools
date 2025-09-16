import { Model, DataTypes, Optional } from 'sequelize'
import { sequelize } from '../config'

export interface ActiveDetailUserMapAttributes {
  id: number
  user_uid: number
  api_id: string
  detail_id: string
  created_at: Date
  updated_at: Date
}

export interface ActiveDetailUserMapCreationAttributes extends Optional<ActiveDetailUserMapAttributes, 'id' | 'created_at' | 'updated_at'> {}

export class ActiveDetailUserMap extends Model {}

ActiveDetailUserMap.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      comment: '主键ID'
    },
    user_uid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '用户唯一标识 (users.uid)'
    },
    api_id: {
      type: DataTypes.STRING(36),
      allowNull: false,
      comment: 'API ID (apis.id)'
    },
    detail_id: {
      type: DataTypes.STRING(36),
      allowNull: false,
      comment: 'API 详情ID (api_details.id)'
    },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
  },
  {
    sequelize,
    tableName: 'active_detail_user_map',
    modelName: 'ActiveDetailUserMap',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      { unique: true, fields: ['user_uid', 'api_id'] },
      { fields: ['detail_id'] }
    ]
  }
)

export default ActiveDetailUserMap


