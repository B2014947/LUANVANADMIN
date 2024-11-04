<template>
    <div class="management-container">
        <h2 class="management-title">Admin Management</h2>
        <p class="description">Quản lý tài khoản quản trị viên tại đây.</p>

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
                            <button class="action-button view" @click="viewAdminDetails(admin.AdminId)">Xem Chi
                                Tiết</button>
                            <button class="action-button edit" @click="editAdmin(admin.AdminId)">Chỉnh Sửa</button>
                            <button class="action-button toggle"
                                @click="admin.IsActive ? lockAdmin(admin.AdminId) : unlockAdmin(admin.AdminId)">
                                {{ admin.IsActive ? 'Khóa' : 'Mở khóa' }}
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <button class="add-button" @click="addAdmin">Thêm Quản Trị Viên</button>
    </div>
</template>

<script>
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
            this.$router.push({ name: 'AdminDetails', params: { adminId, mode: 'edit' } });
        },


        async lockAdmin(adminId) {
            const confirmLock = window.confirm('Bạn có chắc chắn muốn khóa tài khoản này?');
            if (!confirmLock) return;

            try {
                const response = await fetch(`http://localhost:5000/api/AccountAdmin/lock/${adminId}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (response.ok) {
                    alert('Tài khoản đã bị khóa.');
                    this.fetchAdmins();
                }
            } catch (error) {
                console.error('Error locking admin:', error);
            }
        },

        async unlockAdmin(adminId) {
            const confirmUnlock = window.confirm('Bạn có chắc chắn muốn mở khóa tài khoản này?');
            if (!confirmUnlock) return;

            try {
                const response = await fetch(`http://localhost:5000/api/AccountAdmin/unlock/${adminId}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (response.ok) {
                    alert('Tài khoản đã được mở khóa.');
                    this.fetchAdmins();
                }
            } catch (error) {
                console.error('Error unlocking admin:', error);
            }
        },

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
    padding: 24px;
    background-color: #f9f9f9;
    border-radius: 12px;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
    font-family: 'Roboto', sans-serif;
    max-width: 1000px;
    margin: auto;
}

.management-title {
    font-size: 28px;
    font-weight: 700;
    color: #2d3e50;
    margin-bottom: 12px;
    text-align: center;
}

.description {
    font-size: 16px;
    color: #6c757d;
    margin-bottom: 24px;
    text-align: center;
}

.table-container {
    overflow-x: auto;
    margin-bottom: 24px;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
    background-color: #ffffff;
}

table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
}

thead th {
    background-color: #34495e;
    color: #ffffff;
    padding: 14px;
    text-align: left;
    font-weight: 500;
    border-radius: 8px 8px 0 0;
}

tbody td {
    padding: 12px;
    border-bottom: 1px solid #dee2e6;
    color: #2d3e50;
}

tbody tr:hover {
    background-color: #f4f6f8;
}

.status-active {
    color: #2ecc71;
}

.status-inactive {
    color: #e74c3c;
}

.action-button {
    padding: 8px 12px;
    margin: 3px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    color: #fff;
    transition: background-color 0.3s ease, transform 0.2s ease;
}

.view {
    background-color: #5a67d8;
}

.edit {
    background-color: #3498db;
}

.toggle {
    background-color: #e74c3c;
}

.action-button:hover {
    transform: scale(1.05);
}

.add-button {
    display: inline-block;
    padding: 12px 18px;
    font-size: 15px;
    font-weight: 600;
    background-color: #4caf50;
    color: #ffffff;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    margin-top: 12px;
    transition: background-color 0.3s ease, transform 0.2s ease;
}

.add-button:hover {
    background-color: #45a049;
    transform: scale(1.05);
}
</style>
