<template>
    <div class="admin-details-container">
        <h2><i class="fas fa-user-shield"></i> Thông tin quản trị viên</h2>
        <div v-if="admin">
            <div class="image-container">
                <img :src="getProfilePictureUrl(admin.ProfilePicture)" alt="Profile Picture"
                    v-if="admin.ProfilePicture" />
            </div>
            <div class="info-group">
                <p><strong><i class="fas fa-id-badge"></i> ID:</strong> {{ admin.AdminId }}</p>
                <p><strong><i class="fas fa-user"></i> Tên người dùng:</strong> {{ admin.Username }}</p>
                <p><strong><i class="fas fa-envelope"></i> Email:</strong> {{ admin.Email }}</p>
                <p><strong><i class="fas fa-toggle-on"></i> Trạng thái:</strong>
                    <span :class="admin.IsActive ? 'status-active' : 'status-inactive'">
                        {{ admin.IsActive ? 'Hoạt động' : 'Vô hiệu hóa' }}
                    </span>
                </p>
                <p><strong><i class="fas fa-address-card"></i> Họ và tên:</strong> {{ admin.FullName }}</p>
                <p><strong><i class="fas fa-phone"></i> Số điện thoại:</strong> {{ admin.PhoneNumber }}</p>
                <p><strong><i class="fas fa-map-marker-alt"></i> Địa chỉ:</strong> {{ admin.Address }}</p>
                <p><strong><i class="fas fa-birthday-cake"></i> Ngày sinh:</strong> {{ admin.DateOfBirth }}</p>
                <p><strong><i class="fas fa-venus-mars"></i> Giới tính:</strong> {{ admin.Gender }}</p>
                <p><strong><i class="fas fa-phone-square-alt"></i> Liên hệ khẩn cấp:</strong> {{ admin.EmergencyContact
                    }}</p>
            </div>
        </div>
        <div class="button-group">
            <button class="back-button" @click="$router.push({ name: 'AdminManagement' })">
                <i class="fas fa-arrow-left"></i> Quay lại
            </button>
            <button class="edit-button" @click="goToEditPage">
                <i class="fas fa-edit"></i> Chỉnh sửa
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AdminDetails',
    data() {
        return {
            admin: null
        };
    },
    async created() {
        const adminId = this.$route.params.adminId;
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
            console.log('Admin data:', this.admin); // Kiểm tra dữ liệu nhận được
        } catch (error) {
            console.error('Error fetching admin details:', error);
        }
    },
    methods: {
        goToEditPage() {
            this.$router.push({ name: 'EditAdmin', params: { adminId: this.admin.AdminId } });
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
        }

    }
};
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

.admin-details-container {
    padding: 3rem;
    background-color: #f7f9fc;
    /* Nền sáng */
    color: #2c3e50;
    /* Màu chữ tối */
    border-radius: 12px;
    max-width: 800px;
    margin: 40px auto;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    font-family: 'Roboto', sans-serif;
}

h2 {
    color: #27ae60;
    /* Màu chủ đạo */
    text-align: center;
    margin-bottom: 1.5rem;
    font-weight: 700;
}

.image-container {
    text-align: center;
    margin-bottom: 1.5rem;
}

.image-container img {
    max-width: 150px;
    height: auto;
    border-radius: 50%;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.info-group p {
    font-size: 16px;
    color: #34495e;
    /* Màu chữ tối hơn */
    margin-bottom: 1rem;
    display: block;
    /* Hiển thị dọc */
}

.info-group strong {
    font-weight: 600;
    margin-right: 5px;
}

.status-active {
    color: #2ecc71;
    /* Màu xanh lá */
    font-weight: 600;
}

.status-inactive {
    color: #e74c3c;
    /* Màu đỏ */
    font-weight: 600;
}

.button-group {
    display: flex;
    justify-content: flex-end;
    /* Căn chỉnh nút về bên phải */
    gap: 10px;
    margin-top: 20px;
}

.back-button,
.edit-button {
    padding: 8px 12px;
    /* Giảm padding để nút nhỏ hơn */
    border: none;
    border-radius: 6px;
    /* Giảm độ bo góc */
    cursor: pointer;
    color: #ffffff;
    font-size: 14px;
    /* Giảm kích thước font */
    display: flex;
    align-items: center;
    justify-content: center;
    width: auto;
    /* Đảm bảo chiều rộng vừa đủ với nội dung */
    min-width: 100px;
    /* Đặt chiều rộng tối thiểu để nút không quá nhỏ */
    transition: background-color 0.3s ease, box-shadow 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    /* Giảm shadow */
}

.back-button {
    background-color: #2980b9;
}

.edit-button {
    background-color: #27ae60;
}

.back-button:hover {
    background-color: #3498db;
    box-shadow: 0 2px 6px rgba(41, 128, 185, 0.2);
    /* Giảm shadow */
}

.edit-button:hover {
    background-color: #2ecc71;
    box-shadow: 0 2px 6px rgba(39, 174, 96, 0.2);
    /* Giảm shadow */
}

.back-button i,
.edit-button i {
    margin-right: 5px;
    /* Giảm khoảng cách giữa icon và text */
}
</style>
