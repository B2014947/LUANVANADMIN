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

.title,
.subtitle {
    text-align: center;
    color: #2c3e50;
    font-weight: 700;
    margin-bottom: 20px;
}

.form-group {
    margin-bottom: 20px;
    position: relative;
}

label {
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 5px;
    display: block;
}

.icon {
    color: #27ae60;
    /* Màu xanh lá cho icon */
    margin-right: 5px;
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
    display: block;
    width: 100%;
    padding: 12px;
    background-color: #27ae60;
    /* Màu xanh lá cho nút cập nhật */
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
    background-color: #219150;
    /* Màu xanh lá đậm khi hover */
    transform: scale(1.02);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}
</style>
