<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-6 offset-md-3">
        <h1 class="text-center mb-4">Library Sign In</h1>
        
        <div class="card shadow-lg">
          <div class="card-body p-4">
            <div class="mb-4">
              <label class="form-label">Email Address</label>
              <input 
                type="email" 
                class="form-control form-control-lg"
                v-model="email"
                placeholder="your.email@example.com"
              >
            </div>
            
            <div class="mb-4">
              <label class="form-label">Password</label>
              <input 
                type="password" 
                class="form-control form-control-lg"
                v-model="password"
                placeholder="Enter your password"
              >
            </div>
            
            <div v-if="errorMessage" class="alert alert-danger">
              <i class="bi bi-exclamation-triangle me-2"></i>{{ errorMessage }}
            </div>
            
            <button 
              class="btn btn-primary w-100 btn-lg"
              @click="signin"
              :disabled="isProcessing"
            >
              <span v-if="isProcessing" class="spinner-border spinner-border-sm me-2"></span>
              {{ isProcessing ? 'Signing In...' : 'Sign In' }}
            </button>
            
            <div class="text-center mt-4">
              <p>Don't have an account? 
                <router-link to="/FirebaseRegister" class="text-decoration-none fw-bold">
                  Register Now
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
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useAuthStore } from '@/stores/auth';

const email = ref("");
const password = ref("");
const isProcessing = ref(false);
const errorMessage = ref("");
const router = useRouter();
const authStore = useAuthStore();
const auth = getAuth()

const signin = async () => {
  isProcessing.value = true;
  errorMessage.value = "";
  
  try {
    // 用户认证
    const userCredential = await signInWithEmailAndPassword(
      auth, 
      email.value, 
      password.value
    );
    
    console.log("Firebase Login Successful!");
    router.push("/");
    console.log(auth.currentUser);

    // 从localStorage获取角色
    const role = localStorage.getItem(`userRole_${userCredential.user.uid}`) || 'user';
    
    // 更新应用状态
    authStore.login({
      email: userCredential.user.email,
      role: role,
      uid: userCredential.user.uid
    });
    
  } catch (error) {
    console.error("Sign in error:", error);
    errorMessage.value = getErrorMessage(error.code);
  } finally {
    isProcessing.value = false;
  }
};

const getErrorMessage = (errorCode) => {
  const errorMap = {
    "auth/invalid-email": "Please enter a valid email address",
    "auth/user-disabled": "This account has been disabled",
    "auth/user-not-found": "Account not found",
    "auth/wrong-password": "Incorrect password"
  };
  
  return errorMap[errorCode] || "An error occurred. Please try again.";
};
</script>

<style scoped>
.card {
  border-radius: 15px;
  border: none;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
}
</style>