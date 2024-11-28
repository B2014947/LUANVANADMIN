<template>
    <div class="notification" :class="{ shake: hasNewMessages }" @click="goToChat">
        <div class="notification-content">
            <div class="notification-icon">
                <i class="fas fa-bell"></i> <!-- Icon thông báo -->
            </div>
            <div class="notification-text">
                <span class="unread-count">
                    {{ totalUnreadMessages }}
                </span>
                <span class="status-text">
                    Tin nhắn chờ
                </span>
                <div v-if="showMessage" class="extra-message">
                    Bạn có tin nhắn mới!
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    data() {
        return {
            hasNewMessages: false,  // Biến để kiểm tra có tin nhắn mới hay không
            intervalId: null,       // ID của interval để có thể dừng rung khi cần
            showMessage: false      // Biến để kiểm tra có hiển thị nội dung mờ dần hay không
        };
    },
    computed: {
        ...mapGetters(['totalUnreadMessages'])  // Lấy tổng số tin nhắn chưa đọc từ Vuex
    },
    watch: {
        totalUnreadMessages(newCount) {
            // Nếu có tin nhắn chưa đọc
            if (newCount > 0) {
                this.hasNewMessages = true;

                // Bắt đầu hiệu ứng rung liên tục nếu chưa có interval
                if (!this.intervalId) {
                    this.intervalId = setInterval(() => {
                        this.hasNewMessages = !this.hasNewMessages;  // Chuyển đổi trạng thái rung
                    }, 500);  // Thực hiện mỗi 500ms để rung liên tục
                }

                // Hiển thị nội dung mới và bắt đầu hiệu ứng mờ dần
                this.showMessage = true;
                setTimeout(() => {
                    this.showMessage = false;  // Ẩn nội dung sau 3 giây
                }, 3000);
            } else {
                // Nếu không còn tin nhắn chưa đọc, dừng rung
                if (this.intervalId) {
                    clearInterval(this.intervalId);
                    this.intervalId = null;  // Reset lại intervalId
                    this.hasNewMessages = false;  // Dừng trạng thái rung
                }
            }
        }
    },
    methods: {
        goToChat() {
            // Dừng rung khi người dùng click vào thông báo
            clearInterval(this.intervalId);
            this.intervalId = null;  // Reset lại intervalId

            // Điều hướng đến trang chat
            this.$router.push({ name: 'Chat' });  // Giả sử route của bạn là 'chat'
        }
    },
    mounted() {
        // Khi ứng dụng được tải, có thể gọi API hoặc lấy dữ liệu từ localStorage
        this.$store.dispatch('fetchUnreadMessagesCount');
    }
};
</script>

<style scoped>
.notification {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: #fff;
    padding: 10px 20px;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    z-index: 9999;
    transition: transform 0.2s ease-in-out;
}

.notification.shake {
    animation: shake 0.5s ease-in-out infinite;
    /* Chạy mãi mãi */
}

.notification-content {
    display: flex;
    align-items: center;
}

.notification-icon {
    margin-right: 10px;
    font-size: 1.5rem;
    color: #e74c3c;
}

.notification-text {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.unread-count {
    background-color: #e74c3c;
    color: white;
    padding: 5px 10px;
    border-radius: 50%;
    font-size: 1rem;
    margin-right: 5px;
}

.status-text {
    font-size: 0.875rem;
    color: #555;
}

.extra-message {
    font-size: 0.875rem;
    color: #555;
    opacity: 1;
    transition: opacity 2s ease-out;
    /* Tạo hiệu ứng mờ dần */
}

/* Khi không có tin nhắn mới, ẩn nội dung */
.extra-message.hide {
    opacity: 0;
}

@keyframes shake {
    0% {
        transform: translateX(0);
    }

    25% {
        transform: translateX(-5px);
    }

    50% {
        transform: translateX(5px);
    }

    75% {
        transform: translateX(-5px);
    }

    100% {
        transform: translateX(0);
    }
}
</style>
