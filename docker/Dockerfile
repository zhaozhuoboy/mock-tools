# 简化版 Dockerfile for Mock Tools
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

# 安装系统依赖
RUN apk add --no-cache git

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

# 显示当前目录（调试用）
RUN echo "当前目录: $(pwd)"

# 复制环境变量文件
RUN cp env.example .env

# 设置环境变量
ENV NODE_ENV=production
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

# 设置数据库默认环境变量
ENV DB_HOST=localhost
ENV DB_PORT=3306
ENV DB_USERNAME=root
ENV DB_PASSWORD=123456
ENV DB_DATABASE=mock_tools

# 安装依赖
RUN pnpm install

# 构建应用
RUN pnpm run build

# 暴露端口
EXPOSE 3000

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node --version || exit 1

# 启动应用
CMD ["node", ".output/server/index.mjs"]
