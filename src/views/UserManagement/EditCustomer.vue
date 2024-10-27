<template>
    <div class="form-container">
        <h2 class="title">Chỉnh Sửa Thông Tin Người Dùng</h2>
        <form @submit.prevent="updateCustomer">
            <!-- Thông tin người dùng -->
            <div class="form-group">
                <label for="username">
                    <i class="icon fas fa-user"></i> Tên người dùng:
                </label>
                <input v-model="username" type="text" id="username" disabled />
            </div>
            <div class="form-group">
                <label for="fullName">
                    <i class="icon fas fa-id-card"></i> Họ và tên:
                </label>
                <input v-model="fullName" type="text" id="fullName" required />
            </div>
            <div class="form-group">
                <label for="email">
                    <i class="icon fas fa-envelope"></i> Email:
                </label>
                <input v-model="email" type="email" id="email" required />
            </div>
            <div class="form-group">
                <label for="phoneNumber">
                    <i class="icon fas fa-phone"></i> Số điện thoại:
                </label>
                <input v-model="phoneNumber" type="text" id="phoneNumber" />
            </div>

            <!-- Trường nhập mật khẩu mới (nếu cần) -->
            <div class="form-group">
                <label for="newPassword">
                    <i class="icon fas fa-lock"></i> Mật khẩu mới:
                </label>
                <input v-model="newPassword" type="password" id="newPassword"
                    placeholder="Để trống nếu không thay đổi" />
            </div>

            <!-- Nút cập nhật thông tin -->
            <button type="submit" class="submit-button">Cập nhật thông tin</button>
        </form>
    </div>
</template>

<script>
export default {
    name: 'EditCustomer',
    data() {
        return {
            userId: null,
            username: '',
            fullName: '',
            email: '',
            phoneNumber: '',
            newPassword: '', // Thêm trường cho mật khẩu mới
        };
    },

    async mounted() {
        this.userId = this.$route.params.userId;
        if (this.userId) {
            await this.fetchUserDetails();
        } else {
            console.error("User ID is missing");
        }
    },
    methods: {
        async fetchUserDetails() {
            try {
                const response = await fetch(`http://localhost:5000/api/AccountCustomer/users/${this.userId}`);
                if (!response.ok) throw new Error('Failed to fetch user details');

                const userData = await response.json();
                this.username = userData.user.Username || '';
                this.fullName = userData.user.FullName || '';
                this.email = userData.user.Email || '';
                this.phoneNumber = userData.user.PhoneNumber || '';
            } catch (error) {
                console.error('Error fetching user details:', error);
                alert('Không thể tải thông tin người dùng. Vui lòng thử lại sau.');
            }
        },

        async updateCustomer() {
            try {
                const response = await fetch(`http://localhost:5000/api/AccountCustomer/users/${this.userId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        fullName: this.fullName,
                        email: this.email,
                        phoneNumber: this.phoneNumber,
                        newPassword: this.newPassword || null // Gửi newPassword nếu có, nếu không thì gửi null
                    })
                });

                if (response.ok) {
                    alert('Thông tin người dùng đã được cập nhật.');
                    this.$router.push('/admin/users');
                } else {
                    const errorData = await response.json();
                    alert(`Lỗi: ${errorData.message}`);
                }
            } catch (error) {
                console.error('Error updating user:', error);
                alert('Cập nhật thất bại. Vui lòng thử lại sau.');
            }
        },
    }
};
</script>




<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css');

.form-container {
    max-width: 600px;
    margin: auto;
    padding: 30px;
    background: linear-gradient(135deg, #f0f4f8, #ffffff);
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    font-family: 'Arial', sans-serif;
}

.title,
.subtitle {
    text-align: center;
    color: #34495e;
    font-weight: 600;
    margin-bottom: 20px;
}

.form-group {
    margin-bottom: 20px;
    position: relative;
}

label {
    font-weight: bold;
    color: #34495e;
    margin-bottom: 5px;
    display: block;
}

.icon {
    color: #3498db;
    margin-right: 5px;
}

input {
    width: 100%;
    padding: 12px 15px;
    border: 1px solid #dce1e6;
    border-radius: 8px;
    font-size: 15px;
    outline: none;
    transition: border 0.3s ease;
}

input:focus {
    border: 1px solid #3498db;
    box-shadow: 0 0 5px rgba(52, 152, 219, 0.3);
}

.submit-button,
.address-button {
    display: block;
    width: 100%;
    padding: 12px;
    background-color: #3498db;
    color: #ffffff;
    font-weight: bold;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
    margin-top: 10px;
    transition: background-color 0.3s ease;
}

.submit-button:hover,
.address-button:hover {
    background-color: #2980b9;
}
</style>
