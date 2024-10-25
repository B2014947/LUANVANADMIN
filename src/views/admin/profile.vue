<template>
    <div class="profile-container">
        <h2>Thông tin cá nhân</h2>
        <form @submit.prevent="updateProfile">
            <div class="input-group">
                <label for="username">Tên người dùng</label>
                <input type="text" v-model="user.username" id="username" required />
            </div>
            <div class="input-group">
                <label for="email">Email</label>
                <input type="email" v-model="user.email" id="email" required />
            </div>
            <div class="input-group">
                <label for="role">Vai trò</label>
                <input type="text" v-model="user.role" id="role" readonly />
            </div>
            <button type="submit" class="btn-update">Cập nhật thông tin</button>
        </form>
        <p v-if="successMessage" class="success">{{ successMessage }}</p>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </div>
</template>

<script>
export default {
    name: 'Profile',
    data() {
        return {
            user: {
                username: '',
                email: '',
                role: ''
            },
            successMessage: '',
            errorMessage: ''
        };
    },
    mounted() {
        this.fetchUserProfile();
    },
    methods: {
        async fetchUserProfile() {
            try {
                const response = await fetch('http://localhost:5000/api/AccountAdmin/profile', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    this.user = await response.json();
                } else {
                    this.errorMessage = 'Không thể tải thông tin người dùng.';
                }
            } catch (error) {
                this.errorMessage = 'Đã xảy ra lỗi khi tải thông tin.';
            }
        },
        async updateProfile() {
            try {
                const response = await fetch('http://localhost:5000/api/AccountAdmin/profile', {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(this.user)
                });

                if (response.ok) {
                    this.successMessage = 'Cập nhật thông tin thành công!';
                } else {
                    this.errorMessage = 'Không thể cập nhật thông tin.';
                }
            } catch (error) {
                this.errorMessage = 'Đã xảy ra lỗi trong quá trình cập nhật.';
            }
        }
    }
};
</script>

<style scoped>
.profile-container {
    padding: 2rem;
    background-color: #ecf0f1;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.input-group {
    margin-bottom: 20px;
}

label {
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
    color: #2a2a2a;
}

input[type="text"],
input[type="email"] {
    width: 100%;
    padding: 12px;
    border: 2px solid #ccc;
    border-radius: 6px;
    font-size: 16px;
    outline: none;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

input[type="text"]:focus,
input[type="email"]:focus {
    border-color: #ff8e3c;
    box-shadow: 0 0 8px rgba(255, 142, 60, 0.3);
}

.btn-update {
    width: 100%;
    background-color: #ff8e3c;
    color: white;
    padding: 12px;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.btn-update:hover {
    background-color: #d9376e;
}

.success {
    color: #27ae60;
    text-align: center;
    margin-top: 10px;
    font-size: 14px;
}

.error {
    color: #d9376e;
    text-align: center;
    margin-top: 10px;
    font-size: 14px;
}
</style>
