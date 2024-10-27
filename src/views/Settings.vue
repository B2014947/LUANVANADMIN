<template>
    <div class="settings-container">
        <h2>Cài đặt</h2>
        <p>Quản lý các tùy chọn cấu hình cho cửa hàng của bạn.</p>
        <div class="settings-options">
            <div class="option">
                <h3>Quản lý thanh toán</h3>
                <p>Thiết lập các phương thức thanh toán mà bạn chấp nhận.</p>
                <button @click="goToPaymentSettings">Cài đặt thanh toán</button>
            </div>

            <div class="option">
                <h3>Quản lý giao hàng</h3>
                <p>Thiết lập các tùy chọn giao hàng và chi phí.</p>
                <button @click="goToShippingSettings">Cài đặt giao hàng</button>
            </div>

            <div class="option">
                <h3>Cấu hình thông tin cửa hàng</h3>
                <p>Cập nhật thông tin và logo của cửa hàng.</p>
                <button @click="goToStoreInfo">Cập nhật thông tin cửa hàng</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Settings',
    methods: {
        goToPaymentSettings() {
            // Điều hướng đến trang cài đặt thanh toán
            this.$router.push('/admin/settings/payment');
        },
        goToShippingSettings() {
            // Điều hướng đến trang cài đặt giao hàng
            this.$router.push('/admin/settings/shipping');
        },
        goToStoreInfo() {
            // Điều hướng đến trang cài đặt thông tin cửa hàng
            this.$router.push('/admin/settings/store-info');
        },
    },
};
</script>

<style scoped>
.settings-container {
    padding: 2rem;
    background-color: #ecf0f1;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.settings-options {
    margin-top: 20px;
}

.option {
    margin-bottom: 20px;
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: white;
    transition: box-shadow 0.3s ease;
}

.option:hover {
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

h3 {
    color: #0d0d0d;
    margin-bottom: 10px;
}

button {
    background-color: #ff8e3c;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 10px 15px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

button:hover {
    background-color: #d9376e;
}
</style>
