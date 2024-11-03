<template>
    <div class="form-container">
        <h2>Sửa Khuyến Mãi</h2>

        <form @submit.prevent="handleSubmit">
            <label>
                <strong>Mã Khuyến Mãi:</strong>
                <input type="text" v-model="discountCode" disabled />
            </label>
            <label>
                <strong>Mô tả:</strong>
                <textarea v-model="description"></textarea>
            </label>
            <label>
                <strong>Phần trăm giảm giá (%):</strong>
                <input type="number" v-model="discountPercentage" required />
            </label>
            <label>
                <strong>Ngày hết hạn:</strong>
                <input type="date" v-model="expiryDate" required />
            </label>
            <label>
                <strong>Trạng thái:</strong>
                <select v-model="isActive">
                    <option :value="true">Hoạt động</option>
                    <option :value="false">Không hoạt động</option>
                </select>
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
            discountCode: '',
            description: '',
            discountPercentage: null,
            expiryDate: '',
            isActive: true
        };
    },
    mounted() {
        if (this.$route.params.discountId) {
            this.fetchDiscountDetails(this.$route.params.discountId);
        }
    },
    methods: {
        async fetchDiscountDetails(discountId) {
            try {
                const response = await fetch(`http://localhost:5000/api/Discounts/${discountId}`);
                const data = await response.json();
                this.discountCode = data.DiscountCode;
                this.description = data.Description;
                this.discountPercentage = data.DiscountPercentage;
                this.expiryDate = data.ExpiryDate.split('T')[0]; // Lấy phần ngày
                this.isActive = data.IsActive;
            } catch (error) {
                console.error('Lỗi khi tải chi tiết khuyến mãi:', error);
                alert('Đã xảy ra lỗi khi tải dữ liệu.');
            }
        },
        async handleSubmit() {
            try {
                const response = await fetch(`http://localhost:5000/api/Discounts/${this.$route.params.discountId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        discountCode: this.discountCode,
                        description: this.description,
                        discountPercentage: this.discountPercentage,
                        expiryDate: this.expiryDate,
                        isActive: this.isActive
                    })
                });

                if (!response.ok) {
                    throw new Error('Lỗi khi cập nhật khuyến mãi');
                }

                alert('Khuyến mãi đã được cập nhật thành công');
                this.goBack();
            } catch (error) {
                console.error('Lỗi khi cập nhật khuyến mãi:', error);
                alert('Đã xảy ra lỗi khi cập nhật.');
            }
        },
        goBack() {
            this.$router.push('/admin/discount');
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
    margin-bottom: 1.5rem;
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
input[type="date"],
textarea,
select {
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
input[type="date"]:focus,
textarea:focus,
select:focus {
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
