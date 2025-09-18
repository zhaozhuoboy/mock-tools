# Mock Tools

## Nuxt 3 Naive UI Tailwind CSS

### 页面

![首页](./image/mock-已登录首页.png '已登录首页')

![项目列表](./image/mock-项目列表.png)
![项目列表](./image/mock-项目详情api列表.png)
![默认数据](./image/mock-默认数据.png)
![新建数据](./image/mock-新建数据.png)
![切换数据](./image/mock-切换数据.png)
![代理请求](./image/mock-代理成功数据.png)
![代理请求](./image/mock-切换空数据.png)

## 安装依赖

```bash
# pnpm
pnpm install
```

## 开发

Start the development server on `http://localhost:6780`:

```bash
# pnpm
pnpm run dev

```

## Production

Build the application for production:
复制 .env.example => .env.prod 然后添加环境变量

```bash
# pnpm
pnpm run build
```

## Docker 部署

[Link](./DEPLOYMENT.md)

## 功能列表

- [x] 登录/注册
- [ ] 个人信息更新
- [x] 项目创建/修改/删除
- [x] api 创建/修改/删除/分页
- [x] api 多数据切换
- [ ] api 数据修改
