import { createRouter, createWebHashHistory } from 'vue-router';
import Dashboard from '../views/admin/Dashboard.vue';
import UserManagement from '../views/admin/UserManagement.vue';
import Reports from '../views/admin/Reports.vue';
import Settings from '../views/admin/Settings.vue';
import LoginPage from '../views/admin/Login.vue';
import Profile from '../views/admin/profile.vue';
import AddCustomer from '../views/admin/AddCustomer.vue';
import EditCustomer from '../views/admin/EditCustomer.vue';
import CustomerDetails from '../views/admin/CustomerDetails.vue';
import AdminLayout from '../layouts/AdminLayout.vue';

function isTokenExpired(token) {
  try {
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return decodedToken.exp < currentTime;
  } catch (error) {
    return true;
  }
}

function requireAuth(to, from, next) {
  const token = localStorage.getItem('token');
  if (!token || isTokenExpired(token)) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    next('/login');
  } else {
    next();
  }
}

const routes = [
  {
    path: '/',
    redirect: '/admin/dashboard',
  },
  {
    path: '/admin',
    beforeEnter: (to, from, next) => {
      const token = localStorage.getItem('token');
      if (token && !isTokenExpired(token)) {
        next('/admin/dashboard');
      } else {
        next('/login');
      }
    },
  },
  {
    path: '/admin',
    component: AdminLayout,
    beforeEnter: requireAuth,
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: Dashboard,
        meta: { requiresAuth: true, title: 'Dashboard' },
      },
      {
        path: 'users',
        name: 'UserManagement',
        component: UserManagement,
        meta: { requiresAuth: true, title: 'User Management' },
      },
      {
        path: 'users/add',
        name: 'AddCustomer',
        component: AddCustomer,
        meta: { requiresAuth: true, title: 'Thêm Người Dùng' },
      },
      {
        path: 'users/:userId/edit',
        name: 'EditCustomer',
        component: EditCustomer,
        meta: { requiresAuth: true, title: 'Chỉnh Sửa Người Dùng' },
      },
      {
        path: 'users/:userId',
        name: 'CustomerDetails',
        component: CustomerDetails,
        meta: { requiresAuth: true, title: 'Chi Tiết Người Dùng' },
      },
      {
        path: 'reports',
        name: 'Reports',
        component: Reports,
        meta: { requiresAuth: true, title: 'Reports' },
      },
      {
        path: 'settings',
        name: 'Settings',
        component: Settings,
        meta: { requiresAuth: true, title: 'Settings' },
      },
      {
        path: 'profile',
        name: 'Profile',
        component: Profile,
        meta: { requiresAuth: true, title: 'Profile' },
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    meta: { title: 'LOGIN PAGE' },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  document.title = to.meta?.title ?? 'NO TITLE';

  if (to.meta.requiresAuth) {
    if (!token || isTokenExpired(token)) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      next('/login');
    } else {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      localStorage.setItem('user', JSON.stringify({
        username: decodedToken.username,
        role: decodedToken.role,
      }));
      next();
    }
  } else {
    next();
  }
});

export default router;
