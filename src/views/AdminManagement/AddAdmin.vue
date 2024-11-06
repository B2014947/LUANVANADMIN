<template>
    <div class="create-admin-container">
        <h2><i class="fas fa-user-plus"></i> Tạo mới tài khoản quản trị viên</h2>
        <form @submit.prevent="createAdmin" class="create-admin-form" enctype="multipart/form-data">
            <label>
                <strong><i class="fas fa-user"></i> Tên người dùng:</strong>
                <input type="text" v-model="admin.username" required />
            </label>

            <label>
                <strong><i class="fas fa-lock"></i> Mật khẩu:</strong>
                <input type="password" v-model="admin.password" required />
            </label>

            <label>
                <strong><i class="fas fa-id-card"></i> Họ và tên:</strong>
                <input type="text" v-model="admin.fullName" required />
            </label>

            <label>
                <strong><i class="fas fa-envelope"></i> Email:</strong>
                <input type="email" v-model="admin.email" required />
            </label>

            <label>
                <strong><i class="fas fa-phone"></i> Số điện thoại:</strong>
                <input type="text" v-model="admin.phoneNumber" />
            </label>

            <label>
                <strong><i class="fas fa-map-marker-alt"></i> Địa chỉ:</strong>
                <input type="text" v-model="admin.address" />
            </label>

            <label>
                <strong><i class="fas fa-calendar-alt"></i> Ngày sinh:</strong>
                <input type="date" v-model="admin.dateOfBirth" />
            </label>

            <label>
                <strong><i class="fas fa-venus-mars"></i> Giới tính:</strong>
                <input type="text" v-model="admin.gender" />
            </label>

            <label>
                <strong><i class="fas fa-phone-square-alt"></i> Liên hệ khẩn cấp:</strong>
                <input type="text" v-model="admin.emergencyContact" />
            </label>

            <label>
                <strong><i class="fas fa-address-book"></i> Chi tiết địa chỉ:</strong>
                <input type="text" v-model="admin.addressDetails" />
            </label>

            <label>
                <strong><i class="fas fa-image"></i> Hình đại diện:</strong>
                <input type="file" name="profilePicture" @change="handleFileUpload" />
            </label>

            <div v-if="previewImage" class="image-preview">
                <p>Hình ảnh tải lên:</p>
                <img :src="previewImage" alt="Profile Picture" />
            </div>

            <button type="submit" class="submit-button"><i class="fas fa-check-circle"></i> Tạo tài khoản</button>
        </form>

        <button class="back-button" @click="$router.push({ name: 'AdminManagement' })">
            <i class="fas fa-arrow-left"></i> Quay lại
        </button>
    </div>
</template>


<script>
export default {
    name: 'CreateAdmin',
    data() {
        return {
            admin: {
                username: '',
                password: '',
                fullName: '',
                email: '',
                phoneNumber: '',
                address: '',
                dateOfBirth: '',
                gender: '',
                emergencyContact: '',
                addressDetails: '',
                profilePicture: null
            },
            previewImage: null // Dùng để hiển thị ảnh tải lên
        };
    },
    methods: {
        handleFileUpload(event) {
            const file = event.target.files[0];
            if (file) {
                this.admin.profilePicture = file;
                this.previewImage = URL.createObjectURL(file);
            }
        },
        async createAdmin() {
            try {
                const formData = new FormData();
                formData.append('username', this.admin.username);
                formData.append('password', this.admin.password);
                formData.append('fullName', this.admin.fullName);
                formData.append('email', this.admin.email);
                formData.append('phoneNumber', this.admin.phoneNumber);
                formData.append('address', this.admin.address);
                formData.append('dateOfBirth', this.admin.dateOfBirth);
                formData.append('gender', this.admin.gender);
                formData.append('emergencyContact', this.admin.emergencyContact);
                formData.append('addressDetails', this.admin.addressDetails);

                // Kiểm tra và thêm hình đại diện
                if (this.admin.profilePicture) {
                    formData.append('profilePicture', this.admin.profilePicture);
                }

                const response = await fetch('http://localhost:5000/api/AccountAdmin/create', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: formData
                });

                if (response.ok) {
                    alert('Tài khoản admin đã được tạo thành công.');
                    this.$router.push({ name: 'AdminManagement' });
                } else {
                    const errorData = await response.json();
                    alert(`Lỗi: ${errorData.message}`);
                }
            } catch (error) {
                console.error('Error creating admin:', error);
                alert('Đã xảy ra lỗi trong quá trình tạo tài khoản.');
            }
        }
    }
};
</script>

<style scoped>
.create-admin-container {
    padding: 2.5rem;
    background-color: #ffffff;
    /* Nền sáng */
    color: #2c3e50;
    /* Màu chữ chính */
    border-radius: 12px;
    max-width: 700px;
    margin: 40px auto;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    font-family: 'Roboto', sans-serif;
}

h2 {
    color: #27ae60;
    /* Màu chủ đạo cho tiêu đề */
    text-align: center;
    margin-bottom: 1.5rem;
    font-weight: 700;
}

.create-admin-form {
    display: flex;
    flex-direction: column;
}

label {
    color: #2c3e50;
    /* Màu nhạt cho nhãn */
    font-weight: 500;
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
}

input[type="text"],
input[type="email"],
input[type="password"],
input[type="date"],
input[type="file"] {
    width: 100%;
    padding: 12px 15px;
    margin-top: 5px;
    background-color: #f4f4f4;
    /* Màu nền cho ô nhập */
    border: 1px solid #7f8c8d;
    border-radius: 8px;
    color: #2c3e50;
    /* Màu chữ */
    font-size: 15px;
    outline: none;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

input:focus {
    border-color: #27ae60;
    /* Màu xanh lá khi focus */
    box-shadow: 0 0 8px rgba(39, 174, 96, 0.3);
}

.image-preview {
    margin-top: 1rem;
    text-align: center;
}

.image-preview img {
    max-width: 150px;
    height: auto;
    border-radius: 50%;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.submit-button {
    padding: 12px;
    background-color: #27ae60;
    /* Màu xanh lá cho nút tạo tài khoản */
    color: #ffffff;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
    margin-top: 1.5rem;
    width: 100%;
    transition: background-color 0.3s ease, box-shadow 0.3s ease;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.submit-button:hover {
    background-color: #219150;
    /* Màu xanh lá đậm khi hover */
    box-shadow: 0 4px 8px rgba(39, 174, 96, 0.3);
}

.back-button {
    padding: 12px;
    background-color: #2980b9;
    /* Màu xanh lam cho nút quay lại */
    color: #ffffff;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
    margin-top: 1rem;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s ease, box-shadow 0.3s ease;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.back-button:hover {
    background-color: #3498db;
    /* Màu xanh lam đậm khi hover */
    box-shadow: 0 4px 8px rgba(41, 128, 185, 0.3);
}

.back-button i {
    margin-right: 8px;
}
</style>
