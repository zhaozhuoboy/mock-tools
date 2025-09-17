# 包含 MySQL 的完整版 Dockerfile for Mock Tools
# 定义变量
ARG GIT_REPO=https://github.com/zhaozhuoboy/mock-tools.git
ARG PROJECT_DIR=/app/mock_tools
ARG NODE_VERSION=22
ARG NPM_REGISTRY=https://registry.npmmirror.com/

# 使用 Node.js 基础镜像
FROM node:${NODE_VERSION}-alpine

# 定义变量
ARG GIT_REPO
ARG PROJECT_DIR
ARG NPM_REGISTRY

# 安装 MySQL 和系统依赖
RUN apk add --no-cache \
    mysql \
    mysql-client \
    bash \
    curl \
    git \
    wget

# 设置 npm 源
RUN npm config set registry ${NPM_REGISTRY}

# 安装 pnpm
RUN npm install -g pnpm

# 设置 pnpm 源
RUN pnpm config set registry ${NPM_REGISTRY}

# 设置工作目录
WORKDIR ${PROJECT_DIR}

# 克隆代码仓库
RUN git clone ${GIT_REPO} .

# 输出当前目录路径
RUN echo "当前目录: $(pwd)"

# 复制环境变量文件
RUN cp env.example .env

# 设置环境变量
ENV NODE_ENV=production
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

# 设置数据库默认环境变量（支持外部传入）
ENV DB_HOST=${DB_HOST:-localhost}
ENV DB_PORT=${DB_PORT:-3306}
ENV DB_USERNAME=${DB_USERNAME:-root}
ENV DB_PASSWORD=${DB_PASSWORD:-123456}
ENV DB_DATABASE=${DB_DATABASE:-mock_tools}

# 设置 MySQL 环境变量（支持外部传入）
ENV MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD:-123456}
ENV MYSQL_DATABASE=${MYSQL_DATABASE:-mock_tools}
ENV MYSQL_USER=${MYSQL_USER:-mock_tools_user}
ENV MYSQL_PASSWORD=${MYSQL_PASSWORD:-mock_tools_password}

# 安装依赖
RUN pnpm install

# 构建应用
RUN pnpm run build

# 创建 MySQL 配置目录
RUN mkdir -p /var/lib/mysql /var/run/mysqld /run/mysqld /etc/mysql/conf.d

# 创建 MySQL 配置文件
RUN cat > /etc/mysql/conf.d/mysql.cnf << 'EOF'
[mysqld]
bind-address = 0.0.0.0
port = 3306
socket = /var/run/mysqld/mysqld.sock
datadir = /var/lib/mysql
user = mysql
pid-file = /var/run/mysqld/mysqld.pid
skip-external-locking
key_buffer_size = 16M
max_allowed_packet = 1M
table_open_cache = 64
sort_buffer_size = 512K
net_buffer_length = 8K
read_buffer_size = 256K
read_rnd_buffer_size = 512K
myisam_sort_buffer_size = 8M
EOF

# 创建启动脚本
RUN cat > /start.sh << 'EOF'
#!/bin/bash

# 设置 MySQL 用户和权限
chown -R mysql:mysql /var/lib/mysql /var/run/mysqld /run/mysqld
chmod 755 /var/run/mysqld /run/mysqld

# 初始化 MySQL 数据目录
if [ ! -d "/var/lib/mysql/mysql" ]; then
    echo "初始化 MySQL 数据目录..."
    mysql_install_db --user=mysql --datadir=/var/lib/mysql --auth-root-authentication-method=normal
    chown -R mysql:mysql /var/lib/mysql
fi

# 启动 MySQL 服务
echo "启动 MySQL 服务..."
mysqld_safe --defaults-file=/etc/mysql/conf.d/mysql.cnf &

# 等待 MySQL 启动完成
echo "等待 MySQL 启动..."
sleep 15

# 检查 MySQL 是否启动成功
while ! mysqladmin ping -h"localhost" --port=3306 --silent; do
    echo "等待 MySQL 启动..."
    sleep 2
done

echo "MySQL 启动成功，开始配置..."

# 设置 MySQL root 密码
mysql -u root --socket=/var/run/mysqld/mysqld.sock -e "ALTER USER 'root'@'localhost' IDENTIFIED BY '${MYSQL_ROOT_PASSWORD}';" 2>/dev/null || true

# 创建数据库和用户（如果不存在）
mysql -u root -p${MYSQL_ROOT_PASSWORD} --port=3306 -e "CREATE DATABASE IF NOT EXISTS ${MYSQL_DATABASE};" 2>/dev/null || \
mysql -u root --port=3306 -e "CREATE DATABASE IF NOT EXISTS ${MYSQL_DATABASE};"

mysql -u root -p${MYSQL_ROOT_PASSWORD} --port=3306 -e "CREATE USER IF NOT EXISTS '${MYSQL_USER}'@'%' IDENTIFIED BY '${MYSQL_PASSWORD}';" 2>/dev/null || \
mysql -u root --port=3306 -e "CREATE USER IF NOT EXISTS '${MYSQL_USER}'@'%' IDENTIFIED BY '${MYSQL_PASSWORD}';"

mysql -u root -p${MYSQL_ROOT_PASSWORD} --port=3306 -e "GRANT ALL PRIVILEGES ON ${MYSQL_DATABASE}.* TO '${MYSQL_USER}'@'%';" 2>/dev/null || \
mysql -u root --port=3306 -e "GRANT ALL PRIVILEGES ON ${MYSQL_DATABASE}.* TO '${MYSQL_USER}'@'%';"

mysql -u root -p${MYSQL_ROOT_PASSWORD} --port=3306 -e "FLUSH PRIVILEGES;" 2>/dev/null || \
mysql -u root --port=3306 -e "FLUSH PRIVILEGES;"

echo "MySQL 配置完成，启动应用..."

# 在后台启动应用
cd /app/mock_tools
echo "启动应用在目录: $(pwd)"
node .output/server/index.mjs &

# 保持容器运行
wait
EOF

RUN chmod +x /start.sh

# 暴露端口
EXPOSE 3000 3306

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:3000 || exit 1

# 启动脚本
CMD ["/start.sh"]