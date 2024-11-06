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
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f8f9fa;
    /* Màu nền sáng */
    font-family: 'Arial', sans-serif;
}

.form-wrapper {
    background-color: #ffffff;
    /* Màu nền ô nhập */
    padding: 40px;
    border-radius: 12px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

h2 {
    text-align: center;
    color: #2c3e50;
    /* Màu chữ tối */
    margin-bottom: 20px;
    font-size: 24px;
    font-weight: bold;
}

.input-group {
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

label {
    display: block;
    margin-bottom: 6px;
    font-size: 14px;
    color: #2c3e50;
    font-weight: 500;
}

input[type="text"],
input[type="password"] {
    width: 100%;
    padding: 12px;
    border: 1px solid #dfe6e9;
    /* Màu viền ô nhập */
    border-radius: 8px;
    font-size: 16px;
    background-color: #ffffff;
    outline: none;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
    box-sizing: border-box;
}

input[type="text"]:focus,
input[type="password"]:focus {
    border-color: #27ae60;
    /* Màu xanh lá nhấn mạnh */
    box-shadow: 0 0 8px rgba(39, 174, 96, 0.3);
}

.btn-login {
    width: 100%;
    background-color: #27ae60;
    /* Màu xanh lá */
    color: #fff;
    padding: 12px;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
    margin-top: 20px;
    font-weight: 600;
    transition: background-color 0.3s ease, transform 0.1s ease;
}

.btn-login:hover {
    background-color: #2ecc71;
    /* Màu khi hover */
    transform: translateY(-2px);
}

.btn-login:active {
    transform: translateY(1px);
}

.error {
    color: #e74c3c;
    /* Màu đỏ cho thông báo lỗi */
    text-align: center;
    margin-top: 10px;
    font-size: 14px;
    font-weight: bold;
}

.forgot-password {
    text-align: center;
    margin-top: 10px;
    font-size: 14px;
}

.forgot-password a {
    color: #27ae60;
    text-decoration: none;
    transition: color 0.3s;
}

.forgot-password a:hover {
    text-decoration: underline;
    color: #2ecc71;
}

.form-wrapper:hover {
    box-shadow: 0 8px 40px rgba(0, 0, 0, 0.15);
    transform: scale(1.02);
}

/* Hiệu ứng mờ dần cho thông báo lỗi */
.error {
    animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}
</style>
