<template>
    <div class="admin-layout">
        <aside class="sidebar">
            <h2>Admin Panel</h2>
            <nav>
                <RouterLink to="/admin/dashboard" class="nav-link">Dashboard</RouterLink>
                <RouterLink to="/admin/users" class="nav-link">User Management</RouterLink>
                <RouterLink to="/admin/admin" class="nav-link">Admin Management</RouterLink>
                <RouterLink to="/admin/products" class="nav-link">Product Management</RouterLink>
                <RouterLink to="/admin/categories" class="nav-link">Category Management</RouterLink>
                <RouterLink to="/admin/shipping-costs" class="nav-link">Shipping Costs Management</RouterLink>
                <RouterLink to="/admin/orders" class="nav-link">Order Management</RouterLink>
                <RouterLink to="/admin/discount" class="nav-link">Discount Management</RouterLink>
                <RouterLink to="/admin/status" class="nav-link">Status Management</RouterLink>
                <RouterLink to="/admin/settings" class="nav-link">Settings</RouterLink>
            </nav>
        </aside>


        <main>
            <header class="admin-header">
                <div class="header-title">
                    <h1>Admin Dashboard</h1>
                    <p class="welcome-message">Xin chào, {{ adminName }}!</p>
                </div>
                <div class="header-actions">
                    <RouterLink to="/admin/profile" class="header-button profile">Profile</RouterLink>
                    <router-link :to="{ name: 'Login' }" class="header-button logout" @click.native="handleLogout">
                        Logout
                    </router-link>
                </div>
            </header>
            <section class="content-section">
                <RouterView />
            </section>
        </main>
    </div>
</template>

<script>
export default {
    data() {
        return {
            adminName: '' // Biến lưu tên admin
        };
    },
    mounted() {
        // Lấy tên admin từ localStorage khi component được tải
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.username) {
            this.adminName = user.username; // Gán tên admin vào adminName
        }
    },
    methods: {
        handleLogout() {
            localStorage.removeItem("token");
            localStorage.removeItem("user"); // Xóa thông tin người dùng
            this.$router.push('/login');
        }
    }
};
</script>

<style scoped>
.admin-layout {
    display: flex;
    height: 100vh;
}

.sidebar {
    width: 250px;
    background-color: #2c3e50;
    color: #ecf0f1;
    padding: 1.5rem;
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.2);
}

.sidebar h2 {
    text-align: center;
    font-size: 1.8rem;
    margin-bottom: 2rem;
    font-weight: 700;
}

.nav-link {
    display: block;
    padding: 12px 15px;
    color: #bdc3c7;
    text-decoration: none;
    border-radius: 6px;
    transition: background-color 0.3s, color 0.3s;
}

.nav-link:hover {
    background-color: #1abc9c;
    color: white;
}

.admin-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem 2rem;
    background-color: #ffffff;
    border-bottom: 1px solid #dfe6e9;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.header-title h1 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #34495e;
    margin: 0;
}

.welcome-message {
    font-size: 1rem;
    color: #7f8c8d;
    margin-top: 0.5rem;
}

.header-actions {
    display: flex;
    gap: 1rem;
}

.header-button {
    display: flex;
    align-items: center;
    padding: 8px 18px;
    font-weight: 500;
    color: #ffffff;
    border-radius: 8px;
    text-decoration: none;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
    transition: all 0.3s ease;
}

.header-button.profile {
    background-color: #27ae60;
}

.header-button.logout {
    background-color: #e67e22;
}

.header-button:hover {
    transform: translateY(-2px);
}

.header-button.profile:hover {
    background-color: #219150;
    box-shadow: 0 4px 8px rgba(39, 174, 96, 0.3);
}

.header-button.logout:hover {
    background-color: #d35400;
    box-shadow: 0 4px 8px rgba(230, 126, 34, 0.3);
}

main {
    flex-grow: 1;
    padding: 2rem;
    background-color: #ecf0f1;
    overflow-y: auto;
}

.content-section {
    margin-top: 20px;
}
</style>
