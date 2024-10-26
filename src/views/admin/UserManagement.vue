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
          <tr v-for="user in users" :key="user.UserId">
            <td>{{ user.UserId }}</td>
            <td>{{ user.Username }}</td>
            <td>{{ user.Email }}</td>
            <td>{{ user.Role }}</td>
            <td>
              <button class="view-button" @click="viewUserDetails(user.UserId)">Xem Chi Tiết</button>
              <button class="edit-button" @click="editUser(user.UserId)">Sửa</button>
              <button class="delete-button" @click="user.IsActive ? disableUser(user.UserId) : enableUser(user.UserId)">
                {{ user.IsActive ? 'Vô hiệu hóa' : 'Kích hoạt' }}
              </button>
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
    async fetchUsers() {
      try {
        const response = await fetch('http://localhost:5000/api/AccountCustomer/getuser', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        this.users = data;
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    },

    viewUserDetails(userId) {
      // Điều hướng đến trang chi tiết người dùng với `userId`
      this.$router.push({ name: 'CustomerDetails', params: { userId } });
    },

    editUser(userId) {
      this.$router.push({ name: 'EditCustomer', params: { userId } });
    },

    async disableUser(userId) {
      try {
        const response = await fetch(`http://localhost:5000/api/AccountCustomer/users/${userId}/disable`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        if (response.ok) {
          alert('Người dùng đã bị vô hiệu hóa.');
          this.fetchUsers();
        }
      } catch (error) {
        console.error('Error disabling user:', error);
      }
    },

    async enableUser(userId) {
      try {
        const response = await fetch(`http://localhost:5000/api/AccountCustomer/users/${userId}/enable`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        if (response.ok) {
          alert('Người dùng đã được kích hoạt.');
          this.fetchUsers();
        }
      } catch (error) {
        console.error('Error enabling user:', error);
      }
    },

    addUser() {
      this.$router.push({ name: 'AddCustomer' });
    }
  },
  mounted() {
    this.fetchUsers();
  }
};
</script>

<style scoped>
.user-management-container {
  padding: 20px;
  background-color: #ecf0f1;
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
  color: white;
}

tr:nth-child(even) {
  background-color: #f2f2f2;
}

.view-button,
.edit-button,
.delete-button,
.add-user-button {
  padding: 8px 12px;
  margin: 5px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.view-button {
  background-color: #8e44ad;
  color: white;
}

.edit-button {
  background-color: #3498db;
  color: white;
}

.delete-button {
  background-color: #e74c3c;
  color: white;
}

.add-user-button {
  background-color: #2ecc71;
  color: white;
  margin-top: 10px;
}

.view-button:hover {
  background-color: #7d3c98;
}

.edit-button:hover {
  background-color: #2980b9;
}

.delete-button:hover {
  background-color: #c0392b;
}

.add-user-button:hover {
  background-color: #27ae60;
}
</style>
