import { Model, DataTypes, Optional } from 'sequelize'
import { sequelize } from '../config'

// 项目接口定义
export interface ProjectAttributes {
  id: number
  pid: number // 项目唯一标识
  name: string
  description?: string
  host?: string
  owner_id: number // 项目所有者ID
  created_at: Date
  updated_at: Date
}

// 创建项目时的可选字段
export interface ProjectCreationAttributes extends Optional<ProjectAttributes, 'id' | 'pid' | 'created_at' | 'updated_at'> {}

// 项目模型类
export class Project extends Model {}

// 初始化项目模型
Project.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      comment: '项目ID'
    },
    pid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      comment: '项目唯一标识'
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: '项目名称'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '项目描述'
    },
    host: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: '项目主机名（如 api.example.com）'
    },
    owner_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '项目所有者ID'
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: '创建时间'
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: '更新时间'
    }
  },
  {
    sequelize,
    tableName: 'projects',
    modelName: 'Project',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['owner_id']
      },
      {
        fields: ['name']
      }
    ]
  }
)

export default Project
