<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-6 offset-md-3">
        <h2 class="text-center">Library Login</h2>
        <form @submit.prevent="login">
          <div class="mb-3">
            <label for="loginUsername" class="form-label">Username</label>
            <input 
              type="text" 
              class="form-control" 
              id="loginUsername"
              v-model="loginCredentials.username"
              required
            >
          </div>
          <div class="mb-3">
            <label for="loginPassword" class="form-label">Password</label>
            <input 
              type="password" 
              class="form-control" 
              id="loginPassword"
              v-model="loginCredentials.password"
              required
            >
          </div>
          <button type="submit" class="btn btn-primary w-100">Login</button>
          <div v-if="loginError" class="alert alert-danger mt-3">
            {{ loginError }}
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const loginCredentials = ref({
  username: '',
  password: ''
});

const loginError = ref('');

const login = () => {
  // 硬编码的凭证（实际应用中应从API获取）
  const validCredentials = [
    { username: 'admin', password: 'admin123' },
    { username: 'user', password: 'password' }
  ];

  const isValid = validCredentials.some(
    cred => 
      cred.username === loginCredentials.value.username &&
      cred.password === loginCredentials.value.password
  );

  if (isValid) {
    authStore.login(loginCredentials.value.username);
    router.replace({ name: 'about' }); // 登录成功后跳转到About页面
  } else {
    loginError.value = 'Invalid username or password';
  }
};
</script>

<style scoped>
.container {
  max-width: 500px;
}
</style>