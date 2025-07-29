import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false);
  const currentUser = ref(null);
  const userRole = ref('user');
  const userId = ref(null);
  
  // 登录功能
  const login = (userData) => {
    isAuthenticated.value = true;
    currentUser.value = userData.email;
    userRole.value = userData.role;
    userId.value = userData.uid;
    
    // 存储到sessionStorage（仅会话期间有效）
    sessionStorage.setItem('auth', JSON.stringify({
      isAuthenticated: true,
      email: userData.email,
      role: userData.role,
      uid: userData.uid
    }));
  };
  
  // 注销功能
  const logout = async () => {
    isAuthenticated.value = false;
    currentUser.value = null;
    userRole.value = 'user';
    userId.value = null;
    sessionStorage.removeItem('auth');
    const auth = getAuth();
    await signOut(auth);
  };
  
  // 初始化认证状态
  const initAuth = () => {
    const auth = getAuth();
    
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // 用户已登录
        const role = localStorage.getItem(`userRole_${user.uid}`) || 'user';
        
        isAuthenticated.value = true;
        currentUser.value = user.email;
        userRole.value = role;
        userId.value = user.uid;
        
        // 存储到 sessionStorage
        sessionStorage.setItem('auth', JSON.stringify({
          isAuthenticated: true,
          email: user.email,
          role: role,
          uid: user.uid
        }));
      } else {
        // 用户已登出
        isAuthenticated.value = false;
        currentUser.value = null;
        userRole.value = 'user';
        userId.value = null;
        sessionStorage.removeItem('auth');
      }
    });
  };
  
  // 检查用户是否是管理员
  const isAdmin = () => {
    return userRole.value === 'admin';
  };
  
  return {
    isAuthenticated,
    currentUser,
    userRole,
    userId,
    login,
    logout,
    initAuth,
    isAdmin
  };
});