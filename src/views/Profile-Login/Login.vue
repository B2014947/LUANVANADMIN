<template>
    <div class="login-container">
        <div class="form-wrapper">
            <h2>Đăng nhập Admin</h2>
            <form @submit.prevent="handleLogin">
                <div class="input-group">
                    <label for="username">Tên người dùng</label>
                    <input type="text" v-model="username" id="username" placeholder="Nhập tên người dùng" required />
                </div>
                <div class="input-group">
                    <label for="password">Mật khẩu</label>
                    <input type="password" v-model="password" id="password" placeholder="Nhập mật khẩu" required />
                </div>
                <button type="submit" class="btn-login">Đăng nhập</button>
            </form>
            <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
            <p class="forgot-password"><a href="#">Quên mật khẩu?</a></p>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            username: '',
            password: '',
            errorMessage: '' // Biến để lưu trữ thông báo lỗi
        };
    },
    methods: {
        async handleLogin() {
            try {
                const response = await fetch('http://localhost:5000/api/AccountAdmin/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username: this.username,
                        password: this.password
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    // Lưu token vào localStorage
                    localStorage.setItem('token', data.token);

                    // Lưu thông tin người dùng vào localStorage
                    const decodedToken = JSON.parse(atob(data.token.split('.')[1]));
                    localStorage.setItem('user', JSON.stringify({
                        username: decodedToken.username,
                        role: decodedToken.role
                    }));

                    // Chuyển hướng đến dashboard admin
                    this.$router.push('/admin/dashboard');
                } else {
                    // Hiển thị thông báo lỗi
                    this.errorMessage = data.message;
                }
            } catch (error) {
                // Hiển thị lỗi nếu có vấn đề kết nối hoặc lỗi khác
                this.errorMessage = 'Đã xảy ra lỗi trong quá trình đăng nhập.';
            }
        }
    }
};
</script>

<style scoped>
:root {
    --main-bg-color: #f8f9fa;
    /* Màu nền sáng */
    --text-color: #2c3e50;
    /* Màu chữ tối */
    --highlight-color: #27ae60;
    /* Màu xanh lá nhấn mạnh */
    --accent-color: #3498db;
    /* Màu xanh lam nhấn */
    --hover-color: #2ecc71;
    /* Màu khi hover */
    --error-color: #e74c3c;
    /* Màu đỏ cho thông báo lỗi */
    --input-bg-color: #ffffff;
    /* Màu nền ô nhập */
    --input-border-color: #dfe6e9;
    /* Màu viền ô nhập */
}

.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: var(--main-bg-color);
}

.form-wrapper {
    background-color: var(--input-bg-color);
    padding: 40px;
    border-radius: 12px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    font-family: 'Arial', sans-serif;
}

h2 {
    text-align: center;
    color: var(--text-color);
    margin-bottom: 20px;
    font-size: 24px;
    font-weight: bold;
}

.input-group {
    margin-bottom: 20px;
}

label {
    display: block;
    margin-bottom: 6px;
    font-size: 14px;
    color: var(--text-color);
}

.input-group {
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    /* Đảm bảo các phần tử con hiển thị dọc */
    align-items: flex-start;
    /* Căn chỉnh phần tử con về bên trái */
}

input[type="text"],
input[type="password"] {
    width: 100%;
    /* Đảm bảo input chiếm hết chiều rộng cha */
    padding: 12px;
    border: 1px solid var(--input-border-color);
    border-radius: 8px;
    font-size: 16px;
    background-color: var(--input-bg-color);
    outline: none;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
    box-sizing: border-box;
    /* Đảm bảo padding không làm tăng chiều rộng input */
}


input[type="text"]:focus,
input[type="password"]:focus {
    border-color: var(--highlight-color);
    box-shadow: 0 0 8px rgba(39, 174, 96, 0.3);
}

.btn-login {
    width: 100%;
    background-color: var(--highlight-color);
    color: #fff;
    padding: 12px;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
    margin-top: 20px;
    transition: background-color 0.3s ease;
}

.btn-login:hover {
    background-color: var(--hover-color);
}

.error {
    color: var(--error-color);
    text-align: center;
    margin-top: 10px;
    font-size: 14px;
}

.forgot-password {
    text-align: center;
    margin-top: 10px;
}

.forgot-password a {
    color: var(--highlight-color);
    text-decoration: none;
}

.forgot-password a:hover {
    text-decoration: underline;
}
</style>
