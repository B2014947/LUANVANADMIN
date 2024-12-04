<template>
    <div class="profile-container">
        <h2><i class="fas fa-user-circle"></i> Thông tin cá nhân</h2>

        <!-- Avatar Display -->
        <div class="avatar-container">
            <img :src="user.profilePicture || placeholderAvatar" alt="Ảnh đại diện" class="avatar" />
        </div>

        <div v-if="!isEditing" class="profile-view">
            <div class="info-group" v-for="(value, key) in user" :key="key">
                <label><i :class="getIconClass(key)"></i> {{ getFieldLabel(key) }}:</label>
                <span>{{ value }}</span>
            </div>
            <button @click="isEditing = true" class="btn-edit">
                <i class="fas fa-edit"></i> Chỉnh sửa thông tin
            </button>
        </div>

        <div v-if="isEditing" class="profile-edit">
            <form @submit.prevent="updateProfile">
                <div class="input-group" v-for="(value, key) in user" :key="key">
                    <label :for="key"><i :class="getIconClass(key)"></i> {{ getFieldLabel(key) }}</label>
                    <input v-model="user[key]" :id="key" :type="getInputType(key)" :disabled="key === 'username'"
                        :required="isFieldRequired(key)" />
                </div>
                <div class="button-group">
                    <button type="submit" class="btn-update">
                        <i class="fas fa-save"></i> Lưu thông tin
                    </button>
                    <button type="button" @click="isEditing = false" class="btn-cancel">
                        <i class="fas fa-times"></i> Hủy bỏ
                    </button>
                </div>
            </form>
        </div>

        <p v-if="successMessage" class="success"><i class="fas fa-check-circle"></i> {{ successMessage }}</p>
        <p v-if="errorMessage" class="error"><i class="fas fa-exclamation-circle"></i> {{ errorMessage }}</p>
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
                fullName: '',
                phoneNumber: '',
                address: '',
                dateOfBirth: '',
                gender: '',
                emergencyContact: '',
                addressDetails: '',
                profilePicture: ''
            },
            isEditing: false,
            successMessage: '',
            errorMessage: '',
            placeholderAvatar: 'https://via.placeholder.com/150' // Placeholder URL for avatar
        };
    },
    mounted() {
        this.fetchUserProfile();
    },
    methods: {
        getIconClass(key) {
            const icons = {
                username: 'fas fa-user',
                email: 'fas fa-envelope',
                fullName: 'fas fa-id-card',
                phoneNumber: 'fas fa-phone',
                address: 'fas fa-map-marker-alt',
                dateOfBirth: 'fas fa-calendar-alt',
                gender: 'fas fa-venus-mars',
                emergencyContact: 'fas fa-phone-alt',
                addressDetails: 'fas fa-map-marked-alt',
                profilePicture: 'fas fa-image'
            };
            return icons[key] || 'fas fa-info-circle';
        },
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
                    const data = await response.json();
                    this.user = {
                        username: data.Username,
                        email: data.Email,
                        fullName: data.FullName,
                        phoneNumber: data.PhoneNumber,
                        address: data.Address,
                        dateOfBirth: data.DateOfBirth,
                        gender: data.Gender,
                        emergencyContact: data.EmergencyContact,
                        addressDetails: data.AddressDetails,
                        profilePicture: data.ProfilePicture
                    };
                } else {
                    this.handleError(response);
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
                    this.clearMessageAfterDelay();
                    this.fetchUserProfile();
                    this.isEditing = false;
                } else {
                    this.handleError(response);
                }
            } catch (error) {
                this.errorMessage = 'Đã xảy ra lỗi trong quá trình cập nhật.';
                this.successMessage = '';
            }
        },

        clearMessageAfterDelay() {
            setTimeout(() => {
                this.successMessage = '';
                this.errorMessage = '';
            }, 3000);
        },

        handleError(response) {
            this.errorMessage = response.status === 404
                ? 'Không tìm thấy thông tin người dùng.'
                : 'Đã xảy ra lỗi. Vui lòng thử lại sau.';
            this.successMessage = '';
        },

        getFieldLabel(key) {
            const labels = {
                username: 'Tên người dùng',
                email: 'Email',
                fullName: 'Họ và tên',
                phoneNumber: 'Số điện thoại',
                address: 'Địa chỉ',
                dateOfBirth: 'Ngày sinh',
                gender: 'Giới tính',
                emergencyContact: 'Liên hệ khẩn cấp',
                addressDetails: 'Chi tiết địa chỉ',
                profilePicture: 'Ảnh đại diện'
            };
            return labels[key] || key;
        },

        getInputType(key) {
            switch (key) {
                case 'email':
                    return 'email';
                case 'dateOfBirth':
                    return 'date';
                case 'profilePicture':
                    return 'url';
                case 'gender':
                    return 'text';
                default:
                    return 'text';
            }
        },

        isFieldRequired(key) {
            return ['username', 'email', 'fullName'].includes(key);
        }
    }
};
</script>

