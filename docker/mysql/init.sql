-- Mock Tools 数据库初始化脚本
-- 创建数据库（如果不存在）
CREATE DATABASE IF NOT EXISTS mock_tools CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 使用数据库
USE mock_tools;

-- 设置字符集
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 这里可以添加数据库表的创建语句
-- 由于项目使用 Sequelize ORM，表结构会在应用启动时自动创建

-- 插入一些初始数据（可选）
-- INSERT INTO users (id, username, email, created_at, updated_at) VALUES 
-- (1, 'admin', 'admin@mock.tools', NOW(), NOW());

SET FOREIGN_KEY_CHECKS = 1;
