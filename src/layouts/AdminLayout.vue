<template>
    <NotificationHeader />
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
                <RouterLink to="/admin/brand" class="nav-link">
                    <i class="fa-solid fa-hashtag"></i> Brand Management
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
                    <div class="notification-container" @click="toggleNotifications">
                        <i class="fas fa-bell notification-icon" :class="{ 'ring': isRinging }"></i>
                        <span class="notification-badge"
                            v-if="orderNotificationCount + transactionNotificationCount > 0">
                            {{ orderNotificationCount + transactionNotificationCount }}
                        </span>
                        <div v-if="showNotifications" class="notification-dropdown">
                            <p v-if="orderNotificationCount + transactionNotificationCount === 0"
                                class="no-notifications">
                                Không có thông báo mới
                            </p>
                            <p v-else class="notification-item" v-for="(notification, index) in notifications"
                                :key="index">
                                {{ notification }}
                            </p>
                        </div>
                    </div>
                    <RouterLink to="/admin/profile" class="header-button profile">
                        <i class="fas fa-user-circle"></i> Profile
                    </RouterLink>
                    <RouterLink to="/admin/chat" class="header-button chat">
                        <i class="fas fa-comments"></i> Chat
                        <!-- Hiển thị tổng số thông báo trong chat -->
                        <span v-if="unreadCount > 0" class="unread-count">
                            {{ unreadCount }}
                        </span>
                    </RouterLink>
                    <router-link :to="{ name: 'Login' }" class="header-button logout" @click.native="handleLogout">
                        <i class="fas fa-sign-out-alt"></i> Logout
                    </router-link>
                </div>
            </header>
            <div>
                <router-view v-slot="{ Component }">
                    <transition name="slide-fade">
                        <component :is="Component" />
                    </transition>
                </router-view>
            </div>
        </main>
    </div>
</template>


<script>
import NotificationHeader from '../NotificationHeader.vue';
import { io } from 'socket.io-client';
export default {
    components: {
        NotificationHeader
    },
    data() {
        return {
            adminName: '',
            transactionNotificationCount: 0,
            chatNotificationCount: 0,
            orderNotificationCount: 0,
            isRinging: false,
            showNotifications: false,
            notifications: [], // Danh sách thông báo chi tiết
            notificationCount: 0,
            unreadCount: 0,
        };
    },
    mounted() {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.username) {
            this.adminName = user.username;
        }
        this.fetchNotificationCounts();

        setInterval(() => {
            this.isRinging = !this.isRinging;
        }, 1000);

        setInterval(this.fetchNotificationCounts, 5000);

        this.socket = io('http://localhost:5000'); // Kết nối với server socket
        this.socket.on('connect', () => {
            console.log('Socket connected successfully');
        });

        this.socket.on('new-notification', (data) => {
            console.log("Received new notification:", data); // Kiểm tra dữ liệu nhận được
            console.log(this.chatNotificationCount);
            this.notificationCount += 1;
            this.notifications.push(data.message); // Thêm thông báo mới vào danh sách
            console.log("Notifications list:", this.notifications); // Kiểm tra xem thông báo có được thêm vào đúng cách
        });
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

                this.transactionNotificationCount = transactionData.newTransactionCount;
                this.orderNotificationCount = orderData.newOrderCount;

                // Thêm thông báo vào danh sách thông báo chi tiết
                this.notifications = [
                    `Có ${this.orderNotificationCount} đơn hàng mới.`,
                    `Có ${this.transactionNotificationCount} giao dịch mới.`
                ].filter((item) => !item.includes('0'));
            } catch (error) {
                console.error("Error loading notification counts:", error);
            }
        },
        handleLogout() {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            this.$router.push('/login');
        },
        toggleNotifications() {
            this.showNotifications = !this.showNotifications;
            this.isRinging = false; // Dừng hiệu ứng rung khi người dùng bấm vào chuông
        }
    },
};
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

/*
  Enter and leave animations can use different
  durations and timing functions.
*/
.unread-messages {
    display: flex;
    align-items: center;
    font-size: 1.1rem;
}

