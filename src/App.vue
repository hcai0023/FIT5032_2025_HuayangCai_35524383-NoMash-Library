<script setup>
import { ref, onMounted } from 'vue';
import BHeader from './components/BHeader.vue'

</script>

<template>
  <header>
    <BHeader />
  </header>

  <main>
    <div class="container mt-4">
      <router-view></router-view>
    </div>
  </main>
</template>

<style scoped>
.navbar {
  margin-bottom: 20px;
}
</style>