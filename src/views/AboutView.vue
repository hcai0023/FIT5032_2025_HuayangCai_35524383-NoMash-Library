<template>
  <div class="about">
    <h1 class="text-center">About Our Library</h1>
    
    <div v-if="authStore.isAuthenticated" class="member-content">
      <div class="alert alert-success">
        Welcome to the members area, {{ authStore.userRole }}!
      </div>
      <p>Welcome to our digital library! We're dedicated to providing a vast collection of books and resources to our community.</p>
      
      <div class="premium-section mt-4">
        <h3>Premium Member Benefits</h3>
        <ul>
          <li>Access to exclusive e-books and audiobooks</li>
          <li>Priority reservations for popular titles</li>
          <li>Extended borrowing periods</li>
          <li>Free access to online courses</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';

// 将认证存储附加到全局属性
const authStore = useAuthStore();
</script>

<style scoped>
.member-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.premium-section {
  background-color: #e8f4f8;
  padding: 15px;
  border-radius: 5px;
  margin-top: 20px;
}

.premium-section h3 {
  color: #0d6efd;
}
</style>