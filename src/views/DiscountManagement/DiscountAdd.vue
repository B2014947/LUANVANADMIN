<template>
    <div class="form-container">
        <h2>Thêm Mới Khuyến Mãi</h2>

        <form @submit.prevent="handleSubmit">
            <label>
                <strong>Mã Khuyến Mãi:</strong>
                <input type="text" v-model="discountCode" required />
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
            <button type="submit" class="submit-button">Tạo mới</button>
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
    methods: {
        async handleSubmit() {
            try {
                const response = await fetch('http://localhost:5000/api/discounts', {
                    method: 'POST',
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
                    throw new Error('Lỗi khi tạo mới khuyến mãi');
                }

                alert('Khuyến mãi đã được tạo thành công');
                this.goBack();
            } catch (error) {
                console.error('Lỗi khi tạo mới khuyến mãi:', error);
                alert('Đã xảy ra lỗi khi tạo mới.');
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
    padding: 2.5rem;
    background-color: #ffffff;
    color: #2c3e50;
    border-radius: 15px;
    max-width: 600px;
    margin: 40px auto;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    font-family: 'Roboto', sans-serif;
}

h2 {
    text-align: center;
    margin-bottom: 1.5rem;
    font-size: 26px;
    color: #27ae60;
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
    font-weight: bold;
    color: #2c3e50;
}

input[type="text"],
input[type="number"],
input[type="date"],
textarea,
select {
    width: 100%;
    padding: 12px;
    background-color: #ecf0f1;
    border: 1px solid #bdc3c7;
    border-radius: 8px;
    color: #2c3e50;
    outline: none;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

input[type="text"]:focus,
input[type="number"]:focus,
input[type="date"]:focus,
textarea:focus,
select:focus {
    border-color: #27ae60;
    box-shadow: 0 0 8px rgba(39, 174, 96, 0.3);
}

textarea {
    resize: vertical;
}

button {
    padding: 12px;
    border: none;
    border-radius: 8px;
    color: #ffffff;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;
    transition: background-color 0.3s ease, transform 0.2s ease;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.submit-button {
    background-color: #27ae60;
}

.back-button {
    background-color: #2980b9;
    margin-top: 1rem;
}

button:hover {
    opacity: 0.9;
    transform: scale(1.03);
}

button:active {
    transform: scale(1);
}

button:focus {
    outline: 2px solid #27ae60;
}
</style>
