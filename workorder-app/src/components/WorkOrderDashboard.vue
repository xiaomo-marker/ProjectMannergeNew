<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h1>工单管理系统</h1>
      <div class="user-info">
        <span>欢迎，{{ username }} ({{ role === 'admin' ? '管理员' : '普通用户' }})</span>
        <a-button type="link" @click="handleLogout">退出登录</a-button>
      </div>
    </div>

    <div class="dashboard-content">
      <!-- 工单列表 -->
      <div class="table-section">
        <h2>工单列表</h2>
        <a-table
          :columns="columns"
          :data-source="workOrders"
          :pagination="false"
          row-key="id"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'overtime'">
              <a-tag :color="record.overtime ? 'red' : 'green'">
                {{ record.overtime ? '是' : '否' }}
              </a-tag>
            </template>
            <template v-if="column.key === 'action'">
              <a-button
                v-if="role === 'admin'"
                danger
                size="small"
                @click="handleDelete(record.id)"
              >
                删除
              </a-button>
            </template>
          </template>
        </a-table>
      </div>

      <!-- 图表展示 -->
      <div class="chart-section">
        <h2>Project Hours Distribution</h2>
        <div ref="chartRef" class="chart-container"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
import * as echarts from 'echarts'

defineProps({
  username: String,
  role: String
})

const emit = defineEmits(['logout'])

type WorkOrder = {
  id: string
  project: string
  overtime: boolean
  hours: number
  created_at: string
}

// 初始化数据
const initialData = [
  {
    id: '001',
    project: 'Road Project A',
    overtime: true,
    hours: 3.5,
    created_at: '2024-04-10 10:30'
  },
  {
    id: '002',
    project: 'Bridge Maintenance B',
    overtime: false,
    hours: 2,
    created_at: '2024-04-09 13:00'
  },
  {
    id: '003',
    project: 'Pipeline Fix C',
    overtime: true,
    hours: 4.5,
    created_at: '2024-04-08 08:00'
  },
  {
    id: '004',
    project: 'Bridge Maintenance B',
    overtime: true,
    hours: 3,
    created_at: '2024-04-07 16:45'
  },
  {
    id: '005',
    project: 'Tunnel Cleaning D',
    overtime: false,
    hours: 8.1,
    created_at: '2024-04-03 11:43'
  }
]

const workOrders = ref<WorkOrder[]>([...initialData])
const chartRef = ref<HTMLDivElement | null>(null)
let chartInstance: echarts.ECharts | null = null

// 表格列配置
const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 80
  },
  {
    title: 'Project',
    dataIndex: 'project',
    key: 'project'
  },
  {
    title: 'Overtime',
    key: 'overtime',
    width: 100
  },
  {
    title: 'Hours',
    dataIndex: 'hours',
    key: 'hours',
    width: 100
  },
  {
    title: 'Created At',
    dataIndex: 'created_at',
    key: 'created_at',
    width: 180
  },
  {
    title: 'Action',
    key: 'action',
    width: 100
  }
]

// 计算各项目累计工时
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

// 更新图表
const updateChart = () => {
  if (!chartInstance) return
  
  const { projects, hours } = calculateProjectHours()
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: projects,
      axisLabel: {
        rotate: projects.length > 4 ? 15 : 0,
        interval: 0
      }
    },
    yAxis: {
      type: 'value',
      name: 'Hours'
    },
    series: [
      {
        name: 'Hours',
        type: 'bar',
        data: hours,
        itemStyle: {
          borderRadius: [5, 5, 0, 0],
          color: '#1890ff'
        },
        label: {
          show: true,
          position: 'top',
          formatter: '{c} h'
        }
      }
    ]
  }
  
  chartInstance.setOption(option, true)
}

// 删除工单
const handleDelete = (id: string) => {
  const orderToDelete = workOrders.value.find(order => order.id === id)
  if (orderToDelete) {
    workOrders.value = workOrders.value.filter(order => order.id !== id)
    updateChart()
  }
}

// 退出登录
const handleLogout = () => {
  emit('logout')
}

// 监听数据变化
watch(workOrders, () => {
  nextTick(() => {
    updateChart()
  })
}, { deep: true })

// 初始化图表
onMounted(() => {
  nextTick(() => {
    if (chartRef.value) {
      chartInstance = echarts.init(chartRef.value)
      updateChart()
      
      // 监听窗口大小变化
      window.addEventListener('resize', () => {
        if (chartInstance) {
          chartInstance.resize()
        }
      })
    }
  })
})
</script>

<style scoped lang="less">
.dashboard {
  min-height: 100vh;
  background: #f0f2f5;

  .dashboard-header {
    background: white;
    padding: 0 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 64px;

    h1 {
      margin: 0;
      font-size: 20px;
      color: #1890ff;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 16px;
    }
  }

  .dashboard-content {
    padding: 24px;

    .table-section {
      background: white;
      padding: 24px;
      border-radius: 8px;
      margin-bottom: 24px;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

      h2 {
        margin-top: 0;
        margin-bottom: 16px;
        font-size: 18px;
      }
    }

    .chart-section {
      background: white;
      padding: 24px;
      border-radius: 8px;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

      h2 {
        margin-top: 0;
        margin-bottom: 16px;
        font-size: 18px;
      }

      .chart-container {
        width: 100%;
        height: 400px;
      }
    }
  }
}
</style>
