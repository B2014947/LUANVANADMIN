<template>
  <div class="dashboard-container">
    <h2 class="dashboard-title"><i class="fas fa-chart-line"></i> Bảng Điều Khiển Quản Trị</h2>
    <p class="welcome-message">Chào mừng bạn đến với bảng điều khiển quản trị!</p>
    <div class="dashboard-cards">
      <div class="card">
        <div class="card-icon">
          <i class="fas fa-users"></i>
        </div>
        <h3>Tổng Số Người Dùng</h3>
        <p>{{ userStats.totalUsers }}</p>
      </div>
      <div class="card">
        <div class="card-icon">
          <i class="fas fa-user-check"></i>
        </div>
        <h3>Người Dùng Hoạt Động</h3>
        <p>{{ userStats.activeUsers }}</p>
      </div>
      <div class="card">
        <div class="card-icon">
          <i class="fas fa-user-slash"></i>
        </div>
        <h3>Tài Khoản Không Hoạt Động</h3>
        <p>{{ userStats.inactiveUsers }}</p>
      </div>
      <div class="card">
        <div class="card-icon">
          <i class="fas fa-shopping-cart"></i>
        </div>
        <h3>Tổng Số Đơn Hàng</h3>
        <p>{{ orderStats.totalOrders }}</p>
      </div>
      <div class="card">
        <div class="card-icon">
          <i class="fas fa-box-open"></i>
        </div>
        <h3>Đơn Hàng Chờ Xử Lý</h3>
        <p>{{ orderStats.pendingOrders }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Dashboard",
  data() {
    return {
      userStats: {
        totalUsers: 0,
        activeUsers: 0,
        inactiveUsers: 0 // Số lượng tài khoản không hoạt động
      },
      orderStats: {
        totalOrders: 0,
        pendingOrders: 0
      },
    };
  },
  mounted() {
    this.fetchUserStats();
    this.fetchOrderStats();
  },
  methods: {
    async fetchUserStats() {
      try {
        const response = await fetch("http://localhost:5000/api/AccountCustomer/statistics");
        if (!response.ok) throw new Error("Không thể tải thống kê người dùng");
        const stats = await response.json();
        this.userStats.totalUsers = stats.totalUsers;
        this.userStats.activeUsers = stats.activeUsers;
        this.userStats.inactiveUsers = stats.inactiveUsers; // Thêm tài khoản không hoạt động
      } catch (error) {
        console.error(error);
        alert("Không thể tải thống kê người dùng.");
      }
    },
    async fetchOrderStats() {
      try {
        const response = await fetch("http://localhost:5000/api/Order/total-orders");
        if (!response.ok) throw new Error("Không thể tải thống kê đơn hàng");
        const stats = await response.json();
        this.orderStats.totalOrders = stats.totalOrders;
        this.orderStats.pendingOrders = stats.pendingOrders;
      } catch (error) {
        console.error(error);
        alert("Không thể tải thống kê đơn hàng.");
      }
    },
  },
};
</script>

<style scoped>
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css");

.dashboard-container {
  padding: 30px;
  background-color: #f4f6f8;
  border-radius: 12px;
  font-family: "Roboto", sans-serif;
}

.dashboard-title {
  font-size: 32px;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 15px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dashboard-title i {
  margin-right: 10px;
  color: #3498db;
}

.welcome-message {
  font-size: 18px;
  color: #7f8c8d;
  margin-bottom: 25px;
  text-align: center;
}

.dashboard-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 25px;
  margin-top: 25px;
}

.card {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
  padding: 35px;
  text-align: center;
  transition: transform 0.3s, box-shadow 0.3s;
}

.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.card-icon {
  font-size: 30px;
  color: #3498db;
  margin-bottom: 15px;
}

.card h3 {
  font-size: 20px;
  color: #34495e;
  margin: 0;
}

.card p {
  font-size: 28px;
  color: #2ecc71;
  font-weight: bold;
  margin-top: 10px;
}
</style>
