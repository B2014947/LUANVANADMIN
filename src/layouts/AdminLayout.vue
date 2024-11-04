<template>
    <div class="admin-layout">
        <aside class="sidebar">
            <h2><i class="fas fa-cogs"></i> Admin Panel</h2>
            <nav>
                <RouterLink to="/admin/dashboard" class="nav-link">
                    <i class="fas fa-tachometer-alt"></i> Dashboard
                </RouterLink>
                <RouterLink to="/admin/users" class="nav-link">
                    <i class="fas fa-users"></i> User Management
                </RouterLink>
                <RouterLink to="/admin" class="nav-link">
                    <i class="fas fa-user-shield"></i> Admin Management
                </RouterLink>
                <RouterLink to="/admin/products" class="nav-link">
                    <i class="fas fa-box-open"></i> Product Management
                </RouterLink>
                <RouterLink to="/admin/categories" class="nav-link">
                    <i class="fas fa-tags"></i> Category Management
                </RouterLink>
                <RouterLink to="/admin/shipping-costs" class="nav-link">
                    <i class="fas fa-shipping-fast"></i> Shipping Costs
                </RouterLink>
                <RouterLink to="/admin/orders" class="nav-link">
                    <i class="fas fa-shopping-cart"></i> Order Management
                    <span v-if="orderNotificationCount > 0" class="notification-badge">{{ orderNotificationCount
                        }}</span>
                </RouterLink>
                <RouterLink to="/admin/transactions" class="nav-link">
                    <i class="fas fa-receipt"></i> Transaction Management
                    <span v-if="transactionNotificationCount > 0" class="notification-badge">{{
                        transactionNotificationCount }}</span>
                </RouterLink>


                <RouterLink to="/admin/discount" class="nav-link">
                    <i class="fas fa-percentage"></i> Discount Management
                </RouterLink>
                <RouterLink to="/admin/status" class="nav-link">
                    <i class="fas fa-tasks"></i> Status Management
                </RouterLink>
                <RouterLink to="/admin/settings" class="nav-link">
                    <i class="fas fa-cog"></i> Settings
                </RouterLink>
            </nav>
        </aside>

        <main>
            <header class="admin-header">
                <div class="header-title">
                    <h1><i class="fas fa-home"></i> Admin Dashboard</h1>
                    <p class="welcome-message">Xin chào, {{ adminName }}!</p>
                </div>
                <div class="header-actions">
                    <RouterLink to="/admin/profile" class="header-button profile">
                        <i class="fas fa-user-circle"></i> Profile
                    </RouterLink>
                    <router-link :to="{ name: 'Login' }" class="header-button logout" @click.native="handleLogout">
                        <i class="fas fa-sign-out-alt"></i> Logout
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
            adminName: '',
            transactionNotificationCount: 0,
            orderNotificationCount: 0,
        };
    },
    mounted() {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.username) {
            this.adminName = user.username;
        }
        this.fetchNotificationCounts();

        // Set interval to 5 seconds for testing
        setInterval(this.fetchNotificationCounts, 5000);
    }
    ,
    methods: {
        async fetchNotificationCounts() {
            try {
                const transactionResponse = await fetch("http://localhost:5000/api/Transactions/new-count");
                const orderResponse = await fetch("http://localhost:5000/api/Order/new-order-count");

                if (!transactionResponse.ok) throw new Error("Error fetching new transactions count");
                if (!orderResponse.ok) throw new Error("Error fetching new orders count");

                const transactionData = await transactionResponse.json();
                const orderData = await orderResponse.json();

                console.log("Transaction Notification Count:", transactionData.newTransactionCount);
                console.log("Order Notification Count:", orderData.newOrderCount);

                this.transactionNotificationCount = transactionData.newTransactionCount;
                this.orderNotificationCount = orderData.newOrderCount;
            } catch (error) {
                console.error("Error loading notification counts:", error);
            }
        }
        ,
        handleLogout() {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            this.$router.push('/login');
        }
    },
};
</script>
<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

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
    display: flex;
    align-items: center;
    justify-content: center;
}

.sidebar h2 i {
    margin-right: 10px;
    color: #3498db;
}

.nav-link {
    position: relative;
    display: flex;
    align-items: center;
    padding: 12px 15px;
    color: #bdc3c7;
    text-decoration: none;
    border-radius: 6px;
    transition: background-color 0.3s, color 0.3s;
    font-size: 1rem;
}

.nav-link i {
    margin-right: 10px;
    font-size: 1.2rem;
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
    font-size: 1.8rem;
    font-weight: 700;
    color: #34495e;
    display: flex;
    align-items: center;
    margin: 0;
}

.header-title h1 i {
    margin-right: 10px;
    color: #3498db;
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

.header-button i {
    margin-right: 8px;
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

.notification-badge {
    position: absolute;
    /* Giúp định vị badge dễ dàng hơn */
    top: 10px;
    /* Đặt vị trí phía trên biểu tượng */
    right: 1px;
    /* Đặt vị trí bên phải của biểu tượng */
    background-color: #ff4d4f;
    /* Màu sắc nổi bật hơn */
    color: white;
    border-radius: 12px;
    /* Độ cong lớn hơn cho kiểu viên thuốc */
    padding: 3px 10px;
    /* Tăng padding để badge không quá nhỏ */
    font-size: 0.8rem;
    /* Cỡ chữ lớn hơn một chút */
    font-weight: bold;
    /* Làm đậm chữ để dễ đọc */
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
    /* Thêm hiệu ứng đổ bóng */
    display: inline-flex;
    /* Giúp badge gọn gàng và căn giữa nội dung */
    align-items: center;
    justify-content: center;
    min-width: 12px;
    /* Đảm bảo kích thước tối thiểu khi hiển thị số 1 chữ số */
    height: 12px;
    /* Đảm bảo chiều cao cố định cho badge */
}
</style>
