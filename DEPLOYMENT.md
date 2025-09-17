# Mock Tools Docker 部署指南

## 快速开始

### 方式一：使用 Docker Compose（推荐）

1. **克隆项目**

   ```bash
   git clone https://github.com/zhaozhuoboy/mock-tools.git
   cd mock-tools
   ```

2. **启动服务**

   ```bash
   docker-compose up -d
   ```

3. **访问应用**
   - 应用地址：http://localhost:3000
   - MySQL 端口：3306

### 方式二：单独构建 Docker 镜像

#### 构建镜像

```bash
# 从 GitHub 仓库克隆代码并构建
docker build -f docker/Dockerfile -t zhaozhuodev/mock_tools:latest .

# 或使用构建脚本
./docker/build.sh build
```

### 方式三：使用 Docker 命令启动

1. **启动 MySQL 数据库**

   ```bash
   docker run -d \
     --name mock-tools-mysql \
     -e MYSQL_ROOT_PASSWORD=mock_tools_root_password \
     -e MYSQL_DATABASE=mock_tools \
     -e MYSQL_USER=mock_tools_user \
     -e MYSQL_PASSWORD=mock_tools_password \
     -p 3306:3306 \
     mysql:8.0
   ```

2. **启动应用**
   ```bash
   docker run -d \
     --name mock-tools-app \
     --link mock-tools-mysql:mysql \
     -e DB_HOST=mysql \
     -e DB_PORT=3306 \
     -e DB_USERNAME=mock_tools_user \
     -e DB_PASSWORD=mock_tools_password \
     -e DB_DATABASE=mock_tools \
     -e JWT_SECRET=mock_tools_jwt_secret_production \
     -p 3000:3000 \
     zhaozhuodev/mock_tools:latest
   ```

## 环境变量配置

### 应用环境变量

| 变量名      | 默认值                           | 说明         |
| ----------- | -------------------------------- | ------------ |
| NODE_ENV    | production                       | 运行环境     |
| NUXT_HOST   | 0.0.0.0                          | 应用监听地址 |
| NUXT_PORT   | 3000                             | 应用端口     |
| DB_HOST     | mysql                            | 数据库主机   |
| DB_PORT     | 3306                             | 数据库端口   |
| DB_USERNAME | mock_tools_user                  | 数据库用户名 |
| DB_PASSWORD | mock_tools_password              | 数据库密码   |
| DB_DATABASE | mock_tools                       | 数据库名称   |
| JWT_SECRET  | mock_tools_jwt_secret_production | JWT 密钥     |

### 数据库环境变量

| 变量名              | 默认值                   | 说明            |
| ------------------- | ------------------------ | --------------- |
| MYSQL_ROOT_PASSWORD | mock_tools_root_password | MySQL root 密码 |
| MYSQL_DATABASE      | mock_tools               | 数据库名称      |
| MYSQL_USER          | mock_tools_user          | 数据库用户      |
| MYSQL_PASSWORD      | mock_tools_password      | 数据库用户密码  |

## 生产环境部署

### 1. 修改环境变量

创建 `.env.prod` 文件：

```bash
# 数据库配置
DB_HOST=your_mysql_host
DB_PORT=3306
DB_USERNAME=your_db_username
DB_PASSWORD=your_secure_password
DB_DATABASE=mock_tools

# JWT 配置
JWT_SECRET=your_very_secure_jwt_secret

# 其他配置
NODE_ENV=production
```

### 2. 构建生产镜像

```bash
# 构建镜像
docker build -f docker/Dockerfile -t zhaozhuodev/mock_tools:prod .

# 推送到镜像仓库
docker tag zhaozhuodev/mock_tools:prod your-registry/mock_tools:latest
docker push your-registry/mock_tools:latest
```

### 3. 部署到生产环境

```bash
# 使用 docker-compose 部署
docker-compose -f docker-compose.prod.yml up -d

# 或使用 Kubernetes、Docker Swarm 等编排工具
```

## 常用命令

### 查看日志

```bash
# 查看应用日志
docker logs mock-tools-app

# 查看数据库日志
docker logs mock-tools-mysql

# 实时查看日志
docker logs -f mock-tools-app
```

### 进入容器

```bash
# 进入应用容器
docker exec -it mock-tools-app sh

# 进入数据库容器
docker exec -it mock-tools-mysql mysql -u root -p
```

### 停止和清理

