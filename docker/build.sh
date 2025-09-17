#!/bin/bash

# Mock Tools Docker 构建和部署脚本

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印带颜色的消息
print_message() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE} $1${NC}"
    echo -e "${BLUE}================================${NC}"
}

# 检查 Docker 是否安装
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker 未安装，请先安装 Docker"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose 未安装，请先安装 Docker Compose"
        exit 1
    fi
    
    print_message "Docker 环境检查通过"
}

# 构建镜像
build_image() {
    print_header "构建 Docker 镜像"
    
    local tag=${1:-latest}
    local dockerfile=${2:-docker/Dockerfile}
    local build_context=${3:-.}
    
    print_message "开始构建镜像，标签: $tag"
    print_message "使用 Dockerfile: $dockerfile"
    print_message "构建上下文: $build_context"
    
    docker build -f $dockerfile -t zhaozhuodev/mock_tools:$tag $build_context
    
    if [ $? -eq 0 ]; then
        print_message "镜像构建成功: zhaozhuodev/mock_tools:$tag"
    else
        print_error "镜像构建失败"
        exit 1
    fi
}

# 构建镜像
build_image() {
    print_header "构建 Docker 镜像"
    
    local tag=${1:-latest}
    
    print_message "从 Git 仓库构建镜像，标签: $tag"
    docker build -f docker/Dockerfile -t zhaozhuodev/mock_tools:$tag .
    
    if [ $? -eq 0 ]; then
        print_message "镜像构建成功: zhaozhuodev/mock_tools:$tag"
    else
        print_error "镜像构建失败"
        exit 1
    fi
}

# 启动开发环境
start_dev() {
    print_header "启动开发环境"
    
    print_message "启动服务..."
    docker-compose up -d
    
    print_message "等待服务启动..."
    sleep 10
    
    # 检查服务状态
    if docker-compose ps | grep -q "Up"; then
        print_message "服务启动成功！"
        print_message "应用地址: http://localhost:3000"
        print_message "数据库端口: 3306"
    else
        print_error "服务启动失败，请检查日志"
        docker-compose logs
        exit 1
    fi
}

# 启动生产环境
start_prod() {
    print_header "启动生产环境"
    
    # 检查环境变量文件
    if [ ! -f ".env.prod" ]; then
        print_warning ".env.prod 文件不存在，将使用默认配置"
        cp env.example .env.prod
    fi
    
    print_message "启动生产服务..."
    docker-compose -f docker-compose.prod.yml up -d
    
    print_message "等待服务启动..."
    sleep 15
    
    # 检查服务状态
    if docker-compose -f docker-compose.prod.yml ps | grep -q "Up"; then
        print_message "生产服务启动成功！"
        print_message "应用地址: http://localhost:3000"
    else
        print_error "生产服务启动失败，请检查日志"
        docker-compose -f docker-compose.prod.yml logs
        exit 1
    fi
}

# 停止服务
stop_services() {
    print_header "停止服务"
    
    print_message "停止开发环境..."
    docker-compose down
    
    print_message "停止生产环境..."
    docker-compose -f docker-compose.prod.yml down
    
    print_message "所有服务已停止"
}

# 清理资源
cleanup() {
    print_header "清理 Docker 资源"
    
    print_message "停止所有相关容器..."
    docker-compose down -v
    docker-compose -f docker-compose.prod.yml down -v
    
    print_message "删除镜像..."
    docker rmi zhaozhuodev/mock_tools:latest 2>/dev/null || true
    docker rmi zhaozhuodev/mock_tools:prod 2>/dev/null || true
    
    print_message "清理未使用的资源..."
    docker system prune -f
    
    print_message "清理完成"
}

# 查看日志
view_logs() {
    local service=${1:-app}
    
    print_header "查看 $service 服务日志"
    docker-compose logs -f $service
}

# 进入容器
enter_container() {
    local service=${1:-app}
    
    print_header "进入 $service 容器"
    docker-compose exec $service sh
}

# 推送镜像
push_image() {
    local registry=${1:-}
    local tag=${2:-latest}
    
    if [ -z "$registry" ]; then
        print_error "请提供镜像仓库地址"
        echo "用法: $0 push <registry> [tag]"
        echo "示例: $0 push your-registry.com/mock_tools v1.0.0"
        exit 1
    fi
    
    print_header "推送镜像到仓库"
    
    local image_name="$registry/mock_tools:$tag"
    
    print_message "标记镜像: $image_name"
    docker tag zhaozhuodev/mock_tools:$tag $image_name
    
    print_message "推送镜像..."
    docker push $image_name
    
    if [ $? -eq 0 ]; then
        print_message "镜像推送成功: $image_name"
    else
        print_error "镜像推送失败"
        exit 1
    fi
}

# 显示帮助信息
show_help() {
    echo "Mock Tools Docker 构建和部署脚本"
    echo ""
    echo "用法: $0 [命令] [参数]"
    echo ""
    echo "命令:"
    echo "  build [tag]                 构建 Docker 镜像（从Git仓库）"
    echo "  dev                         启动开发环境"
    echo "  prod                        启动生产环境"
    echo "  stop                        停止所有服务"
    echo "  restart                     重启服务"
    echo "  logs [service]              查看服务日志"
    echo "  exec [service]              进入容器"
    echo "  cleanup                     清理 Docker 资源"
    echo "  push <registry> [tag]       推送镜像到仓库"
    echo "  help                        显示帮助信息"
    echo ""
    echo "示例:"
    echo "  $0 build                    构建镜像"
    echo "  $0 build v1.0.0             构建带标签的镜像"
    echo "  $0 dev                      启动开发环境"
    echo "  $0 prod                     启动生产环境"
    echo "  $0 logs app                 查看应用日志"
    echo "  $0 push your-registry.com  推送镜像"
    echo ""
    echo "镜像名称: zhaozhuodev/mock_tools"
}

# 主函数
main() {
    case "${1:-help}" in
        "build")
            check_docker
            build_image "$2"
            ;;
        "dev")
            check_docker
            build_image
            start_dev
            ;;
        "prod")
            check_docker
            build_image prod
            start_prod
            ;;
        "stop")
            stop_services
            ;;
        "restart")
            stop_services
            sleep 2
            start_dev
            ;;
        "logs")
            view_logs "$2"
            ;;
        "exec")
            enter_container "$2"
            ;;
        "cleanup")
            cleanup
            ;;
        "push")
            push_image "$2" "$3"
            ;;
        "help"|*)
            show_help
            ;;
    esac
}

# 执行主函数
main "$@"
