<template>
  <div id="app">
    <Login v-if="!isLoggedIn" @login-success="handleLogin" />
    <WorkOrderDashboard 
      v-else 
      :username="username" 
      :role="role"
      @logout="handleLogout"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Login from './components/Login.vue'
import WorkOrderDashboard from './components/WorkOrderDashboard.vue'

const isLoggedIn = ref(false)
const username = ref('')
const role = ref('user')

const handleLogin = (name: string, userRole: string) => {
  username.value = name
  role.value = userRole
  isLoggedIn.value = true
}

const handleLogout = () => {
  isLoggedIn.value = false
  username.value = ''
  role.value = 'user'
}
</script>

<style>
#app {
  min-height: 100vh;
  background: #f0f2f5;
}
</style>
