<template>
    <div class="admin-settings">
        <h2><i class="fas fa-cogs"></i> Cài Đặt Quản Trị</h2>
        <p>Quản lý toàn bộ cấu hình hệ thống và các cài đặt mở rộng của cửa hàng.</p>

        <div class="settings-grid">
            <div class="setting-card" v-for="option in settingOptions" :key="option.title">
                <h3><i :class="option.icon"></i> {{ option.title }}</h3>
                <p>{{ option.description }}</p>
                <div class="card-actions">
                    <button @click="navigateTo(option.route)">Đi tới <i class="fas fa-chevron-right"></i></button>
                    <span v-if="option.toggleable">
                        <input type="checkbox" :id="option.title" v-model="option.enabled"
                            @change="handleToggle(option)">
                        <label :for="option.title">{{ option.enabled ? 'Bật' : 'Tắt' }}</label>
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AdminSettings',
    data() {
        return {
            settingOptions: [
                {
                    title: 'Quản lý thanh toán',
                    description: 'Thiết lập các phương thức thanh toán và trạng thái giao dịch.',
                    route: '/admin/settings/payment',
                    icon: 'fas fa-credit-card',
                    toggleable: false
                },
                {
                    title: 'Quản lý giao hàng',
                    description: 'Thiết lập các phương thức giao hàng, chi phí và thời gian giao hàng.',
                    route: '/admin/settings/shipping',
                    icon: 'fas fa-shipping-fast',
                    toggleable: true,
                    enabled: true
                },
                {
                    title: 'Cấu hình cửa hàng',
                    description: 'Cập nhật thông tin, logo và cài đặt cửa hàng của bạn.',
                    route: '/admin/settings/store-info',
                    icon: 'fas fa-store',
                    toggleable: false
                },
                {
                    title: 'Quản lý người dùng',
                    description: 'Xem và quản lý danh sách người dùng, quyền hạn và trạng thái tài khoản.',
                    route: '/admin/settings/user-management',
                    icon: 'fas fa-users-cog',
                    toggleable: true,
                    enabled: false
                },
                {
                    title: 'Cài đặt bảo mật',
                    description: 'Cấu hình các biện pháp bảo mật, xác thực và quyền truy cập.',
                    route: '/admin/settings/security',
                    icon: 'fas fa-lock',
                    toggleable: false
                }
            ]
        };
    },
    methods: {
        navigateTo(route) {
            this.$router.push(route);
        },
        handleToggle(option) {
            // Thêm logic xử lý bật/tắt tính năng
            console.log(`Đã thay đổi trạng thái của ${option.title}: ${option.enabled ? 'Bật' : 'Tắt'}`);
        }
    }
};
</script>

<style scoped>
.admin-settings {
    padding: 2.5rem;
    background-color: #2c3e50;
    color: #ecf0f1;
    border-radius: 12px;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
    max-width: 1000px;
    margin: auto;
    font-family: 'Arial', sans-serif;
}

h2 {
    font-size: 32px;
    display: flex;
    align-items: center;
    color: #ecf0f1;
}

h2 i {
    margin-right: 12px;
    color: #ff8e3c;
}

p {
    color: #bdc3c7;
    margin-bottom: 1.5rem;
}

.settings-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
}

.setting-card {
    background-color: #34495e;
    border-radius: 8px;
    padding: 1.5rem;
    transition: box-shadow 0.3s;
    position: relative;
}

.setting-card h3 {
    font-size: 20px;
    display: flex;
    align-items: center;
    color: #ff8e3c;
}

.setting-card h3 i {
    margin-right: 8px;
}

.setting-card:hover {
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
}

.card-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
}

button {
    background-color: #ff8e3c;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 8px 16px;
    cursor: pointer;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 5px;
    transition: background-color 0.3s;
}

button:hover {
    background-color: #d9376e;
}

input[type="checkbox"] {
    margin-right: 10px;
    cursor: pointer;
}
</style>
