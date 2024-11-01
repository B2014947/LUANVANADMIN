<template>
  <div class="management-container">
    <h2 class="management-title">User Management</h2>
    <p class="description">Quản lý người dùng tại đây.</p>

    <div class="table-container">
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
              <button class="action-button view" @click="viewUserDetails(user.UserId)">Xem Chi Tiết</button>
              <button class="action-button edit" @click="editUser(user.UserId)">
                Chỉnh Sửa</button>
              <button class="action-button toggle"
                @click="user.IsActive ? disableUser(user.UserId) : enableUser(user.UserId)">
                {{ user.IsActive ? 'Vô hiệu hóa' : 'Kích hoạt' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <button class="add-button" @click="addUser">Thêm Người Dùng</button>
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
  background-color: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  font-family: 'Roboto', sans-serif;
  max-width: 1000px;
  margin: auto;
}

.management-title {
  font-size: 26px;
  font-weight: 700;
  color: #2d3e50;
  margin-bottom: 8px;
}

.description {
  font-size: 16px;
  color: #6c757d;
  margin-bottom: 20px;
}

.table-container {
  overflow-x: auto;
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
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
  padding: 12px;
  text-align: left;
  font-weight: 500;
}

tbody td {
  padding: 12px;
  border-bottom: 1px solid #dee2e6;
  color: #2d3e50;
}

tbody tr:hover {
  background-color: #f1f3f5;
}

.action-button {
  padding: 8px 14px;
  margin: 3px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  transition: background-color 0.3s ease;
}

.view {
  background-color: #5a67d8;
}

.edit {
  background-color: #2b8a3e;
}

.toggle {
  background-color: #e53e3e;
}

.action-button:hover {
  opacity: 0.9;
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
  transition: background-color 0.3s ease;
}

.add-button:hover {
  background-color: #45a049;
}
</style>
