<template>
    <div class="form-container">
        <h2>Sửa phí vận chuyển</h2>
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
            <button type="submit" class="submit-button">Cập nhật</button>
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
            estimatedDeliveryTime: '',
            shippingId: null // Lưu trữ ID của phí vận chuyển để cập nhật
        };
    },
    mounted() {
        this.shippingId = this.$route.params.shippingId;
        this.fetchShippingCost();
    },
    methods: {
        async fetchShippingCost() {
            try {
                const response = await fetch(`http://localhost:5000/api/ShippingCost/${this.shippingId}`);
                const data = await response.json();
                this.province = data.Province;
                this.shippingCost = data.ShippingCosts;
                this.estimatedDeliveryTime = data.EstimatedDeliveryTime;
            } catch (error) {
                console.error('Lỗi khi tải thông tin phí vận chuyển:', error);
                alert('Đã xảy ra lỗi khi tải dữ liệu.');
            }
        },
        async handleSubmit() {
            try {
                const response = await fetch(`http://localhost:5000/api/ShippingCost/${this.shippingId}`, {
                    method: 'PUT',
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
                    throw new Error('Lỗi khi cập nhật phí vận chuyển');
                }

                alert('Phí vận chuyển đã được cập nhật thành công');
                this.goBack();
            } catch (error) {
                console.error('Lỗi khi cập nhật phí vận chuyển:', error);
                alert('Đã xảy ra lỗi khi cập nhật.');
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
    padding: 2.5rem;
    background-color: #ffffff;
    color: #2c3e50;
    border-radius: 12px;
    max-width: 600px;
    margin: 40px auto;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    font-family: 'Roboto', sans-serif;
}

h2 {
    color: #27ae60;
    text-align: center;
    margin-bottom: 1.5rem;
    font-size: 1.8rem;
    font-weight: bold;
}

form {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
}

label {
    font-weight: 500;
    color: #34495e;
    display: flex;
    flex-direction: column;
}

input[type="text"],
input[type="number"] {
    width: 100%;
    padding: 12px 15px;
    background-color: #f4f4f4;
    border: 1px solid #bdc3c7;
    border-radius: 8px;
    color: #2c3e50;
    font-size: 15px;
    outline: none;
    transition: border-color 0.3s ease;
}

input:focus {
    border-color: #27ae60;
    box-shadow: 0 0 5px rgba(39, 174, 96, 0.3);
}

button {
    padding: 12px;
    border: none;
    border-radius: 8px;
    color: #ffffff;
    cursor: pointer;
    font-size: 16px;
    font-weight: 600;
    transition: background-color 0.3s ease, transform 0.2s ease;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.submit-button {
    background-color: #2ecc71;
}

.back-button {
    background-color: #2980b9;
    margin-top: 1rem;
}

button:hover {
    transform: scale(1.03);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

button:active {
    transform: scale(1);
}
</style>