<style scoped>
label i {
    margin-right: 8px;
    color: #00acc1;
    /* Màu xanh nổi bật */
}

.success i,
.error i {
    margin-right: 5px;
}

.profile-container {
    padding: 2rem;
    background-color: #b2ebf2;
    color: #004d40;
    border-radius: 12px;
    max-width: 800px;
    margin: auto;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    font-family: 'Arial', sans-serif;
    overflow: hidden;
    /* Ngăn không cho các phần tử vượt ngoài form */
}

h2 {
    text-align: center;
    margin-bottom: 1.5rem;
    font-weight: 700;
    color: #00acc1;
}

.avatar-container {
    display: flex;
    justify-content: center;
    margin-bottom: 1.5rem;
}

.avatar {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    object-fit: cover;
    border: 4px solid #00acc1;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
}

.avatar:hover {
    transform: scale(1.05);
}

.info-group,
.input-group {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
    word-wrap: break-word;
    /* Đảm bảo văn bản không bị tràn */
}

label {
    font-weight: 600;
    font-size: 14px;
    color: #004d40;
    flex-shrink: 0;
    width: 30%;
    white-space: nowrap;
    /* Đảm bảo không bị ngắt dòng */
    overflow: hidden;
    /* Ẩn đi phần tràn */
    text-overflow: ellipsis;
    /* Thêm dấu "..." nếu có quá dài */
}

span,
input {
    flex-grow: 1;
    padding: 10px;
    background-color: #e0f7fa;
    border: 1px solid #b2ebf2;
    border-radius: 6px;
    color: #004d40;
    transition: all 0.3s ease;
    max-width: calc(100% - 20px);
    /* Đảm bảo chúng không vượt ra ngoài form */
    overflow: hidden;
    text-overflow: ellipsis;
    /* Thêm dấu "..." khi giá trị quá dài */
}

input:focus {
    border-color: #00acc1;
    box-shadow: 0 0 8px rgba(0, 172, 193, 0.3);
}

.btn-edit,
.btn-update,
.btn-cancel {
    padding: 10px 16px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    transition: background-color 0.3s ease, transform 0.1s;
}

.btn-edit {
    background-color: #00acc1;
    color: #fff;
    display: block;
    width: 100%;
    text-align: center;
    margin-top: 1rem;
}

.btn-edit:hover {
    background-color: #008b9b;
    transform: translateY(-2px);
}

.btn-update {
    background-color: #0288d1;
    color: #fff;
}

.btn-update:hover {
    background-color: #0277bd;
}

.btn-cancel {
    background-color: #d32f2f;
    color: #fff;
}

.btn-cancel:hover {
    background-color: #b71c1c;
}

.button-group {
    display: flex;
    justify-content: space-between;
    margin-top: 1rem;
}

.success,
.error {
    text-align: center;
    margin-top: 10px;
    font-size: 14px;
    animation: fadeIn 0.5s ease-in-out;
    width: 100%;
    /* Đảm bảo các thông báo không vượt quá chiều rộng */
}

.success {
    color: #00acc1;
}

.error {
    color: #d32f2f;
}

/* Hiệu ứng mờ dần */
@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}
</style>