```bash
# 停止服务
docker-compose down

# 停止并删除数据卷
docker-compose down -v

# 删除镜像
docker rmi zhaozhuodev/mock_tools:latest
```

## 故障排除

### 1. 应用无法连接数据库

检查数据库是否正常运行：

```bash
docker logs mock-tools-mysql
```

检查网络连接：

```bash
docker exec -it mock-tools-app ping mysql
```

### 2. 端口冲突

如果 3000 或 3306 端口被占用，可以修改 `docker-compose.yml` 中的端口映射：

```yaml
ports:
  - '3001:3000' # 将应用端口改为 3001
  - '3307:3306' # 将数据库端口改为 3307
```

### 3. 数据持久化

数据会保存在 Docker 数据卷中，即使容器重启数据也不会丢失。如果需要备份数据：

```bash
# 备份数据库
docker exec mock-tools-mysql mysqldump -u root -p mock_tools > backup.sql

# 恢复数据库
docker exec -i mock-tools-mysql mysql -u root -p mock_tools < backup.sql
```

## 性能优化

### 1. 资源限制

在 `docker-compose.yml` 中添加资源限制：

```yaml
services:
  app:
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.5'
        reservations:
          memory: 256M
          cpus: '0.25'
```

### 2. 健康检查

应用已配置健康检查，可以通过以下命令查看状态：

```bash
docker ps
```

状态为 `healthy` 表示服务正常。

## 安全建议

1. **修改默认密码**：生产环境中务必修改所有默认密码
2. **使用 HTTPS**：在生产环境中配置反向代理（如 Nginx）启用 HTTPS
3. **定期更新**：定期更新基础镜像和依赖包
4. **网络安全**：配置防火墙规则，限制不必要的端口访问
5. **数据备份**：定期备份数据库数据

## 支持

如果遇到问题，请查看：

1. 项目 GitHub Issues：https://github.com/zhaozhuoboy/mock-tools/issues
2. 应用日志：`docker logs mock-tools-app`
3. 数据库日志：`docker logs mock-tools-mysql`

## Dockerfile 说明

项目使用简化的单阶段 Dockerfile，支持从 Git 仓库构建：

### `docker/Dockerfile`

- **用途**：从 Git 仓库克隆代码并构建
- **适用场景**：生产环境、CI/CD 流水线、本地开发
- **特点**：
  - 完全独立，不需要本地代码
  - 使用 ARG 变量统一管理配置
  - 单阶段构建，简单易懂
  - 使用 root 用户，避免权限问题
  - 支持自定义 npm 镜像源
- **项目目录**：`/app/mock_tools`
- **构建命令**：`docker build -f docker/Dockerfile -t zhaozhuodev/mock_tools:latest .`

### 变量配置

Dockerfile 支持以下 ARG 变量：

```dockerfile
ARG NODE_VERSION=18                    # Node.js 版本
ARG GIT_REPO=https://github.com/...    # Git 仓库地址
ARG PROJECT_DIR=/app/mock_tools        # 项目目录
ARG NPM_REGISTRY=https://registry.npmmirror.com/  # NPM 镜像源
ARG APP_PORT=3000                      # 应用端口
ARG USER_NAME=nuxtjs                   # 运行用户
ARG USER_UID=1001                      # 用户 ID
ARG GROUP_NAME=nodejs                  # 用户组
ARG GROUP_GID=1001                     # 组 ID
```

### 自定义构建

```bash
# 使用自定义变量构建
docker build \
  --build-arg NODE_VERSION=20 \
  --build-arg NPM_REGISTRY=https://registry.npmjs.org/ \
  -f docker/Dockerfile \
  -t zhaozhuodev/mock_tools:custom .

# 使用国内镜像源构建（推荐）
docker build \
  --build-arg NPM_REGISTRY=https://registry.npmmirror.com/ \
  -f docker/Dockerfile \
  -t zhaozhuodev/mock_tools:latest .
```

## 镜像信息

- **Docker 镜像名称**：`zhaozhuodev/mock_tools`
- **项目地址**：https://github.com/zhaozhuoboy/mock-tools
- **在线体验**：mock-tools.vercel.app

### 快速拉取镜像

```bash
# 拉取最新版本
docker pull zhaozhuodev/mock_tools:latest

# 拉取指定版本
docker pull zhaozhuodev/mock_tools:v1.0.0
```
