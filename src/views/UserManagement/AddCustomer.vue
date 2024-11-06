<template>
    <div class="form-container">
        <h2><i class="fas fa-user-plus"></i> Thêm Người Dùng Mới</h2>
        <form @submit.prevent="addCustomer">
            <div class="form-group">
                <label for="username"> <i class="icon fas fa-user"></i> Tên người dùng:</label>
                <input v-model="username" type="text" id="username" required />
            </div>
            <div class="form-group">
                <label for="fullName"><i class="icon fas fa-id-card"></i> Họ và tên:</label>
                <input v-model="fullName" type="text" id="fullName" required />
            </div>
            <div class="form-group">
                <label for="email"><i class="icon fas fa-envelope"></i> Email:</label>
                <input v-model="email" type="email" id="email" required />
            </div>
            <div class="form-group">
                <label for="phoneNumber"><i class="icon fas fa-phone"></i> Số điện thoại:</label>
                <input v-model="phoneNumber" type="text" id="phoneNumber" />
            </div>
            <div class="form-group">
                <label for="password"><i class="icon fas fa-lock"></i> Mật khẩu:</label>
                <input v-model="password" type="password" id="password" required />
            </div>
            <button type="submit" class="submit-button">
                <i class="fas fa-user-plus"></i> Thêm người dùng
            </button>
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
    padding: 2rem;
    background-color: #ffffff;
    /* Nền sáng */
    color: #2c3e50;
    /* Màu chữ chính */
    border-radius: 12px;
    max-width: 600px;
    margin: 40px auto;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    font-family: 'Roboto', sans-serif;
}

h2 {
    text-align: center;
    color: #2c3e50;
    font-weight: 700;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
}

h2 i {
    margin-right: 8px;
    color: #27ae60;
    /* Màu xanh lá cho icon tiêu đề */
}

.form-group {
    margin-bottom: 20px;
}

label {
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 5px;
    display: block;
}

input {
    width: 95%;
    padding: 12px 15px;
    border: 1px solid #bdc3c7;
    border-radius: 8px;
    background-color: #f4f4f4;
    /* Nền xám nhạt cho input */
    color: #2c3e50;
    font-size: 15px;
    outline: none;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

input:focus {
    border: 1px solid #27ae60;
    /* Màu xanh nhấn khi focus */
    box-shadow: 0 0 8px rgba(39, 174, 96, 0.5);
}

.submit-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 12px;
    background-color: #27ae60;
    /* Màu xanh lá cho nút submit */
    color: #ffffff;
    font-weight: bold;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
    margin-top: 10px;
    transition: background-color 0.3s ease, transform 0.2s ease;
}

.submit-button i {
    margin-right: 8px;
}

.submit-button:hover {
    background-color: #219150;
    /* Màu xanh lá đậm khi hover */
    transform: scale(1.02);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}
</style>