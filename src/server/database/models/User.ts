import { Model, DataTypes, Optional } from 'sequelize'
import { sequelize } from '../config'

// 用户接口定义
export interface UserAttributes {
  id: number
  uid: number // 修改为 number 类型
  username: string
  email: string
  password: string
  avatar?: string
  nickname?: string
  phone?: string
  status: 'active' | 'inactive' | 'banned'
  role: 'admin' | 'user' | 'guest'
  last_login_at?: Date
  created_at: Date
  updated_at: Date
}

// 创建用户时的可选字段
export interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'created_at' | 'updated_at'> {}

// 用户模型类
export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number
  public uid!: number // 修改为 number 类型
  public username!: string
  public email!: string
  public password!: string
  public avatar?: string
  public nickname?: string
  public phone?: string
  public status!: 'active' | 'inactive' | 'banned'
  public role!: 'admin' | 'user' | 'guest'
  public last_login_at?: Date
  public created_at!: Date
  public updated_at!: Date

  // 时间戳
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

// 初始化用户模型
User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      comment: '用户ID'
    },
    uid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      comment: '用户唯一标识',
      defaultValue: 100000 // 设置初始值
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      comment: '用户名'
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      },
      comment: '邮箱'
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: '密码（加密）'
    },
    avatar: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: '头像URL'
    },
    nickname: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: '昵称'
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: '手机号'
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'banned'),
      allowNull: false,
      defaultValue: 'active',
      comment: '用户状态'
    },
    role: {
      type: DataTypes.ENUM('admin', 'user', 'guest'),
      allowNull: false,
      defaultValue: 'user',
      comment: '用户角色'
    },
    last_login_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: '最后登录时间'
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
    tableName: 'users',
    modelName: 'User',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['status']
      },
      {
        fields: ['role']
      }
    ]
  }
)

export default User 