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
:root {
  --main-bg-color: #34495e;
  /* Màu nền đậm */
  --card-bg-color: #2c3e50;
  /* Màu thẻ tối hơn */
  --text-color: #ecf0f1;
  /* Màu chữ sáng */
  --highlight-color: #1abc9c;
  /* Màu xanh lá nổi bật */
  --accent-color: #e67e22;
  /* Màu cam cho điểm nhấn */
  --hover-bg-color: #16a085;
  /* Màu xanh lá đậm khi hover */
  --shadow-color: rgba(0, 0, 0, 0.3);
  /* Bóng đổ nhẹ */
  --box-shadow-hover: rgba(0, 0, 0, 0.5);
  /* Bóng đổ khi hover */
}

.dashboard-container {
  padding: 2rem;
  background-color: var(--main-bg-color);
  color: var(--text-color);
  border-radius: 12px;
  box-shadow: 0 10px 30px var(--shadow-color);
  font-family: "Roboto", sans-serif;
}

.dashboard-title {
  font-size: 2rem;
  font-weight: bold;
  color: var(--text-color);
  margin-bottom: 1.5rem;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dashboard-title i {
  margin-right: 0.5rem;
  color: var(--highlight-color);
}

.welcome-message {
  font-size: 1.2rem;
  color: var(--text-color);
  opacity: 0.85;
  margin-bottom: 2rem;
  text-align: center;
}

.dashboard-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.card {
  background-color: var(--card-bg-color);
  border-radius: 12px;
  box-shadow: 0 4px 14px var(--shadow-color);
  padding: 2rem;
  text-align: center;
  transition: transform 0.3s, box-shadow 0.3s;
  color: var(--text-color);
}

.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 10px 30px var(--box-shadow-hover);
}

.card-icon {
  font-size: 2rem;
  color: var(--highlight-color);
  margin-bottom: 1rem;
}

.card h3 {
  font-size: 1.2rem;
  margin: 0;
  color: var(--text-color);
  opacity: 0.9;
}

.card p {
  font-size: 1.8rem;
  color: var(--accent-color);
  font-weight: bold;
  margin-top: 0.5rem;
}
</style>
