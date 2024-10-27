<template>
    <div class="profile-container">
        <h2>Thông tin cá nhân</h2>

        <!-- Avatar Display -->
        <div class="avatar-container">
            <img :src="user.profilePicture || placeholderAvatar" alt="Ảnh đại diện" class="avatar" />
        </div>

        <div v-if="!isEditing" class="profile-view">
            <div class="info-group" v-for="(value, key) in user" :key="key">
                <label>{{ getFieldLabel(key) }}:</label>
                <span>{{ value }}</span>
            </div>
            <button @click="isEditing = true" class="btn-edit">Chỉnh sửa thông tin</button>
        </div>

        <div v-if="isEditing" class="profile-edit">
            <form @submit.prevent="updateProfile">
                <div class="input-group" v-for="(value, key) in user" :key="key">
                    <label :for="key">{{ getFieldLabel(key) }}</label>
                    <input v-model="user[key]" :id="key" :type="getInputType(key)" :disabled="key === 'username'"
                        :required="isFieldRequired(key)" />
                </div>
                <div class="button-group">
                    <button type="submit" class="btn-update">Lưu thông tin</button>
                    <button type="button" @click="isEditing = false" class="btn-cancel">Hủy bỏ</button>
                </div>
            </form>
        </div>

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
.profile-container {
    padding: 3rem;
    background-color: #2c3e50;
    color: #ecf0f1;
    border-radius: 12px;
    max-width: 600px;
    margin: auto;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
}

h2 {
    text-align: center;
    margin-bottom: 2rem;
    font-weight: 600;
    color: #ecf0f1;
}

.avatar-container {
    display: flex;
    justify-content: center;
    margin-bottom: 2rem;
}

.avatar {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    object-fit: cover;
    border: 4px solid #1abc9c;
}

.info-group,
.input-group {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.5rem;
}

label {
    font-weight: 500;
    font-size: 14px;
    color: #bdc3c7;
    flex-shrink: 0;
    width: 30%;
}

span,
input {
    flex-grow: 1;
    padding: 12px;
    background-color: #34495e;
    border: 1px solid #7f8c8d;
    border-radius: 6px;
    color: #ecf0f1;
    transition: all 0.3s ease;
}

input:focus {
    border-color: #1abc9c;
    box-shadow: 0 0 8px rgba(26, 188, 156, 0.5);
}

.btn-edit,
.btn-update,
.btn-cancel {
    padding: 8px 16px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.3s ease;
}

.btn-edit {
    background-color: #1abc9c;
    color: #fff;
    display: block;
    width: 100%;
    text-align: center;
    margin-top: 1.5rem;
}

.btn-update {
    background-color: #27ae60;
    color: #fff;
}

.btn-cancel {
    background-color: #c0392b;
    color: #fff;
}

.button-group {
    display: flex;
    justify-content: space-between;
    margin-top: 1.5rem;
}

.success,
.error {
    text-align: center;
    margin-top: 10px;
    font-size: 14px;
}

.success {
    color: #2ecc71;
}

.error {
    color: #e74c3c;
}
</style>
