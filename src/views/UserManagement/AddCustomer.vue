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
    padding: 2rem;
    background-color: var(--main-bg-color);
    color: var(--text-color);
    border-radius: 12px;
    max-width: 600px;
    margin: 40px auto;
    box-shadow: 0 4px 12px var(--shadow-color);
    font-family: 'Roboto', sans-serif;
}

h2 {
    text-align: center;
    color: var(--text-color);
    font-weight: 700;
    margin-bottom: 20px;
}

.form-group {
    margin-bottom: 20px;
}

label {
    font-weight: 600;
    color: var(--text-color);
    margin-bottom: 5px;
    display: block;
}

input {
    width: 95%;
    padding: 12px 15px;
    border: 1px solid #bdc3c7;
    border-radius: 8px;
    background-color: var(--secondary-bg-color);
    color: var(--text-color);
    font-size: 15px;
    outline: none;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

input:focus {
    border: 1px solid var(--highlight-color);
    box-shadow: 0 0 8px rgba(39, 174, 96, 0.5);
}

.submit-button {
    display: block;
    width: 100%;
    padding: 12px;
    background-color: var(--accent-color);
    color: #ffffff;
    font-weight: bold;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
    margin-top: 10px;
    transition: background-color 0.3s ease, transform 0.2s ease;
}

.submit-button:hover {
    background-color: var(--hover-bg-color);
    transform: scale(1.02);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}
</style>