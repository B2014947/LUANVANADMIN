<template>
  <div class="management-container">
    <h2 class="management-title">Quản lý người dùng</h2>
    <p class="description">Quản lý người dùng tại đây.</p>
    <button class="add-button" @click="addUser">
      <i class="fas fa-user-plus"></i> Thêm Người Dùng
    </button>
    <br>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên người dùng</th>
            <th>Email</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.UserId">
            <td>{{ user.UserId }}</td>
            <td>{{ user.Username }}</td>
            <td>{{ user.Email }}</td>
            <td>
              <button class="action-button view" @click="viewUserDetails(user.UserId)">
                <i class="fas fa-eye"></i> Xem Chi Tiết
              </button>
              <button class="action-button edit" @click="editUser(user.UserId)">
                <i class="fas fa-edit"></i> Chỉnh Sửa
              </button>
              <button class="action-button toggle"
                @click="user.IsActive ? disableUser(user.UserId) : enableUser(user.UserId)">
                <i :class="user.IsActive ? 'fas fa-user-slash' : 'fas fa-user-check'"></i>
                {{ user.IsActive ? 'Vô hiệu hóa' : 'Kích hoạt' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>


  </div>
</template>

<script>
export default {
  name: 'UserManagement',
  data() {
    return {
      users: []
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
.management-container {
  padding: 24px;
  background-color: #ffffff;
  /* Nền sáng */
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  color: #2c3e50;
  /* Màu chữ chính */
  font-family: 'Roboto', sans-serif;
  max-width: 1100px;
  margin: 40px auto;
}

.management-title {
  font-size: 32px;
  font-weight: bold;
  color: #27ae60;
  text-align: center;
  margin-bottom: 16px;
}

.description {
  font-size: 16px;
  color: #7f8c8d;
  text-align: center;
  margin-bottom: 24px;
}

.table-container {
  overflow-x: auto;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  background-color: #ecf0f1;
  padding: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 16px;
}

thead th {
  background-color: #27ae60;
  /* Màu xanh lá cho thanh bên */
  color: #fff;
  padding: 14px;
  text-align: left;
  font-weight: 600;
  border-radius: 6px 6px 0 0;
}

tbody td {
  padding: 12px;
  border-bottom: 1px solid #dfe6e9;
  color: #2c3e50;
}

tbody tr:hover {
  background-color: #f1f8f5;
  /* Màu khi hover */
  color: #fff;
}

.action-button {
  padding: 8px 16px;
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
  background-color: #3498db;
  /* Màu xanh lam cho nút chi tiết */
}

.edit {
  background-color: #f39c12;
  /* Màu cam cho chỉnh sửa */
}

.toggle {
  background-color: #e74c3c;
  /* Màu đỏ cho cảnh báo */
}

.action-button:hover {
  transform: scale(1.05);
}

.view:hover {
  background-color: #2980b9;
}

.edit:hover {
  background-color: #e67e22;
}

.toggle:hover {
  background-color: #c0392b;
}

.add-button {
  padding: 12px 20px;
  font-size: 16px;
  font-weight: bold;
  background-color: #27ae60;
  /* Màu nút chính */
  color: #fff;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  display: block;
  margin: 20px auto 0;
  text-align: center;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.add-button:hover {
  background-color: #219150;
  /* Màu hover của nút */
  transform: translateY(-3px);
}
</style>
