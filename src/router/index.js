import { createRouter, createWebHashHistory } from 'vue-router';
import Dashboard from '../views/Dashboard.vue';
import UserManagement from '../views/UserManagement/CustomerManagement.vue';
import DiscountManagement from '../views/DiscountManagement/DiscountManagement.vue';
import Settings from '../views/Settings.vue';
import LoginPage from '../views/Profile-Login/Login.vue';
import Profile from '../views/Profile-Login/profile.vue';
import AddCustomer from '../views/UserManagement/AddCustomer.vue';
import EditCustomer from '../views/UserManagement/EditCustomer.vue';
import CustomerDetails from '../views/UserManagement/CustomerDetails.vue';
import AdminLayout from '../layouts/AdminLayout.vue';
import AdminManagement from '../views/AdminManagement/AdminManagement.vue';
import AdminDetails from '../views/AdminManagement/AdminDetails.vue';
import AdminDetailsEdit from '../views/AdminManagement/EditAdmin.vue';
import AddAdmin from '../views/AdminManagement/AddAdmin.vue'
import ProductList from '../views/ProductManagement/ProductList.vue';
import ProductAdd from '../views/ProductManagement/ProductAdd.vue'
import ProductDetail from '../views/ProductManagement/ProductDetail.vue';
import ProductForm from '../views/ProductManagement/ProductForm.vue';
import CategoryManagement from '../views/CategoriesManagement/CategoryManagement.vue';
import CategoryAdd from '../views/CategoriesManagement/CategoriesAdd.vue'
import CategoryEdit from '../views/CategoriesManagement/CategoriesEdit.vue'
import SubcategoryEdit from '../views/CategoriesManagement/SubcategoriesEdit.vue'
import ShippingCostsManagement from '../views/ShippingCosts/ShippingCostsManagement.vue';
import ShippingCostsAdd from '../views/ShippingCosts/ShippingCostsAdd.vue'
import ShippingCostsEdit from '../views/ShippingCosts/ShippingCostEdit.vue';
import OrderManagement from '../views/OrderManagement/OrderManagement.vue';
import DiscountAdd from '../views/DiscountManagement/DiscountAdd.vue';
import DiscountEdit from '../views/DiscountManagement/DiscountEdit.vue';
import StatusManagement from '../views/StatusManagement/StatusManagement.vue'


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
        path: 'admin',
        name: 'AdminManagement',
        component: AdminManagement,
        meta: { requiresAuth: true, title: 'Admin Management' },
      },
      {
        path: 'admin/details/:adminId',
        name: 'AdminDetails',
        component: AdminDetails,
        meta: { requiresAuth: true, title: 'Chi Tiết Quản Trị Viên' },
      },
      {
        path: 'admin/edit/:adminId',
        name: 'EditAdmin',
        component: AdminDetailsEdit,
        meta: { requiresAuth: true, title: 'Chỉnh Sửa Quản Trị Viên' },
      },
      {
        path: 'admin/AddAdmin',
        name: 'AddAdmin',
        component: AddAdmin,
        meta: { requiresAuth: true, title: 'Add Admin' },
      },
      {
        path: 'products',
        name: 'ProductList',
        component: ProductList,
        meta: { requiresAuth: true, title: 'Danh sách Sản phẩm' },
      },
      {
        path: 'products/edit',
        name: 'ProductForm',
        component: ProductForm,
        meta: { requiresAuth: true, title: 'Sửa Sản phẩm' },
      },
      {
        path: 'products/new',
        name: 'AddProduct',
        component: ProductAdd,
        meta: { requiresAuth: true, title: 'Thêm Sản phẩm' },
      },
      {
        path: 'products/:productId',
        name: 'ProductDetail',
        component: ProductDetail,
        meta: { requiresAuth: true, title: 'Chi tiết Sản phẩm' },
      },

      {
        path: '/products/:productId/edit',
        name: 'ProductForm', // Đảm bảo tên này là 'ProductForm'
        component: ProductForm,
        meta: { requiresAuth: true, title: 'Chỉnh sửa sản phẩm' }
      },
      {
        path: 'categories',
        name: 'CategoryManagement',
        component: CategoryManagement,
        meta: { requiresAuth: true, title: 'Quản lý Danh mục' }
      },
      {
        path: 'categories/add',
        name: 'CategoriesAdd',
        component: CategoryAdd,
        meta: { requiresAuth: true, title: 'Thêm Danh mục' }
      },
      {
        path: '/admin/categories/:categoryId',
        name: 'CategoryEdit',
        component: CategoryEdit,
        meta: { requiresAuth: true, title: 'Sửa Danh mục' }
      },
      {
        path: '/admin/subcategories/:subcategoryId',
        name: 'SubcategoryEdit',
        component: SubcategoryEdit,
        meta: { requiresAuth: true, title: 'Sửa Danh mục phụ' }
      },
      {
        path: '/admin/shipping-costs',
        name: 'ShippingCostsManagement',
        component: ShippingCostsManagement,
        meta: { requiresAuth: true, title: 'Quản lý Chi phí vận chuyển' }
      },
      {
        path: '.admin/shipping-costs/add',
        name: 'ShippingCostsAdd',
        component: ShippingCostsAdd,
        meta: { requiresAuth: true, title: 'Thêm chi phí vận chuyển' }
      },
      {
        path: '/admin/shipping-costs/:shippingId',
        name: 'ShippingCostsEdit',
        component: ShippingCostsEdit,
        meta: { requiresAuth: true, title: 'Sửa chi phí vận chuyển' }
      },
      {
        path: '/admin/status',
        name: 'StatusManagement',
        component: StatusManagement,
        meta: { requiresAuth: true, title: 'Quản lý trạng thái' }
      },
      {
        path: '/admin/orders',
        name: 'OrderManagement',
        component: OrderManagement,
        meta: { requiresAuth: true, title: 'Quản lý Đơn hàng' }
      },
      {
        path: '/admin/discount',
        name: 'DiscountManagement',
        component: DiscountManagement,
        meta: { requiresAuth: true, title: 'Khuyến mãi' },
      },
      {
        path: '/admin/discount/add',
        name: 'DiscountAdd',
        component: DiscountAdd,
        meta: { requiresAuth: true, title: 'Thêm Khuyến mãi' },
      },
      {
        path: '/admin/discount/:discountId',
        name: 'DiscountEdit',
        component: DiscountEdit,
        meta: { requiresAuth: true, title: 'Sửa Khuyến mãi' },
      },
      {
        path: 'settings',
        name: 'Settings',
        component: Settings,
        meta: { requiresAuth: true, title: 'Cài đặt' },
      },
      {
        path: 'profile',
        name: 'Profile',
        component: Profile,
        meta: { requiresAuth: true, title: 'Hồ sơ' },
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
