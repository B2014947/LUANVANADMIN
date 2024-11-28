<template>
    <div class="admin-chat-container">
        <div class="admin-chat-header">
            <h2>Admin Chat Management</h2>
        </div>

        <div class="user-list">
            <div v-for="(messages, userId) in groupedMessages" :key="userId" class="user-item"
                @click="selectUser(userId)">
                <div class="user-info">
                    <span class="user-name">User {{ userId }}</span>
                    <span v-if="messages.length > 0" class="message-preview">
                        {{ messages[messages.length - 1].MessageContent }}
                    </span>
                    <!-- Hiển thị số lượng tin nhắn chưa đọc -->
                    <span v-if="unreadMessagesCount[userId] > 0" class="unread-count">
                        {{ unreadMessagesCount[userId] }}
                    </span>
                </div>
            </div>
        </div>

        <div v-if="selectedUserId" class="chat-box">
            <div class="chat-header">
                <h3>Chat with User {{ selectedUserId }}</h3>
                <button class="close-btn" @click="closeChat">X</button>
            </div>
            <div class="messages" ref="messageContainer">
                <div v-for="message in selectedMessages" :key="message.MessageId" class="message">
                    <div
                        :class="{ 'message-user': message.SenderRole === 'User', 'message-admin': message.SenderRole === 'Admin' }">
                        <p>{{ message.MessageContent }}</p>
                        <span class="timestamp">{{ new Date(message.CreatedAt).toLocaleString() }}</span>
                    </div>
                </div>
            </div>
            <textarea v-model="newMessage" placeholder="Type your response..."></textarea>
            <button @click="sendMessage">Send Response</button>
        </div>
    </div>
</template>



<script>
import { io } from 'socket.io-client';
import axios from 'axios';

export default {
    data() {
        return {
            groupedMessages: {},  // Tin nhắn của các người dùng
            unreadMessagesCount: {}, // Số lượng tin nhắn chưa đọc
            selectedUserId: null,  // ID người dùng đang chọn
            selectedMessages: [],  // Tin nhắn của người dùng đang chọn
            newMessage: '',  // Tin nhắn mới gửi
            socket: null,  // Kết nối socket
        };
    },
    mounted() {
        this.setupSocket();
        this.loadMessagesFromLocalStorage();  // Kiểm tra và tải dữ liệu từ localStorage nếu có
    },
    methods: {
        // Tải dữ liệu từ localStorage
        loadMessagesFromLocalStorage() {
            const storedMessages = localStorage.getItem('groupedMessages');
            const storedUnreadCount = localStorage.getItem('unreadMessagesCount');
            if (storedMessages && storedUnreadCount) {
                this.groupedMessages = JSON.parse(storedMessages);
                this.unreadMessagesCount = JSON.parse(storedUnreadCount);
            } else {
                this.loadMessages();  // Nếu không có dữ liệu trong localStorage, gọi API
            }
        },

        // Lưu dữ liệu vào localStorage
        saveMessagesToLocalStorage() {
            localStorage.setItem('groupedMessages', JSON.stringify(this.groupedMessages));
            localStorage.setItem('unreadMessagesCount', JSON.stringify(this.unreadMessagesCount));
        },

        async loadMessages() {
            try {
                const response = await axios.get('http://localhost:5000/api/messagesnew'); // Lấy tất cả tin nhắn từ server
                response.data.forEach(message => {
                    if (!this.groupedMessages[message.UserId]) {
                        this.groupedMessages[message.UserId] = [];
                        this.unreadMessagesCount[message.UserId] = 0;
                    }

                    // Thêm tin nhắn vào nhóm mà không cần kiểm tra duplicates
                    message.isRead = false;  // Mặc định tin nhắn chưa đọc
                    this.groupedMessages[message.UserId].push(message);

                    // Tăng số lượng tin nhắn chưa đọc
                    if (!message.isRead) {
                        this.unreadMessagesCount[message.UserId]++;
                    }
                });

                // Lưu dữ liệu sau khi tải
                this.saveMessagesToLocalStorage();
            } catch (error) {
                console.error('Error loading messages:', error);
            }
        },

        setupSocket() {
            this.socket = io('http://localhost:5000');
            this.socket.emit('joinAdminRoom');  // Admin vào phòng chat

            // Nhận tin nhắn từ người dùng
            this.socket.on('userMessage', (message) => {
                // Kiểm tra và đảm bảo groupedMessages[message.UserId] là một mảng
                if (!Array.isArray(this.groupedMessages[message.UserId])) {
                    this.groupedMessages[message.UserId] = [];
                }

                // Thêm tin nhắn vào mảng
                message.isRead = false;  // Mặc định tin nhắn chưa đọc
                this.groupedMessages[message.UserId].push(message);

                // Tăng số lượng tin nhắn chưa đọc
                if (!message.isRead) {
                    this.unreadMessagesCount[message.UserId]++;
                }

                // Lưu dữ liệu sau khi nhận tin nhắn
                this.saveMessagesToLocalStorage();

                // Thực hiện rung khi có tin nhắn mới
                this.vibrateDevice();


            });

            // Nhận tin nhắn phản hồi từ admin
            this.socket.on('adminMessage', (message) => {
                if (this.selectedUserId === message.UserId) {
                    const lastMessage = this.selectedMessages[this.selectedMessages.length - 1];
                    if (!lastMessage || lastMessage.MessageId !== message.MessageId) {
                        this.selectedMessages.push(message);
                        // Cuộn xuống cuối khi có tin nhắn mới
                        this.scrollToBottom();
                    }
                }
            });
        },

        selectUser(userId) {
            this.selectedUserId = userId;
            this.selectedMessages = this.groupedMessages[userId] || [];  // Đảm bảo luôn là mảng

            // Đánh dấu tất cả tin nhắn là đã đọc khi admin mở cuộc trò chuyện
            this.selectedMessages.forEach((msg) => {
                if (!msg.isRead) {
                    msg.isRead = true;  // Đánh dấu là đã đọc
                    this.unreadMessagesCount[userId]--; // Giảm số lượng tin nhắn chưa đọc
                }
            });

            // Lưu lại trạng thái mới vào localStorage
            this.saveMessagesToLocalStorage();

            // Cuộn xuống khi mở chat
            this.scrollToBottom();
        },

        async sendMessage() {
            if (this.newMessage.trim() === '') return;

            // Lấy thời gian hiện tại và chuyển thành số nguyên với định dạng HHMM
            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes();
            const seconds = now.getSeconds();  // Lấy giá trị giây

            // Đảm bảo minutes và seconds luôn có 2 chữ số (thêm số 0 nếu chỉ có 1 chữ số)
            const minutesStr = minutes < 10 ? `0${minutes}` : minutes;
            const secondsStr = seconds < 10 ? `0${seconds}` : seconds;

            // Tạo messageId theo định dạng HHMMSS
            const messageId = `${hours}${minutesStr}${secondsStr}`;
            console.log('Generated MessageId:', messageId);
            const messageData = {
                MessageId: messageId,
                UserId: this.selectedUserId,
                MessageContent: this.newMessage,
                SenderRole: 'Admin',
                CreatedAt: new Date(),
            };

            // Thêm tin nhắn vào giao diện ngay lập tức
            this.selectedMessages.push(messageData);

            // Gửi tin nhắn qua socket
            this.socket.emit('adminMessage', messageData);

            // Gửi tin nhắn tới server để lưu vào cơ sở dữ liệu
            try {
                const response = await axios.post('http://localhost:5000/api/messagesnew', messageData);
            } catch (error) {
                console.error('Error sending message to server:', error);
            }

            // Xóa nội dung tin nhắn sau khi gửi
            this.newMessage = '';

            // Lưu lại trạng thái mới vào localStorage
            this.saveMessagesToLocalStorage();

            // Cuộn xuống cuối cùng
            this.scrollToBottom();
        },

        closeChat() {
            this.selectedUserId = null;
            this.selectedMessages = [];
        },

        // Hàm cuộn xuống cuối khi có tin nhắn mới
        scrollToBottom() {
            this.$nextTick(() => {
                const container = this.$refs.messageContainer;
                if (container) {
                    container.scrollTop = container.scrollHeight;
                }
            });
        },

        // Hàm rung thiết bị khi có tin nhắn mới
        vibrateDevice() {
            if (navigator.vibrate) {
                navigator.vibrate(200); // Rung 200ms
            }
        },
    },
};
</script>



