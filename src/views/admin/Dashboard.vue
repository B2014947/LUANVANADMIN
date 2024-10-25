<template>
  <div class="dashboard-container">
    <h2 class="dashboard-title">Admin Dashboard</h2>
    <p class="welcome-message">Chào mừng bạn đến với bảng điều khiển admin!</p>
    <div class="dashboard-cards">
      <div class="card">
        <h3>Total Users</h3>
        <p>150</p>
      </div>
      <div class="card">
        <h3>New Orders</h3>
        <p>23</p>
      </div>
      <div class="card">
        <h3>Pending Reports</h3>
        <p>5</p>
      </div>
      <div class="card">
        <h3>System Status</h3>
        <p>All systems operational</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
};
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
  background-color: #ecf0f1;
  /* Màu nền cho dashboard */
  border-radius: 10px;
  /* Bo góc cho toàn bộ container */
}

.dashboard-title {
  font-size: 28px;
  font-weight: bold;
  color: #2c3e50;
  /* Màu chữ nổi bật hơn */
  margin-bottom: 10px;
  text-align: center;
  /* Căn giữa tiêu đề */
}

.welcome-message {
  font-size: 16px;
  color: #7f8c8d;
  margin-bottom: 20px;
  text-align: center;
  /* Căn giữa thông điệp chào mừng */
}

.dashboard-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  /* Bố cục grid cho các thẻ */
  gap: 20px;
  /* Khoảng cách giữa các thẻ */
  margin-top: 20px;
  /* Khoảng cách giữa phần tiêu đề và thẻ */
}

.card {
  background-color: #ffffff;
  /* Màu nền của các thẻ */
  border-radius: 10px;
  /* Bo góc cho thẻ */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  /* Hiệu ứng bóng cho thẻ */
  padding: 30px;
  /* Padding cho thẻ */
  text-align: center;
  /* Căn giữa nội dung bên trong thẻ */
  transition: transform 0.3s, box-shadow 0.3s;
  /* Hiệu ứng chuyển động khi hover */
}

.card:hover {
  transform: translateY(-5px);
  /* Nâng thẻ lên khi hover */
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  /* Tăng độ bóng khi hover */
}

.card h3 {
  font-size: 22px;
  /* Kích thước tiêu đề lớn hơn */
  color: #34495e;
  /* Màu chữ cho tiêu đề */
}

.card p {
  font-size: 28px;
  /* Kích thước chữ lớn hơn */
  color: #2ecc71;
  /* Màu chữ cho số liệu */
  font-weight: bold;
  /* Chữ in đậm */
  margin-top: 10px;
  /* Khoảng cách giữa tiêu đề và số liệu */
}
</style>
