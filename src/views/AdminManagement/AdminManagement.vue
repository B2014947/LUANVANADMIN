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
    padding: 2.5rem;
    background-color: var(--main-bg-color);
    color: var(--text-color);
    border-radius: 12px;
    box-shadow: 0 4px 12px var(--shadow-color);
    font-family: 'Roboto', sans-serif;
    max-width: 1100px;
    margin: 40px auto;
}

.management-title {
    font-size: 32px;
    font-weight: bold;
    color: var(--text-color);
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
    background-color: var(--secondary-bg-color);
    box-shadow: 0 4px 8px var(--shadow-color);
}

table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
    background-color: var(--secondary-bg-color);
    border-radius: 6px;
}

thead th {
    background-color: var(--highlight-color);
    color: #ffffff;
    padding: 14px;
    text-align: left;
    font-weight: 600;
    border-radius: 6px 6px 0 0;
}

tbody td {
    padding: 12px;
    border-bottom: 1px solid #7f8c8d;
    color: var(--text-color);
}

tbody tr:hover {
    background-color: var(--hover-bg-color);
    color: #ffffff;
}

.status-active {
    color: #2ecc71;
    font-weight: 600;
}

.status-inactive {
    color: #e74c3c;
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
    background-color: var(--accent-color);
}

.edit {
    background-color: #2980b9;
}

.toggle {
    background-color: #e74c3c;
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
    background-color: var(--button-bg-color);
    color: #ffffff;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    margin: 20px auto 0;
    text-align: center;
    box-shadow: 0 3px 6px var(--shadow-color);
    transition: background-color 0.3s ease, transform 0.2s ease;
}

.add-button:hover {
    background-color: var(--hover-bg-color);
    transform: scale(1.05);
}
</style>
