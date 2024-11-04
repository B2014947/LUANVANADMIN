<template>
    <div class="form-container">
        <h2>Thêm mới phí vận chuyển</h2>
        <form @submit.prevent="handleSubmit">
            <label>
                <strong>Tỉnh/Thành phố:</strong>
                <input type="text" v-model="province" required />
            </label>
            <label>
                <strong>Phí vận chuyển (VND):</strong>
                <input type="number" v-model="shippingCost" required />
            </label>
            <label>
                <strong>Thời gian giao hàng:</strong>
                <input type="text" v-model="estimatedDeliveryTime" required />
            </label>
            <button type="submit" class="submit-button">Tạo mới</button>
        </form>
        <button @click="goBack" class="back-button">Quay lại</button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            province: '',
            shippingCost: null,
            estimatedDeliveryTime: ''
        };
    },
    methods: {
        async handleSubmit() {
            try {
                const response = await fetch('http://localhost:5000/api/ShippingCost', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        Province: this.province,
                        ShippingCosts: this.shippingCost,
                        EstimatedDeliveryTime: this.estimatedDeliveryTime
                    })
                });

                if (!response.ok) {
                    throw new Error('Lỗi khi tạo phí vận chuyển');
                }

                alert('Phí vận chuyển đã được tạo thành công');
                this.goBack();
            } catch (error) {
                console.error('Lỗi khi tạo phí vận chuyển:', error);
                alert('Đã xảy ra lỗi khi tạo mới.');
            }
        },
        goBack() {
            this.$router.push('/admin/shipping-costs');
        }
    }
};
</script>

<style scoped>
.form-container {
    padding: 2rem;
    background-color: #1e2a38;
    color: #ecf0f1;
    border-radius: 12px;
    max-width: 600px;
    margin: auto;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
    font-family: 'Arial', sans-serif;
}

h2 {
    text-align: center;
    margin-bottom: 2rem;
    font-size: 24px;
    color: #ffffff;
    font-weight: bold;
}

form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

label {
    display: flex;
    flex-direction: column;
    font-size: 14px;
    color: #bdc3c7;
}

input[type="text"],
input[type="number"],
textarea {
    width: 100%;
    padding: 12px;
    background-color: #34495e;
    border: 1px solid #7f8c8d;
    border-radius: 6px;
    color: #ecf0f1;
    outline: none;
    transition: border-color 0.3s ease;
}

input[type="text"]:focus,
input[type="number"]:focus,
textarea:focus {
    border-color: #27ae60;
}

button {
    padding: 12px;
    border: none;
    border-radius: 6px;
    color: #fff;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s ease, transform 0.2s ease;
}

.submit-button {
    background-color: #2ecc71;
}

.back-button {
    background-color: #e74c3c;
}

button:hover {
    opacity: 0.95;
    transform: scale(1.02);
}

button:active {
    transform: scale(1);
}

button:focus {
    outline: 2px solid #27ae60;
}
</style>
