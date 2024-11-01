<template>
    <div class="create-admin-container">
        <h2><i class="fas fa-user-plus"></i> Tạo mới tài khoản quản trị viên</h2>
        <form @submit.prevent="createAdmin" class="create-admin-form" enctype="multipart/form-data">
            <label>
                <strong>Tên người dùng:</strong>
                <input type="text" v-model="admin.username" required />
            </label>

            <label>
                <strong>Mật khẩu:</strong>
                <input type="password" v-model="admin.password" required />
            </label>

            <label>
                <strong>Họ và tên:</strong>
                <input type="text" v-model="admin.fullName" required />
            </label>

            <label>
                <strong>Email:</strong>
                <input type="email" v-model="admin.email" required />
            </label>

            <label>
                <strong>Số điện thoại:</strong>
                <input type="text" v-model="admin.phoneNumber" />
            </label>

            <label>
                <strong>Địa chỉ:</strong>
                <input type="text" v-model="admin.address" />
            </label>

            <label>
                <strong>Ngày sinh:</strong>
                <input type="date" v-model="admin.dateOfBirth" />
            </label>

            <label>
                <strong>Giới tính:</strong>
                <input type="text" v-model="admin.gender" />
            </label>

            <label>
                <strong>Liên hệ khẩn cấp:</strong>
                <input type="text" v-model="admin.emergencyContact" />
            </label>

            <label>
                <strong>Chi tiết địa chỉ:</strong>
                <input type="text" v-model="admin.addressDetails" />
            </label>

            <label>
                <strong>Hình đại diện:</strong>
                <input type="file" name="profilePicture" @change="handleFileUpload" />
            </label>

            <div v-if="previewImage" class="image-preview">
                <p>Hình ảnh tải lên:</p>
                <img :src="previewImage" alt="Profile Picture" />
            </div>

            <button type="submit" class="submit-button">Tạo tài khoản</button>
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
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

.create-admin-container {
    padding: 3rem;
    background-color: #2c3e50;
    color: #ecf0f1;
    border-radius: 12px;
    max-width: 600px;
    margin: auto;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
    font-family: 'Arial', sans-serif;
}

h2 {
    color: #ecf0f1;
    text-align: center;
    margin-bottom: 1.5rem;
    font-weight: 600;
}

.create-admin-form {
    display: flex;
    flex-direction: column;
}

label {
    color: #bdc3c7;
    font-weight: 500;
    margin-top: 1rem;
}

input[type="text"],
input[type="email"],
input[type="password"],
input[type="date"],
input[type="file"] {
    width: 100%;
    padding: 10px;
    margin-top: 5px;
    background-color: #34495e;
    border: 1px solid #7f8c8d;
    border-radius: 6px;
    color: #ecf0f1;
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
    padding: 10px 20px;
    background-color: #27ae60;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 16px;
    margin-top: 1.5rem;
    width: 100%;
    transition: background-color 0.3s ease;
}

.submit-button:hover {
    background-color: #2ecc71;
}

.back-button {
    padding: 10px 20px;
    background-color: #2980b9;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 16px;
    margin-top: 1rem;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s ease;
}

.back-button:hover {
    background-color: #3498db;
}

.back-button i {
    margin-right: 8px;
}
</style>
