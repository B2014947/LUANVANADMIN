<template>
    <div class="admin-settings">
        <h2><i class="fas fa-cogs"></i> Cài Đặt Quản Trị</h2>
        <p>Quản lý toàn bộ cấu hình hệ thống và các cài đặt mở rộng của cửa hàng.</p>

        <div class="settings-grid">
            <div class="setting-card" v-for="option in settingOptions" :key="option.title">
                <h3><i :class="option.icon"></i> {{ option.title }}</h3>
                <p>{{ option.description }}</p>
                <div class="card-actions">
                    <button @click="navigateTo(option.route)" class="action-button">Đi tới <i
                            class="fas fa-chevron-right"></i></button>
                    <div v-if="option.toggleable" class="toggle-switch">
                        <input type="checkbox" :id="option.title" v-model="option.enabled"
                            @change="handleToggle(option)" />
                        <label :for="option.title">{{ option.enabled ? 'Bật' : 'Tắt' }}</label>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            settingOptions: [
                { title: "Cài đặt hệ thống", description: "Điều chỉnh cấu hình hệ thống chính.", icon: "fas fa-sliders-h", route: "/system-settings", toggleable: true, enabled: true },
                { title: "Quản lý người dùng", description: "Thiết lập và quản lý tài khoản người dùng.", icon: "fas fa-user-cog", route: "/user-management", toggleable: false },
                { title: "Bảo mật", description: "Cài đặt bảo mật cho hệ thống.", icon: "fas fa-lock", route: "/security-settings", toggleable: true, enabled: false },
                { title: "Thông báo", description: "Quản lý thông báo cho người dùng.", icon: "fas fa-bell", route: "/notification-settings", toggleable: true, enabled: true },
            ]
        };
    },
    methods: {
        navigateTo(route) {
            this.$router.push(route);
        },
        handleToggle(option) {
            // Xử lý logic bật/tắt cho các tùy chọn cài đặt
            console.log(`${option.title} đã được ${option.enabled ? 'bật' : 'tắt'}`);
        }
    }
};
</script>

<style scoped>
.admin-settings {
    padding: 2.5rem;
    max-width: 1200px;
    margin: auto;
    background-color: #f7f8fc;
    border-radius: 15px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    font-family: "Roboto", sans-serif;
}

h2 {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 28px;
    color: #2c3e50;
    font-weight: 700;
    text-align: center;
    margin-bottom: 1.5rem;
}

p {
    color: #7f8c8d;
    font-size: 16px;
    text-align: center;
    margin-bottom: 2rem;
}

.settings-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
}

.setting-card {
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
    padding: 1.5rem;
    transition: box-shadow 0.3s ease;
}

.setting-card h3 {
    font-size: 20px;
    color: #34495e;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 8px;
}

.setting-card p {
    color: #7f8c8d;
    font-size: 14px;
    margin-bottom: 1.2rem;
}

.setting-card:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.card-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.action-button {
    background-color: #3498db;
    color: #ffffff;
    padding: 8px 16px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
}

.action-button:hover {
    background-color: #2980b9;
    transform: scale(1.03);
}

.toggle-switch {
    display: flex;
    align-items: center;
    gap: 6px;
}

.toggle-switch input[type="checkbox"] {
    display: none;
}

.toggle-switch label {
    display: inline-block;
    width: 60px;
    padding: 8px;
    text-align: center;
    border-radius: 20px;
    color: #ffffff;
    cursor: pointer;
    background-color: #e74c3c;
    transition: background-color 0.3s;
}

.toggle-switch input[type="checkbox"]:checked+label {
    background-color: #27ae60;
}
</style>
