import { createRouter, createWebHashHistory } from 'vue-router';
import Dashboard from '../views/admin/Dashboard.vue'; // Trang Dashboard
import UserManagement from '../views/admin/UserManagement.vue'; // Trang Quản lý Người dùng
import Reports from '../views/admin/Reports.vue'; // Trang Báo cáo
import Settings from '../views/admin/Settings.vue'; // Trang Cài đặt
import LoginPage from '../views/admin/Login.vue'; // Trang đăng nhập
import Profile from '../views/admin/Profile.vue'; // Trang thông tin cá nhân
import AdminLayout from '../layouts/AdminLayout.vue'; // Layout tổng quát cho Admin

// Hàm kiểm tra người dùng đã đăng nhập hay chưa
function requireAuth(to, from, next) {
  const token = localStorage.getItem('token');
  if (!token) {
    next('/login'); // Chuyển hướng về trang đăng nhập nếu không có token
  } else {
    next(); // Cho phép truy cập nếu có token
  }
}

const routes = [
  {
    path: '/admin',
    name: 'AdminLayout',
    component: AdminLayout, // Sử dụng layout chung cho các trang admin
    beforeEnter: requireAuth, // Bảo vệ trang admin bằng cách yêu cầu đăng nhập
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: Dashboard,
      },
      {
        path: 'users',
        name: 'UserManagement',
        component: UserManagement,
      },
      {
        path: 'reports',
        name: 'Reports',
        component: Reports,
      },
      {
        path: 'settings',
        name: 'Settings',
        component: Settings,
      },
      {
        path: 'profile',
        name: 'Profile',
        component: Profile, // Trang thông tin cá nhân
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage, // Trang đăng nhập
  },
  {
    path: '/',
    redirect: '/admin/dashboard', // Điều hướng mặc định đến trang Dashboard
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// Bảo vệ các trang yêu cầu xác thực
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  if (to.meta.requiresAuth && !token) {
    next('/login'); // Chuyển hướng nếu không có token
  } else {
    // Nếu có token, giải mã JWT để lấy thông tin người dùng và lưu vào localStorage
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1])); // Giải mã JWT
      localStorage.setItem('user', JSON.stringify({
        username: decodedToken.username,
        role: decodedToken.role,
      }));
    }
    next(); // Cho phép truy cập
  }
});

export default router;
