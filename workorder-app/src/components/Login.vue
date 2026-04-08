<template>
  <div class="login-container">
    <div class="login-card">
      <h1>工单管理系统</h1>
      <a-form
        :model="formState"
        name="basic"
        autocomplete="off"
        @finish="onFinish"
      >
        <a-form-item
          label="用户名"
          name="username"
          :rules="[{ required: true, message: '请输入用户名!' }]"
        >
          <a-input v-model:value="formState.username" placeholder="请输入用户名" />
        </a-form-item>

        <a-form-item
          label="密码"
          name="password"
          :rules="[{ required: true, message: '请输入密码!' }]"
        >
          <a-input-password v-model:value="formState.password" placeholder="任意密码" />
        </a-form-item>

        <a-form-item>
          <a-button type="primary" html-type="submit" block>
            登录
          </a-button>
        </a-form-item>
      </a-form>
      <div class="login-tip">
        <p>提示: 用户名 "admin" 可获得管理员权限</p>
        <p>其他任意用户名均为普通用户</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { message } from 'ant-design-vue'

defineOptions({
  name: 'LoginPage'
})

const formState = reactive({
  username: '',
  password: ''
})

const emit = defineEmits(['login-success'])

const onFinish = () => {
  if (!formState.username) {
    message.error('请输入用户名')
    return
  }
  
  const userRole = formState.username === 'admin' ? 'admin' : 'user'
  message.success(`欢迎回来，${formState.username}！权限: ${userRole === 'admin' ? '管理员' : '普通用户'}`)
  emit('login-success', formState.username, userRole)
}
</script>

<style scoped lang="less">
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-card {
  width: 400px;
  padding: 40px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);

  h1 {
    text-align: center;
    margin-bottom: 30px;
    color: #333;
  }

  .login-tip {
    margin-top: 20px;
    padding: 10px;
    background: #f0f2f5;
    border-radius: 5px;
    font-size: 12px;
    color: #666;

    p {
      margin: 5px 0;
    }
  }
}
</style>
