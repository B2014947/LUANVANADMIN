<template>
    <div class="form-container">
        <h2>Thêm Người Dùng Mới</h2>
        <form @submit.prevent="addCustomer">
            <div class="form-group">
                <label for="username">Tên người dùng:</label>
                <input v-model="username" type="text" id="username" required />
            </div>
            <div class="form-group">
                <label for="fullName">Họ và tên:</label>
                <input v-model="fullName" type="text" id="fullName" required />
            </div>
            <div class="form-group">
                <label for="email">Email:</label>
                <input v-model="email" type="email" id="email" required />
            </div>
            <div class="form-group">
                <label for="phoneNumber">Số điện thoại:</label>
                <input v-model="phoneNumber" type="text" id="phoneNumber" />
            </div>
            <div class="form-group">
                <label for="password">Mật khẩu:</label>
                <input v-model="password" type="password" id="password" required />
            </div>
            <button type="submit" class="submit-button">Thêm người dùng</button>
        </form>
    </div>
</template>

<script>
export default {
    name: 'AddCustomer',
    data() {
        return {
            username: '',
            fullName: '',
            email: '',
            phoneNumber: '',
            password: '' // Chỉ cần trường mật khẩu và các trường khác
        };
    },
    methods: {
        async addCustomer() {
            try {
                const response = await fetch('http://localhost:5000/api/AccountCustomer/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username: this.username,
                        fullName: this.fullName,
                        email: this.email,
                        phoneNumber: this.phoneNumber,
                        password: this.password // Gửi mật khẩu lên server
                    })
                });

                if (response.ok) {
                    alert('Người dùng mới đã được thêm.');
                    this.$router.push('/admin/users');
                } else {
                    const errorData = await response.json();
                    alert(`Lỗi: ${errorData.message}`);
                }
            } catch (error) {
                console.error('Error adding user:', error);
            }
        }
    }
};
</script>

<style scoped>
.form-container {
    max-width: 600px;
    margin: auto;
    padding: 20px;
    background-color: #f7f9fc;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

h2 {
    text-align: center;
    color: #34495e;
}

.form-group {
    margin-bottom: 15px;
}

label {
    display: block;
    font-weight: bold;
    color: #34495e;
    margin-bottom: 5px;
}

input {
    width: 100%;
    padding: 10px;
    border: 1px solid #bdc3c7;
    border-radius: 4px;
}

.submit-button {
    display: block;
    width: 100%;
    padding: 10px;
    background-color: #2ecc71;
    color: white;
    font-weight: bold;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.submit-button:hover {
    background-color: #27ae60;
}
</style>