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
    background: linear-gradient(135deg, #f0f4f8, #ffffff);
}

.form-wrapper {
    background-color: #ffffff;
    padding: 40px;
    border-radius: 10px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

h2 {
    text-align: center;
    color: #333;
    margin-bottom: 20px;
    font-size: 26px;
    font-weight: bold;
}

.input-group {
    margin-bottom: 20px;
}

label {
    display: block;
    margin-bottom: 6px;
    font-size: 14px;
    color: #555;
}

input[type="text"],
input[type="password"] {
    width: 100%;
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 16px;
    outline: none;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

input[type="text"]:focus,
input[type="password"]:focus {
    border-color: #ff8e3c;
    box-shadow: 0 0 8px rgba(255, 142, 60, 0.3);
}

.btn-login {
    width: 100%;
    background-color: #ff8e3c;
    color: #ffffff;
    padding: 12px;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    margin-top: 20px;
    transition: background-color 0.3s ease;
}

.btn-login:hover {
    background-color: #d9376e;
}

.error {
    color: #d9376e;
    text-align: center;
    margin-top: 10px;
    font-size: 14px;
}

.forgot-password {
    text-align: center;
    margin-top: 10px;
}

.forgot-password a {
    color: #ff8e3c;
    text-decoration: none;
}
dđ
.forgot-password a:hover {
    text-decoration: underline;
}
</style>
