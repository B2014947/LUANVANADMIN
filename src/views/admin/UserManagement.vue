<template>
  <div class="user-management-container">
    <h2 class="user-management-title">User Management</h2>
    <p class="description">Quản lý người dùng tại đây.</p>

    <div class="user-table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên người dùng</th>
            <th>Email</th>
            <th>Vai trò</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.username }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.role }}</td>
            <td>
              <button class="edit-button" @click="editUser(user.id)">Sửa</button>
              <button class="delete-button" @click="deleteUser(user.id)">Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <button class="add-user-button" @click="addUser">Thêm Người Dùng</button>
  </div>
</template>

<script>
export default {
  name: 'UserManagement',
  data() {
    return {
      users: [] // Dữ liệu người dùng sẽ được lấy từ API
    };
  },
  methods: {
    editUser(userId) {
      // Chức năng sửa người dùng
      console.log(`Edit user with ID: ${userId}`);
    },
    deleteUser(userId) {
      // Chức năng xóa người dùng
      console.log(`Delete user with ID: ${userId}`);
    },
    addUser() {
      // Chức năng thêm người dùng
      console.log('Add new user');
    }
  },
  mounted() {
    // Gọi API để lấy danh sách người dùng
    this.fetchUsers();
  },
  async fetchUsers() {
    try {
      const response = await fetch('http://localhost:5000/api/users');
      this.users = await response.json();
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }
};
</script>

<style scoped>
.user-management-container {
  padding: 20px;
  background-color: #ecf0f1;
  /* Màu nền cho trang quản lý người dùng */
}

.user-management-title {
  font-size: 28px;
  font-weight: bold;
  color: #34495e;
  margin-bottom: 10px;
}

.description {
  font-size: 16px;
  color: #7f8c8d;
  margin-bottom: 20px;
}

.user-table {
  margin-bottom: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #bdc3c7;
  padding: 12px;
  text-align: left;
}

th {
  background-color: #34495e;
  /* Màu nền tiêu đề bảng */
  color: white;
  /* Màu chữ tiêu đề bảng */
}

tr:nth-child(even) {
  background-color: #f2f2f2;
  /* Màu nền cho hàng chẵn */
}

.edit-button,
.delete-button,
.add-user-button {
  padding: 8px 12px;
  margin: 5px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.edit-button {
  background-color: #3498db;
  /* Màu nút sửa */
  color: white;
}

.delete-button {
  background-color: #e74c3c;
  /* Màu nút xóa */
  color: white;
}

.add-user-button {
  background-color: #2ecc71;
  /* Màu nút thêm người dùng */
  color: white;
  margin-top: 10px;
}

.edit-button:hover {
  background-color: #2980b9;
  /* Hiệu ứng hover cho nút sửa */
}

.delete-button:hover {
  background-color: #c0392b;
  /* Hiệu ứng hover cho nút xóa */
}

.add-user-button:hover {
  background-color: #27ae60;
  /* Hiệu ứng hover cho nút thêm người dùng */
}
</style>
