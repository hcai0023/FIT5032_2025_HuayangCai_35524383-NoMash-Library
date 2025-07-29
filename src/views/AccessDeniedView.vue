<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-8 offset-md-2 text-center">
        <h1 class="text-danger">Access Denied</h1>
        <p class="lead">You don't have permission to view this page.</p>
        <p>Please login to access this content.</p>
        <router-link :to="{ name: 'login' }" class="btn btn-primary">
          Go to Login Page
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
// 无需特殊逻辑
</script>

<style scoped>
.text-danger {
  color: #dc3545;
}
</style>