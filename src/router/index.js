import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import HomeView from '@/views/HomeView.vue';
import FirebaseRegisterView from '@/views/FirebaseRegisterView.vue';
import FirebaseSigninView from '@/views/FirebaseSigninView.vue';
import AboutView from '@/views/AboutView.vue';
import AccessDeniedView from '@/views/AccessDeniedView.vue';
import AddBookView from '@/views/AddBookView.vue';
import WeatherView from '@/views/WeatherView.vue'
import CountBookAPI from '@/views/CountBookAPI.vue';
import GetAllBookAPI from '@/views/GetAllBookAPI.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { title: 'Home' }
  },
  {
    path: '/FirebaseSignin',
    name: 'FirebaseSignin',
    component: FirebaseSigninView,
    meta: { title: 'Sign In', public: true }
  },
  {
    path: '/FirebaseRegister',
    name: 'FirebaseRegister',
    component: FirebaseRegisterView,
    meta: { title: 'Register', public: true }
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView,
    meta: { title: 'About', requiresAuth: true }
  },
  {
    path: '/access-denied',
    name: 'access-denied',
    component: AccessDeniedView,
    meta: { title: 'Access Denied' }
  },
  {
    path: '/addbook',
    name: 'AddBook',
    component: AddBookView
  },
  {
    path: '/WeatherCheck',
    name: 'WeatherCheck',
    component: WeatherView
  },
  {
    path: '/CountBookAPI',
    name: 'CountBookAPI',
    component: CountBookAPI
  },
  {
    path: '/GetAllBookAPI',
    name: 'GetAllBookAPI',
    component: GetAllBookAPI
  }

];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 全局路由守卫
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  authStore.initAuth();
  
  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} | Library App` : 'Library App';
  
  // 公共页面直接放行
  if (to.meta.public) return next();
  
  // 需要认证的页面
  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      // 未登录用户重定向到登录页
      return next({ name: 'FirebaseSignin' });
    }
    
    // 需要管理员权限的页面
    if (to.meta.requiresAdmin && !authStore.isAdmin()) {
      return next({ name: 'access-denied' });
    }
  }
  
  next();
});

export default router;