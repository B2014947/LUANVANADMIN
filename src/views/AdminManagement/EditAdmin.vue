<template>
    <div class="admin-details-container">
        <h2>Thông tin quản trị viên</h2>

        <!-- Form chi tiết quản trị viên -->
        <div v-if="admin">
            <form @submit.prevent="updateAdmin" class="admin-form">
                <div class="info-group">
                    <p><strong>ID:</strong> {{ admin.AdminId }}</p>
                    <p><strong>Tên người dùng:</strong> {{ admin.Username }}</p>
                </div>

                <label>
                    <strong>Email:</strong>
                    <input type="email" v-model="admin.Email" required />
                </label>

                <label>
                    <strong>Trạng thái:</strong>
                    <select v-model="admin.IsActive">
                        <option :value="true">Hoạt động</option>
                        <option :value="false">Vô hiệu hóa</option>
                    </select>
                </label>

                <label>
                    <strong>Họ và tên:</strong>
                    <input type="text" v-model="admin.FullName" required />
                </label>

                <label>
                    <strong>Số điện thoại:</strong>
                    <input type="text" v-model="admin.PhoneNumber" />
                </label>

                <label>
                    <strong>Địa chỉ:</strong>
                    <input type="text" v-model="admin.Address" />
                </label>

                <label>
                    <strong>Ngày sinh:</strong>
                    <input type="date" v-model="admin.DateOfBirth" />
                </label>

                <label>
                    <strong>Giới tính:</strong>
                    <input type="text" v-model="admin.Gender" />
                </label>

                <label>
                    <strong>Liên hệ khẩn cấp:</strong>
                    <input type="text" v-model="admin.EmergencyContact" />
                </label>

                <button type="submit" class="save-button">Lưu thay đổi</button>
            </form>

            <!-- Form cập nhật mật khẩu -->
            <form @submit.prevent="updatePassword" class="password-update-form">
                <h3>Cập nhật mật khẩu</h3>

                <label>
                    <strong>Mật khẩu mới:</strong>
                    <input type="password" v-model="newPassword" required />
                </label>

                <label>
                    <strong>Xác nhận mật khẩu:</strong>
                    <input type="password" v-model="confirmPassword" required />
                </label>

                <button type="submit" class="update-password-button">Cập nhật mật khẩu</button>
            </form>
        </div>

        <button class="back-button" @click="$router.push({ name: 'AdminManagement' })">Quay lại</button>
    </div>
</template>

<script>
export default {
    name: 'AdminDetails',
    data() {
        return {
            admin: null,
            newPassword: '',
            confirmPassword: ''
        };
    },
    async created() {
        const adminId = this.$route.params.adminId;
        await this.fetchAdminDetails(adminId);
    },
    methods: {
        async fetchAdminDetails(adminId) {
            try {
                const response = await fetch(`http://localhost:5000/api/AccountAdmin/list/${adminId}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                this.admin = await response.json();
            } catch (error) {
                console.error('Error fetching admin details:', error);
            }
        },

        async updateAdmin() {
            try {
                const response = await fetch(`http://localhost:5000/api/AccountAdmin/update/${this.admin.AdminId}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(this.admin)
                });
                if (response.ok) {
                    alert('Thông tin quản trị viên đã được cập nhật thành công.');
                } else {
                    throw new Error('Error updating admin details');
                }
            } catch (error) {
                console.error('Error updating admin details:', error);
            }
        },

        async updatePassword() {
            if (this.newPassword !== this.confirmPassword) {
                alert('Mật khẩu xác nhận không khớp.');
                return;
            }

            try {
                const response = await fetch(`http://localhost:5000/api/AccountAdmin/update-password/${this.admin.AdminId}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ password: this.newPassword })
                });
                if (response.ok) {
                    alert('Mật khẩu đã được cập nhật thành công.');
                    this.newPassword = '';
                    this.confirmPassword = '';
                } else {
                    throw new Error('Error updating password');
                }
            } catch (error) {
                console.error('Error updating password:', error);
            }
        }
    }
};
</script>

<style scoped>
.admin-details-container {
    padding: 3rem;
    background-color: #2c3e50;
    color: #ecf0f1;
    border-radius: 12px;
    max-width: 600px;
    margin: auto;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
}

h2,
h3 {
    color: #ecf0f1;
    text-align: center;
    margin-bottom: 1.5rem;
}

.admin-form,
.password-update-form {
    display: flex;
    flex-direction: column;
    margin-bottom: 1.5rem;
}

label {
    color: #bdc3c7;
    font-weight: 500;
    margin-top: 1rem;
}

input[type="text"],
input[type="email"],
input[type="date"],
input[type="password"],
select {
    width: 100%;
    padding: 10px;
    margin-top: 5px;
    background-color: #34495e;
    border: 1px solid #7f8c8d;
    border-radius: 6px;
    color: #ecf0f1;
    transition: border-color 0.3s ease;
}

input:focus {
    border-color: #1abc9c;
    box-shadow: 0 0 8px rgba(26, 188, 156, 0.5);
}

.save-button,
.update-password-button,
.back-button {
    padding: 10px 20px;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 16px;
    margin-top: 1rem;
    transition: background-color 0.3s ease;
}

.save-button {
    background-color: #27ae60;
}

.update-password-button {
    background-color: #2980b9;
}

.back-button {
    background-color: #c0392b;
    width: 100%;
}

.save-button:hover,
.update-password-button:hover,
.back-button:hover {
    opacity: 0.9;
}

.info-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 1.5rem;
}
</style>
