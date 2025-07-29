<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary sticky-top shadow-sm">
    <div class="container">
      <router-link to="/" class="navbar-brand d-flex align-items-center">
        <i class="bi bi-book me-2"></i>
        <span class="fw-bold">LibraryApp</span>
      </router-link>
      
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <router-link to="/" class="nav-link" active-class="active">
              <i class="bi bi-house-door me-1"></i>Home
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/about" class="nav-link" active-class="active">
              <i class="bi bi-info-circle me-1"></i>About
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/addbook" class="nav-link" active-class="active">Add Book</router-link>
          </li>
          <li calss="nav-item">
            <router-link to="/WeatherCheck" class="nav-link" active-class="active">Get Weather</router-link>
          </li>
          <li calss="nav-item">
            <router-link to="/CountBookAPI" class="nav-link" active-class="active">Count Book API</router-link>
          </li>
          <li calss="nav-item">
            <router-link to="/GetAllBookAPI" class="nav-link" active-class="active">Get All Book API</router-link>
          </li>
        </ul>
        
        <ul class="navbar-nav ms-auto">
          <div v-if="authStore.isAuthenticated" class="d-flex align-items-center">
            <div class="d-flex align-items-center me-3">
              <span v-if="authStore.isAdmin()" class="badge bg-warning me-2">
                ADMIN
              </span>
              <span class="navbar-text text-light me-2">
                <i class="bi bi-person-circle me-1"></i>{{ authStore.currentUser }}
              </span>
            </div>
            <button class="btn btn-outline-light btn-sm" @click="logout">
              <i class="bi bi-box-arrow-right me-1"></i>Logout
            </button>
          </div>
          
          <li v-else class="nav-item d-flex gap-2">
            <router-link to="/FirebaseSignin" class="btn btn-outline-light">
              <i class="bi bi-box-arrow-in-right me-1"></i>Sign In
            </router-link>
            <router-link to="/FirebaseRegister" class="btn btn-light">
              <i class="bi bi-person-plus me-1"></i>Register
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { getAuth, signOut } from "firebase/auth";

const authStore = useAuthStore();
const router = useRouter();

const logout = () => {
  authStore.logout();
  router.push({ name: 'home' });
  console.log("Firebase Logout Successful!");
  const auth = getAuth()
  signOut(auth)
  console.log(auth.currentUser)
};
</script>

<style scoped>
.navbar {
  padding: 0.8rem 0;
}

.avatar {
  width: 32px;
  height: 32px;
}

.nav-link {
  font-weight: 500;
  transition: all 0.2s;
}

.nav-link:hover, .nav-link.active {
  transform: translateY(-2px);
}

.dropdown-menu {
  border-radius: 10px;
  border: 1px solid rgba(0,0,0,0.1);
  box-shadow: 0 0.5rem 1rem rgba(0,0,0,0.1);
}

.dropdown-item {
  padding: 0.5rem 1.25rem;
  transition: all 0.2s;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
  transform: translateX(5px);
}
</style>