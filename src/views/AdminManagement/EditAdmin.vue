<template>
    <div class="admin-details-container">
        <h2>Cập nhật thông tin quản trị viên</h2>

        <div v-if="admin">
            <form @submit.prevent="updateAdmin" class="admin-form">
                <div class="info-group">
                    <p><strong>ID:</strong> {{ admin.AdminId }}</p>
                    <p><strong>Tên người dùng:</strong> {{ admin.Username }}</p>
                </div>

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
                    <strong>Căn cước công dân:</strong>
                    <input type="text" v-model="admin.identityCard" required />
                </label>

                <label>
                    <strong>Chi tiết địa chỉ:</strong>
                    <input type="text" v-model="admin.addressDetails" />
                </label>

                <label>
                    <strong>Hình đại diện:</strong>
                    <input type="file" @change="handleFileUpload" />
                </label>

                <div v-if="previewImage" class="image-preview">
                    <p>Hình ảnh hiện tại:</p>
                    <img :src="getProfilePictureUrl(previewImage)" alt="Profile Picture" />
                </div>
            </form>
        </div>
        <label>
            <strong>Mật khẩu mới:</strong>
            <input type="password" v-model="newPassword" />
        </label>

        <label>
            <strong>Xác nhận mật khẩu:</strong>
            <input type="password" v-model="confirmPassword" />
        </label>
        <button type="button" class="save-button" @click="updateAdmin">Lưu thay đổi</button>
        <button class="back-button" @click="$router.push({ name: 'AdminManagement' })">Quay lại</button>
    </div>
</template>

<script>
export default {
    name: 'AdminDetails',
    data() {
        return {
            admin: {
                AdminId: null,
                Username: '',
                fullName: '',
                email: '',
                phoneNumber: '',
                address: '',
                dateOfBirth: '',
                gender: '',
                emergencyContact: '',
                addressDetails: '',
                identityCard: '',
                profilePicture: ''
            },
            newPassword: '',
            confirmPassword: '',
            previewImage: '' // Biến để lưu trữ đường dẫn hình ảnh
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
                const adminData = await response.json();

                // Chuyển đổi dữ liệu từ API thành dạng mà Vue.js cần
                this.admin = {
                    AdminId: adminData.AdminId,
                    Username: adminData.Username,
                    fullName: adminData.FullName,
                    email: adminData.Email,
                    phoneNumber: adminData.PhoneNumber,
                    address: adminData.Address,
                    dateOfBirth: adminData.DateOfBirth ? this.formatDateToInputValue(adminData.DateOfBirth) : '',
                    gender: adminData.Gender,
                    emergencyContact: adminData.EmergencyContact,
                    addressDetails: adminData.AddressDetails,
                    profilePicture: adminData.ProfilePicture,
                    identityCard: adminData.IdentityCard
                };

                // Hiển thị hình ảnh hiện tại
                this.previewImage = adminData.ProfilePicture;
            } catch (error) {
                console.error('Error fetching admin details:', error);
            }
        },
        getProfilePictureUrl(picture) {
            if (picture) {
                // Kiểm tra nếu `picture` là URL đầy đủ (bắt đầu bằng "http" hoặc "blob")
                if (picture.startsWith('http') || picture.startsWith('blob')) {
                    return picture; // Trả về URL đầy đủ
                }
                // Nếu không, tạo URL từ tên tệp
                return `http://localhost:5000/uploads/${picture}`;
            }
            return ''; // Trả về chuỗi rỗng nếu không có ảnh
        },
        formatDateToInputValue(dateString) {
            const date = new Date(dateString);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        },

        handleFileUpload(event) {
            const file = event.target.files[0];
            if (file) {
                this.admin.profilePicture = URL.createObjectURL(file);
                this.previewImage = this.admin.profilePicture;
            }
        },

        async updateAdmin() {
            if (this.newPassword && this.newPassword !== this.confirmPassword) {
                alert('Mật khẩu xác nhận không khớp.');
                return;
            }

            // Gắn mật khẩu mới vào thông tin gửi nếu có
            if (this.newPassword) {
                this.admin.password = this.newPassword;
            }

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
                    this.newPassword = '';
                    this.confirmPassword = '';
                } else {
                    throw new Error('Error updating admin details');
                }
            } catch (error) {
                console.error('Error updating admin details:', error);
            }
        }
    }
};
</script>

<style scoped>
.admin-details-container {
    padding: 2.5rem;
    background-color: #ffffff;
    color: #2c3e50;
    border-radius: 12px;
    max-width: 800px;
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

.admin-form {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    /* Thay đổi từ 2 cột sang 3 cột */
    gap: 2rem;
    margin-bottom: 1.5rem;
}

label {
    color: #2c3e50;
    font-weight: 600;
    margin-top: 1rem;
}

input[type="text"],
input[type="email"],
input[type="date"],
input[type="password"],
input[type="file"] {
    width: 100%;
    padding: 12px;
    margin-top: 5px;
    background-color: #ecf0f1;
    border: 1px solid #bdc3c7;
    border-radius: 8px;
    color: #2c3e50;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

input:focus {
    border-color: #27ae60;
    box-shadow: 0 0 8px rgba(39, 174, 96, 0.3);
}

.image-preview {
    margin-top: 1rem;
    text-align: center;
    grid-column: span 4;
    /* Chiếm toàn bộ 3 cột */
}

.image-preview img {
    width: 100px;
    /* Chỉnh kích thước nhỏ như avatar */
    height: 100px;
    border-radius: 50%;
    /* Làm tròn hình ảnh */
    object-fit: cover;
    /* Cắt ảnh sao cho không bị biến dạng */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    margin-top: 0.5rem;
}

button {
    padding: 12px 20px;
    color: #ffffff;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
    margin-top: 1rem;
    transition: background-color 0.3s ease, box-shadow 0.3s ease;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.save-button {
    background-color: #27ae60;
    width: 100%;
}

.back-button {
    background-color: #2980b9;
    width: 100%;
}

button:hover {
    background-color: #2ecc71;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
</style>
