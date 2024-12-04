<template>
    <div class="management-container">
        <h2 class="management-title">Quản lý nhân viên quản lý</h2>
        <p class="description">Quản lý tài khoản quản trị viên tại đây.</p>
        <button class="add-button" @click="addAdmin">
            <i class="fas fa-user-plus"></i> Thêm Quản Trị Viên
        </button>
        <br>
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tên người dùng</th>
                        <th>Email</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="admin in admins" :key="admin.AdminId">
                        <td>{{ admin.AdminId }}</td>
                        <td>{{ admin.Username }}</td>
                        <td>{{ admin.Email }}</td>
                        <td>{{ admin.IsActive ? 'Hoạt động' : 'Vô hiệu hóa' }}</td>
                        <td>
                            <button class="action-button view" @click="viewAdminDetails(admin.AdminId)">
                                <i class="fas fa-eye"></i> Xem Chi Tiết
                            </button>
                            <button class="action-button edit" @click="editAdmin(admin.AdminId)">
                                <i class="fas fa-edit"></i> Chỉnh Sửa
                            </button>
                            <button class="action-button toggle"
                                @click="admin.IsActive ? lockAdmin(admin.AdminId, admin.Username) : unlockAdmin(admin.AdminId, admin.Username)">
                                <i :class="admin.IsActive ? 'fas fa-lock' : 'fas fa-unlock'"></i>
                                {{ admin.IsActive ? 'Khóa' : 'Mở khóa' }}
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import Swal from 'sweetalert2';

export default {
    name: 'AdminManagement',
    data() {
        return {
            admins: []
        };
    },
    methods: {
        async fetchAdmins() {
            try {
                const response = await fetch('http://localhost:5000/api/AccountAdmin/list', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                this.admins = data;
            } catch (error) {
                console.error('Error fetching admins:', error);
            }
        },

        viewAdminDetails(adminId) {
            this.$router.push({ name: 'AdminDetails', params: { adminId } });
        },

        editAdmin(adminId) {
            this.$router.push({ name: 'EditAdmin', params: { adminId, mode: 'edit' } });
        },

        async lockAdmin(adminId, username) {
            const confirmLock = await Swal.fire({
                title: `Bạn có chắc chắn muốn khóa tài khoản của ${username} (ID: ${adminId})?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Khóa',
                cancelButtonText: 'Hủy'
            });

            if (!confirmLock.isConfirmed) return;

            try {
                const response = await fetch(`http://localhost:5000/api/AccountAdmin/lock/${adminId}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    Swal.fire('Đã khóa!', `Tài khoản của ${username} (ID: ${adminId}) đã bị khóa.`, 'success');
                    this.fetchAdmins();
                }
            } catch (error) {
                console.error('Error locking admin:', error);
            }
        }
        ,

        async unlockAdmin(adminId, username) {
            const confirmUnlock = await Swal.fire({
                title: `Bạn có chắc chắn muốn mở khóa tài khoản của ${username} (ID: ${adminId})?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Mở khóa',
                cancelButtonText: 'Hủy'
            });

            if (!confirmUnlock.isConfirmed) return;

            try {
                const response = await fetch(`http://localhost:5000/api/AccountAdmin/unlock/${adminId}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    Swal.fire('Đã mở khóa!', `Tài khoản của ${username} (ID: ${adminId}) đã được mở khóa.`, 'success');
                    this.fetchAdmins();
                }
            } catch (error) {
                console.error('Error unlocking admin:', error);
            }
        }
        ,

        addAdmin() {
            this.$router.push({ name: 'AddAdmin' });
        }
    },
    mounted() {
        this.fetchAdmins();
    }
};
</script>

<style scoped>
.management-container {
    padding: 2.5rem;
    background-color: #ffffff;
    /* Nền sáng */
    color: #2c3e50;
    /* Màu chữ chính */
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    font-family: 'Roboto', sans-serif;
    max-width: 1100px;
    margin: 40px auto;
}

.management-title {
    font-size: 32px;
    font-weight: bold;
    color: #27ae60;
    text-align: center;
    margin-bottom: 20px;
}

.description {
    font-size: 16px;
    color: #bdc3c7;
    text-align: center;
    margin-bottom: 24px;
}

.table-container {
    overflow-x: auto;
    border-radius: 12px;
    background-color: #f4f4f4;
    /* Nền sáng cho bảng */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
    background-color: #f4f4f4;
    /* Nền sáng cho bảng */
    border-radius: 6px;
}

thead th {
    background-color: #27ae60;
    /* Màu xanh lá cho tiêu đề bảng */
    color: #ffffff;
    padding: 14px;
    text-align: left;
    font-weight: 600;
    border-radius: 6px 6px 0 0;
}

tbody td {
    padding: 12px;
    border-bottom: 1px solid #7f8c8d;
    color: #2c3e50;
}

tbody tr:hover {
    background-color: #f1f8f5;
    /* Màu xanh lá nhạt khi hover */
    color: #ffffff;
}

.status-active {
    color: #2ecc71;
    /* Màu xanh cho trạng thái hoạt động */
    font-weight: 600;
}

.status-inactive {
    color: #e74c3c;
    /* Màu đỏ cho trạng thái vô hiệu hóa */
    font-weight: 600;
}

.action-button {
    padding: 8px 16px;
    margin: 3px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    color: #ffffff;
    transition: background-color 0.3s ease, transform 0.2s ease;
}

.view {
    background-color: #3498db;
    /* Màu xanh lam cho nút Xem Chi Tiết */
}

.edit {
    background-color: #f39c12;
    /* Màu cam cho chỉnh sửa */
}

.toggle {
    background-color: #e74c3c;
    /* Màu đỏ cho nút Khóa/Mở khóa */
}

.action-button:hover {
    transform: scale(1.05);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.add-button {
    display: block;
    width: fit-content;
    padding: 12px 18px;
    font-size: 15px;
    font-weight: 600;
    background-color: #27ae60;
    /* Màu xanh lá cho nút Thêm Quản Trị Viên */
    color: #ffffff;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    margin: 20px auto 0;
    text-align: center;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
    transition: background-color 0.3s ease, transform 0.2s ease;
}

.add-button:hover {
    background-color: #219150;
    /* Màu xanh lá đậm khi hover */
    transform: scale(1.05);
}
</style>