<style scoped>
/* Styles cho giao diện */
.admin-chat-container {
    width: 85%;
    margin: 0 auto;
    padding: 20px;
    background-color: #f8f9fa;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.admin-chat-header {
    text-align: center;
    margin-bottom: 20px;
}

.user-list {
    margin-top: 20px;
}

.user-item {
    padding: 12px;
    background-color: #ffffff;
    border-radius: 8px;
    margin-bottom: 12px;
    cursor: pointer;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s;
}

.user-item:hover {
    background-color: #e3f2fd;
}

.user-info {
    display: flex;
    justify-content: space-between;
}

.message-preview {
    font-size: 0.9rem;
    color: #95a5a6;
}

.unread-count {
    background-color: #e74c3c;
    color: white;
    font-size: 0.9rem;
    padding: 2px 6px;
    border-radius: 50%;
    margin-left: 8px;
}

.chat-box {
    margin-top: 20px;
    padding: 20px;
    background-color: #ffffff;
    border-radius: 10px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.chat-header h3 {
    margin: 0;
}

.close-btn {
    background-color: #e74c3c;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 5px 10px;
    cursor: pointer;
}

.messages {
    height: 300px;
    overflow-y: auto;
    margin-bottom: 15px;
    padding-right: 10px;
    scroll-behavior: smooth;
}

.message-user {
    background-color: #e3f2fd;
    text-align: right;
    border-radius: 8px;
    padding: 10px;
    margin-bottom: 10px;
}

.message-admin {
    background-color: #f1f1f1;
    text-align: left;
    border-radius: 8px;
    padding: 10px;
    margin-bottom: 10px;
}

.timestamp {
    font-size: 0.8rem;
    color: #95a5a6;
    display: block;
    margin-top: 5px;
}

textarea {
    width: 100%;
    height: 80px;
    padding: 10px;
    margin-top: 15px;
    border-radius: 8px;
    border: 1px solid #ccc;
    font-size: 1rem;
}

button {
    padding: 12px 18px;
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
    margin-top: 10px;
}

button:hover {
    background-color: #2980b9;
}
</style>