.unread-count {
    background-color: #e74c3c;
    color: white;
    font-size: 0.9rem;
    padding: 2px 6px;
    border-radius: 50%;
    margin-right: 10px;
}

/* Thêm phần CSS cho icon thông báo trong chat */
.header-button.chat {
    position: relative;
    /* Để có thể đặt thông báo lên trên */
}

.notification-badge-chat {
    position: absolute;
    top: -5px;
    right: -5px;
    background-color: red;
    color: white;
    border-radius: 50%;
    padding: 5px;
}


.slide-fade-enter-active {
    transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
    transition: all 0.5s cubic-bezier(1, 0.5, 0.5, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    transform: translateX(20px);
    opacity: 0;
}

/* Tông màu chính và phụ */
.admin-layout {
    display: flex;
    height: 100vh;
}

.sidebar {
    width: 250px;
    background-color: #2c3e50;
    /* Màu xanh đậm */
    color: #ffffff;
    /* Màu chữ sáng */
    padding: 1.5rem;
    border-right: 1px solid #34495e;
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.2);
    background: linear-gradient(180deg, #2c3e50, #34495e);
}

.sidebar h2 {
    text-align: center;
    font-size: 1.6rem;
    margin-bottom: 2rem;
    color: #27ae60;
    /* Màu xanh lá nhạt */
}

.nav-link {
    position: relative;
    display: flex;
    align-items: center;
    padding: 12px 15px;
    color: #ffffff;
    text-decoration: none;
    border-radius: 6px;
    font-size: 1rem;
    margin-bottom: 1rem;
    transition: background-color 0.3s, color 0.3s;
}

.nav-link:hover,
.nav-link.active {
    background-color: #1abc9c;
    /* Màu xanh lá nhạt khi hover */
    color: #fff;
}

.nav-link i {
    margin-right: 10px;
    font-size: 1.2rem;
}

.header-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.header-button {
    padding: 8px 16px;
    background-color: #27ae60;
    color: #ffffff;
    border-radius: 8px;
    text-decoration: none;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s;
}

.header-button:hover {
    background-color: #219150;
}

.header-button.chat {
    background-color: #3498db;
    /* Blue color for Chat */
}

.header-button.chat:hover {
    background-color: #2980b9;
}

.admin-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background-color: #ffffff;
    /* Nền header */
    border-bottom: 1px solid #34495e;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.header-title h1 {
    font-size: 1.8rem;
    font-weight: 600;
    color: #2c3e50;
    display: flex;
    align-items: center;
    margin: 0;
}

.header-title h1 i {
    margin-right: 10px;
    color: #27ae60;
}

.welcome-message {
    font-size: 1rem;
    color: #2c3e50;
    margin-top: 0.5rem;
}

.header-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.notification-container {
    position: relative;
    cursor: pointer;
}

.notification-icon {
    font-size: 1.5rem;
    color: #27ae60;
    transition: transform 0.2s ease-in-out;
}

.notification-badge {
    position: absolute;
    top: -5px;
    right: -10px;
    background-color: #e74c3c;
    /* Màu đỏ cho badge */
    color: #ffffff;
    border-radius: 50%;
    padding: 5px 10px;
    font-size: 0.8rem;
    font-weight: bold;
}

.header-button {
    padding: 8px 16px;
    background-color: #27ae60;
    color: #ffffff;
    border-radius: 8px;
    text-decoration: none;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s;
}

.header-button:hover {
    background-color: #219150;
}

main {
    flex-grow: 1;
    padding: 2rem;
    background-color: #f4f6f8;
    overflow-y: auto;
    color: #2c3e50;
}

.content-section {
    margin-top: 20px;
}

/* Hiệu ứng rung cho chuông thông báo */
@keyframes ring-animation {

    0%,
    100% {
        transform: rotate(0deg);
    }

    25% {
        transform: rotate(15deg);
    }

    50% {
        transform: rotate(-15deg);
    }

    75% {
        transform: rotate(15deg);
    }
}

@media (max-width: 768px) {
    .sidebar {
        display: none;
    }

    .admin-layout {
        flex-direction: column;
    }

    .admin-header {
        padding: 0.5rem;
    }

    main {
        padding: 1rem;
    }
}
</style>
