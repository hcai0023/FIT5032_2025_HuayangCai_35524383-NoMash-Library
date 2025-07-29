<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-6 offset-md-3">
        <h1 class="text-center mb-4">Library Registration</h1>
        
        <div class="card shadow-lg">
          <div class="card-body p-4">
            <div class="mb-3">
              <label class="form-label">Email Address</label>
              <input 
                type="email" 
                class="form-control form-control-lg"
                v-model="email"
                placeholder="your.email@example.com"
              >
            </div>
            
            <div class="mb-3">
              <label class="form-label">Password</label>
              <input 
                type="password" 
                class="form-control form-control-lg"
                v-model="password"
                placeholder="At least 6 characters"
              >
            </div>
            
            <div class="mb-4">
              <label class="form-label">Account Type</label>
              <div class="d-flex gap-3">
                <button 
                  class="btn btn-outline-primary flex-grow-1"
                  :class="{ 'active': role === 'user' }"
                  @click="role = 'user'"
                >
                  <i class="bi bi-person me-2"></i>Standard User
                </button>
                <button 
                  class="btn btn-outline-warning flex-grow-1"
                  :class="{ 'active': role === 'admin' }"
                  @click="role = 'admin'"
                >
                  <i class="bi bi-shield-lock me-2"></i>Administrator
                </button>
              </div>
            </div>
            
            <div class="mb-3" v-if="role === 'admin'">
              <label class="form-label">Admin Key</label>
              <input 
                type="password" 
                class="form-control"
                v-model="adminKey"
                placeholder="Enter admin key"
              >
            </div>
            
            <div v-if="errorMessage" class="alert alert-danger">
              <i class="bi bi-exclamation-triangle me-2"></i>{{ errorMessage }}
            </div>
            
            <button 
              class="btn btn-primary w-100 btn-lg mt-3"
              @click="register"
              :disabled="isProcessing"
            >
              <span v-if="isProcessing" class="spinner-border spinner-border-sm me-2"></span>
              {{ isProcessing ? 'Creating Account...' : 'Create Account' }}
            </button>
            
            <div class="text-center mt-4">
              <p>Already have an account? 
                <router-link to="/FirebaseSignin" class="text-decoration-none fw-bold">
                  Sign In
                </router-link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useAuthStore } from '@/stores/auth';

const email = ref("");
const password = ref("");
const role = ref("user");
const adminKey = ref("");
const isProcessing = ref(false);
const errorMessage = ref("");
const router = useRouter();
const authStore = useAuthStore();
const auth = getAuth()

const register = async () => {
  isProcessing.value = true;
  errorMessage.value = "";
  
  try {
    // 验证管理员密钥
    if (role.value === "admin" && adminKey.value !== "admin123") {
      throw new Error("Invalid admin key");
    }
    
    // 创建用户
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      email.value, 
      password.value
    );
    
    console.log("Firebase Register Successful!");
    router.push("/");
    console.log(auth.currentUser);

    // 在localStorage中存储用户角色
    localStorage.setItem(`userRole_${userCredential.user.uid}`, role.value);
    
    // 更新应用状态
    authStore.login({
      email: email.value,
      role: role.value,
      uid: userCredential.user.uid
    });
    
  } catch (error) {
    console.error("Registration error:", error);
    errorMessage.value = getErrorMessage(error.code || error.message);
  } finally {
    isProcessing.value = false;
  }
};

const getErrorMessage = (errorCode) => {
  const errorMap = {
    "auth/email-already-in-use": "This email is already registered",
    "auth/invalid-email": "Please enter a valid email address",
    "auth/weak-password": "Password must be at least 6 characters",
    "Invalid admin key": "Invalid administrator key"
  };
  
  return errorMap[errorCode] || "An error occurred. Please try again.";
};
</script>

<style scoped>
.card {
  border-radius: 15px;
  border: none;
}

.btn.active {
  background-color: #0d6efd;
  color: white;
  border-color: #0d6efd;
}

.btn-outline-primary.active {
  background-color: #0d6efd;
  color: white;
}

.btn-outline-warning.active {
  background-color: #ffc107;
  color: black;
}
</style>