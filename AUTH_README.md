# 登录注册功能说明

## 功能概述

本项目已完成登录注册功能的开发，包括：

### 前端功能

- ✅ 用户登录页面 (`/auth/login`)
- ✅ 用户注册页面 (`/auth/register`)
- ✅ 认证布局 (`layouts/auth.vue`)
- ✅ 用户状态管理 (Pinia Store)
- ✅ 认证中间件
- ✅ 头部组件集成登录/登出功能

### 后端功能

- ✅ 用户注册 API (`/api/user/register`)
- ✅ 用户登录 API (`/api/user/login`)
- ✅ 获取用户信息 API (`/api/user/me`)
- ✅ 用户登出 API (`/api/user/logout`)
- ✅ 密码加密存储 (使用 scrypt 算法加盐)
- ✅ JWT Token 认证

## 技术实现

### 密码安全

- 使用 `scrypt` 算法进行密码加密
- 每个密码都使用随机生成的盐值
- 密码格式：`salt:hashedPassword`

### 认证流程

1. 用户注册时密码会被加密存储
2. 登录时验证密码并生成 JWT Token
3. 后续请求通过 Authorization Header 携带 Token
4. Token 有效期为 7 天

### 数据验证

- 使用 `zod` 进行请求数据验证
- 用户名：3-50 字符，只允许字母、数字、下划线
- 邮箱：标准邮箱格式验证
- 密码：6-100 字符，必须包含大小写字母和数字
- 手机号：中国大陆手机号格式验证

## 页面路由

- `/` - 首页（根据登录状态显示不同内容）
- `/auth/login` - 登录页面
- `/auth/register` - 注册页面
- `/dashboard` - 仪表盘（需要登录）
- `/projects` - 项目管理（需要登录）

## API 接口

### 用户注册

```http
POST /api/user/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "Test123456",
  "nickname": "测试用户",
  "phone": "13800138000"
}
```

### 用户登录

```http
POST /api/user/login
Content-Type: application/json

{
  "username": "testuser",
  "password": "Test123456"
}
```

### 获取用户信息

```http
GET /api/user/me
Authorization: Bearer <token>
```

### 用户登出

```http
POST /api/user/logout
```

## 使用方法

### 1. 启动项目

```bash
pnpm dev
```

### 2. 访问页面

- 打开浏览器访问 `http://localhost:6780`
- 点击"免费注册"创建新账户
- 或点击"立即登录"使用现有账户

### 3. 测试功能

```bash
# 运行测试脚本
node test-auth.js
```

## 安全特性

1. **密码加密**：使用 scrypt 算法加盐加密，防止彩虹表攻击
2. **Token 认证**：JWT Token 用于身份验证，支持过期时间
3. **输入验证**：前后端双重验证，防止恶意输入
4. **SQL 注入防护**：使用 Sequelize ORM，自动防护 SQL 注入
5. **XSS 防护**：使用 Vue 的模板系统，自动转义用户输入

## 注意事项

1. 确保数据库已正确初始化
2. 生产环境中需要设置强密码的 JWT_SECRET
3. 建议启用 HTTPS 以保护传输安全
4. 定期更新依赖包以修复安全漏洞

## 后续优化建议

1. 添加验证码功能防止暴力破解
2. 实现记住登录状态功能
3. 添加密码重置功能
4. 实现多因素认证(MFA)
5. 添加登录日志和审计功能
