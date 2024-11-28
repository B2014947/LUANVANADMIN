// src/store.js
import { createStore } from 'vuex';

const store = createStore({
    state() {
        return {
            unreadMessagesCount: {}  // Lưu số lượng tin nhắn chưa đọc theo userId
        };
    },
    mutations: {
        // Thêm hoặc giảm số lượng tin nhắn chưa đọc cho userId
        setUnreadMessagesCount(state, { userId, count }) {
            state.unreadMessagesCount[userId] = count;
        },
        // Cập nhật tất cả tin nhắn chưa đọc
        setAllUnreadMessagesCount(state, unreadMessagesCount) {
            state.unreadMessagesCount = unreadMessagesCount;
        }
    },
    actions: {
        // Gọi API hoặc lấy dữ liệu từ localStorage để thiết lập số lượng tin nhắn chưa đọc
        async fetchUnreadMessagesCount({ commit }) {
            // Ví dụ, lấy dữ liệu từ localStorage hoặc API
            const storedUnreadCount = JSON.parse(localStorage.getItem('unreadMessagesCount')) || {};
            commit('setAllUnreadMessagesCount', storedUnreadCount);
        }
    },
    getters: {
        totalUnreadMessages(state) {
            return Object.values(state.unreadMessagesCount).reduce((acc, count) => acc + count, 0);
        }
    }
});

export default store;
