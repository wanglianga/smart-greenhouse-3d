# 智慧温室植物层架三维视图系统

基于 React + Three.js 构建的智慧温室 3D 可视化监控系统，帮助种植员直观监控多层栽培架上的作物生长状态。

## 原始需求

> 智慧温室植物层架三维视图使用 Three.js 呈现，场景展示多层栽培架、补光灯、滴灌管、传感器、苗盘、风机、轨道车、作物批次和采收通道。种植员要看清每层苗盘的品种、龄期、湿度、光照、营养液、病害风险和预计采收日；用户可按作物、异常、层架、批次或生长阶段过滤，点选苗盘查看照片与历史曲线。首屏要快速出现温室结构，植物数量多时采用层级加载或实例化，标签密集处需要聚合，避免整片绿色模型把告警淹没。

## 项目简介

本项目实现了一个沉浸式的智慧温室三维监控界面，核心特性包括：

- 🏗️ **完整温室场景**：多层栽培架、补光灯、滴灌管、传感器、风机、轨道车、采收通道
- 📊 **苗盘数据可视化**：品种、龄期、湿度、光照、营养液、病害风险、预计采收日
- 🔍 **多维过滤器**：按作物、异常状态、层架、批次、生长阶段筛选
- 📈 **历史数据曲线**：点选苗盘查看 ECharts 历史数据曲线
- ⚡ **性能优化**：层级加载、实例化渲染、半透明植物避免遮挡告警
- 🚨 **告警优先**：异常苗盘高亮闪烁，告警信息不被绿色模型淹没

## 技术栈

- **前端框架**：React 18 + TypeScript + Vite
- **3D 渲染**：Three.js + @react-three/fiber + @react-three/drei + @react-three/postprocessing
- **状态管理**：Zustand
- **图表库**：ECharts
- **样式方案**：Tailwind CSS 3
- **图标库**：lucide-react

## 启动方式

### 前置要求

- Node.js >= 18
- pnpm >= 8 或 npm >= 9
- Docker / Docker Compose（可选，用于容器化部署）

### 启动步骤

#### 1. 安装依赖

```bash
pnpm install
```

或使用 npm：

```bash
npm install
```

#### 2. 启动开发服务

```bash
pnpm run dev
```

或使用 npm：

```bash
npm run dev
```

访问地址：http://localhost:5173

#### 3. 构建生产版本

```bash
pnpm run build
```

构建产物将输出到 `dist/` 目录。

#### 4. 预览生产构建

```bash
pnpm run preview
```

### Docker 一键启动（推荐）

#### 前置要求

- Docker 20.10+
- Docker Compose v2+

#### 启动命令

构建并启动服务：

```bash
docker compose up --build
```

后台运行：

```bash
docker compose up --build -d
```

访问地址：http://localhost:8080

停止和清理服务：

```bash
docker compose down
```

仅验证 compose 配置：

```bash
docker compose config
```

查看运行日志：

```bash
docker compose logs
```

## 目录结构

```
.
├── src/
│   ├── components/
│   │   ├── scenes/          # Three.js 3D 场景组件
│   │   │   ├── GreenhouseScene.tsx       # 温室场景入口
│   │   │   ├── GreenhouseEnvironment.tsx # 环境（地面、风机、轨道车）
│   │   │   ├── GreenhouseRack.tsx        # 层架（含补光灯、滴灌管、传感器）
│   │   │   ├── TrayInstance.tsx          # 苗盘实例（含植物、标签、告警）
│   │   │   └── TrayLabel.tsx             # 苗盘详细标签
│   │   └── ui/              # UI 组件
│   │       ├── FilterPanel.tsx           # 过滤器面板
│   │       ├── TrayDetailModal.tsx       # 苗盘详情弹窗
│   │       └── StatusBar.tsx             # 底部状态栏
│   ├── data/
│   │   └── mockData.ts       # Mock 数据生成
│   ├── hooks/                 # 自定义 Hooks
│   ├── pages/
│   │   └── Home.tsx           # 主页面
│   ├── store/
│   │   └── index.ts           # Zustand 状态管理
│   ├── types/
│   │   └── index.ts           # TypeScript 类型定义
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── Dockerfile
├── docker-compose.yml
├── .dockerignore
├── nginx.conf
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## 功能说明

### 场景交互

- 鼠标左键拖动：旋转视角
- 鼠标右键拖动：平移场景
- 鼠标滚轮：缩放视图
- 点击苗盘：查看苗盘详情（照片、历史曲线）

### 过滤器使用

左侧过滤器面板支持以下筛选维度：

- **作物类型**：生菜、番茄、黄瓜、草莓等
- **异常状态**：病害高风险、湿度过低、光照不足、营养液不足
- **层架**：1-6号层架
- **批次**：各批次编号
- **生长阶段**：育苗期、营养生长期、开花期、成熟期、采收期

筛选后符合条件的苗盘正常显示，不符合条件的苗盘半透明变暗。

### 告警机制

以下情况会触发告警：

- 病害风险为高（红色闪烁光晕）
- 湿度 < 55%（橙色告警）
- 光照 < 10000 lux
- 营养液浓度 < 1.2 ms/cm

告警苗盘会以红色/橙色光晕闪烁显示，并在标签中突出展示。
