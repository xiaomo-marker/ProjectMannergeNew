# 工单管理系统 - 项目说明文档

## 📌 项目概述

本项目是一个工单管理与图表展示系统，实现了用户登录权限控制、工单列表的增删查改、以及与 ECharts 图表的数据联动功能。

**在线预览地址**：[https://lucent-pony-de622c.netlify.app]

**GitHub 仓库**：[https://github.com/xiaomo-marker/ProjectMannergeNew]

---

## 🤖 AI 工具使用情况

### 使用的 AI 工具

| 工具名称 | 用途 | 使用频率 |
|---------|------|---------|
| **ChatGPT-4** | 代码生成、问题调试、架构设计 | 高频 |
| **Cursor IDE** | 代码补全、重构建议 | 中频 |
| **GitHub Copilot** | 辅助编写重复性代码 | 低频 |

### 各模块 AI 使用详情

#### 1. 项目初始化模块
- **AI 生成内容**：Vue 3 项目结构搭建、依赖包选择建议
- **人工调整**：根据需求文档调整技术栈组合

#### 2. 登录页模块
- **AI 生成内容**：
  - 登录表单组件代码
  - 权限判断逻辑（admin 识别）
  - 页面样式（渐变背景、卡片布局）
- **人工修改**：
  - 添加登录提示信息
  - 优化表单验证规则
  - 调整消息提示的友好性

#### 3. 工单列表模块
- **AI 生成内容**：
  - Ant Design Vue 表格配置
  - 模拟数据的结构定义
  - 删除功能的基础逻辑
- **人工修改**：
  - 表格列的自定义渲染（Overtime 字段用 Tag 展示）
  - 删除后的数据更新逻辑优化
  - 添加删除确认提示

#### 4. 图表展示模块
- **AI 生成内容**：
  - ECharts 初始化代码
  - 柱状图配置选项
  - 数据聚合计算函数（calculateProjectHours）
- **人工修改**：
  - 图表自适应窗口大小
  - 项目名称过长时的旋转显示
  - 添加数据标签显示具体数值
  - 优化图表颜色和样式

#### 5. 权限控制模块
- **AI 生成内容**：
  - 基于角色的条件渲染逻辑
  - 删除按钮的显示控制
- **人工修改**：
  - 增加用户信息展示
  - 添加退出登录功能
  - 优化权限边界情况处理

#### 6. 数据联动模块
- **AI 生成内容**：
  - watch 监听数据变化
  - 图表更新触发机制
- **人工修改**：
  - 使用 nextTick 确保 DOM 更新
  - 优化性能，避免重复渲染

---

## ✏️ 代码修改详情

### AI 生成占比：约 70%
### 人工修改占比：约 30%

### 主要修改内容

#### 1. 样式优化
```less
// AI 生成的基础样式
.chart-container {
  width: 100%;
  height: 400px;
}

// 人工添加的响应式优化
@media (max-width: 768px) {
  .dashboard-content {
    padding: 12px;
  }
  .chart-container {
    height: 300px;
  }
}
2. 错误处理增强
javascript
// AI 生成的简单删除
const handleDelete = (id) => {
  workOrders.value = workOrders.value.filter(order => order.id !== id)
}

// 人工优化后（添加提示和边界处理）
const handleDelete = (id) => {
  const orderToDelete = workOrders.value.find(order => order.id === id)
  if (orderToDelete) {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除项目 "${orderToDelete.project}" 的工单吗？`,
      onOk: () => {
        workOrders.value = workOrders.value.filter(order => order.id !== id)
        message.success('删除成功')
        updateChart()
      }
    })
  }
}
3. 图表联动优化
javascript
// AI 生成的简单更新
watch(workOrders, () => {
  updateChart()
})

// 人工优化后（防抖 + nextTick）
import { debounce } from 'lodash-es'

const debouncedUpdate = debounce(() => {
  nextTick(() => {
    updateChart()
  })
}, 100)

watch(workOrders, () => {
  debouncedUpdate()
}, { deep: true })
4. 权限控制完善
vue
<!-- AI 生成的简单权限 -->
<a-button v-if="role === 'admin'" @click="handleDelete">删除</a-button>

<!-- 人工优化后（添加更多权限判断） -->
<a-button 
  v-if="role === 'admin'" 
  danger 
  size="small"
  :disabled="isDeleting"
  @click="handleDelete(record.id)"
>
  {{ isDeleting ? '删除中...' : '删除' }}
</a-button>
⭐ 最难/最满意的部分
最满意的部分：图表与表格的实时联动
为什么最满意？

数据一致性保障

删除工单后，图表能实时反映最新的项目工时分布

使用响应式数据驱动，避免了手动 DOM 操作

性能优化

实现了防抖处理，避免频繁重绘图表

使用 nextTick 确保 DOM 更新完成后再渲染图表

用户体验

图表更新有平滑的过渡动画

删除操作有确认提示，防止误删

图表支持响应式布局

核心代码片段：

javascript
// 计算各项目累计工时 - 自动聚合相同项目
const calculateProjectHours = () => {
  const projectMap = new Map()
  
  workOrders.value.forEach(order => {
    const currentHours = projectMap.get(order.project) || 0
    projectMap.set(order.project, currentHours + order.hours)
  })
  
  return {
    projects: Array.from(projectMap.keys()),
    hours: Array.from(projectMap.values())
  }
}

// 使用 watch 深度监听，自动触发图表更新
watch(workOrders, () => {
  debouncedUpdate() // 防抖更新
}, { deep: true })
最具挑战的部分：权限控制的边界处理
挑战点：

管理员和普通用户的界面差异控制

删除按钮的显示与隐藏

防止普通用户通过开发者工具绕过前端限制

解决方案：

前端做角色判断，虽然不能完全防止绕过，但满足需求文档要求

添加了用户体验优化，不同角色看到不同的 UI 提示


完成时间：2026-04-08
开发者：[郭钰洁]
项目时长：约 2 小时
