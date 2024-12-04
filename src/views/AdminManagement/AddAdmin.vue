<template>
    <div class="create-admin-container">
        <h2><i class="fas fa-user-plus"></i> Tạo mới tài khoản quản trị viên</h2>
        <form @submit.prevent="createAdmin" class="create-admin-form" enctype="multipart/form-data">

            <label>
                <strong><i class="fas fa-user"></i> Tên người dùng:</strong>
                <input type="text" v-model="admin.username" placeholder="Nhập tên người dùng" required />
                <div class="input-description">Tên người dùng sẽ được dùng để đăng nhập vào hệ thống.</div>
            </label>

            <label>
                <strong><i class="fas fa-lock"></i> Mật khẩu:</strong>
                <input type="password" v-model="admin.password" placeholder="Nhập mật khẩu" required />
                <div class="input-description">Mật khẩu phải có ít nhất 6 ký tự.</div>
            </label>

            <label>
                <strong><i class="fas fa-id-card"></i> Họ và tên:</strong>
                <input type="text" v-model="admin.fullName" placeholder="Nhập họ và tên đầy đủ" required />
                <div class="input-description">Vui lòng nhập tên đầy đủ của bạn.</div>
            </label>

            <label>
                <strong><i class="fas fa-envelope"></i> Email:</strong>
                <input type="email" v-model="admin.email" placeholder="Nhập email" required />
                <div class="input-description">Email sẽ được dùng gửi thông tin công việc.</div>
            </label>

            <label>
                <strong><i class="fas fa-phone"></i> Số điện thoại:</strong>
                <input type="text" v-model="admin.phoneNumber" placeholder="Nhập số điện thoại" />
                <div class="input-description">Số điện thoại để liên hệ nếu cần thiết.</div>
            </label>

            <label>
                <strong><i class="fas fa-map-marker-alt"></i> Địa chỉ:</strong>
                <input type="text" v-model="admin.address" placeholder="Nhập địa chỉ nơi ở" />
                <div class="input-description">Địa chỉ sẽ được dùng trong các giao dịch cần thiết.</div>
            </label>

            <label>
                <strong><i class="fas fa-calendar-alt"></i> Ngày sinh:</strong>
                <input type="date" v-model="admin.dateOfBirth" required />
                <div class="input-description">Ngày sinh của bạn (VD: 01/01/1990).</div>
            </label>

            <label>
                <strong><i class="fas fa-venus-mars"></i> Giới tính:</strong>
                <input type="text" v-model="admin.gender" placeholder="Nhập giới tính" />
                <div class="input-description">Vui lòng nhập giới tính của bạn.</div>
            </label>

            <label>
                <strong><i class="fas fa-phone-square-alt"></i> Liên hệ khẩn cấp:</strong>
                <input type="text" v-model="admin.emergencyContact" placeholder="Nhập người liên hệ khẩn cấp" />
                <div class="input-description">Đây là người bạn cần chúng tôi liên hệ trong trường hợp khẩn cấp.</div>
            </label>

            <label>
                <strong><i class="fas fa-address-book"></i> Chi tiết địa chỉ:</strong>
                <input type="text" v-model="admin.addressDetails" placeholder="Nhập chi tiết địa chỉ" />
                <div class="input-description">Thông tin chi tiết về địa chỉ của bạn.</div>
            </label>

            <label>
                <strong><i class="fas fa-id-card"></i> Căn cước công dân:</strong>
                <input type="text" v-model="admin.identityCard" maxlength="12" pattern="\d{12}" required
                    title="Căn cước công dân phải gồm 12 chữ số" placeholder="Nhập số căn cước công dân" />
                <div class="input-description">Số căn cước công dân phải bao gồm 12 chữ số.</div>
            </label>

            <label>
                <strong><i class="fas fa-image"></i> Hình đại diện:</strong>
                <input type="file" name="profilePicture" @change="handleFileUpload" />
                <div class="input-description">Chọn ảnh đại diện cho tài khoản quản trị viên.</div>
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
                identityCard: '',
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
.input-description {
    font-size: 0.9em;
    color: #666;
    margin-top: 5px;
}

.create-admin-container {
    padding: 2.5rem;
    background-color: #ffffff;
    color: #2c3e50;
    border-radius: 12px;
    max-width: 900px;
    /* Điều chỉnh lại chiều rộng tổng thể */
    margin: 40px auto;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    font-family: 'Roboto', sans-serif;
}

h2 {
    color: #27ae60;
    text-align: center;
    margin-bottom: 1.5rem;
    font-weight: 700;
}

.create-admin-form {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2.5rem;
    /* Tăng khoảng cách giữa các trường */
}

label {
    color: #2c3e50;
    font-weight: 500;
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
    background-color: #f4f4f4;
    border: 1px solid #7f8c8d;
    border-radius: 8px;
    color: #2c3e50;
    font-size: 15px;
    outline: none;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

input:focus {
    border-color: #27ae60;
    box-shadow: 0 0 8px rgba(39, 174, 96, 0.3);
}

.image-preview {
    margin-top: 1rem;
    text-align: center;
    grid-column: span 2;
    /* Chiếm cả 2 cột cho phần xem ảnh */
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
    color: #ffffff;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
    margin-top: 1.5rem;
    width: 100%;
    grid-column: span 2;
    /* Nút tạo tài khoản chiếm cả 2 cột */
    transition: background-color 0.3s ease, box-shadow 0.3s ease;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.submit-button:hover {
    background-color: #219150;
    box-shadow: 0 4px 8px rgba(39, 174, 96, 0.3);
}

.back-button {
    padding: 12px;
    background-color: #2980b9;
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
    box-shadow: 0 4px 8px rgba(41, 128, 185, 0.3);
}

.back-button i {
    margin-right: 8px;
}
</style>
