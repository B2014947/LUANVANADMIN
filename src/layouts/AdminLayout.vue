<template>
    <div class="admin-layout">
        <aside class="sidebar">
            <h2>Admin Panel</h2>
            <nav>
                <RouterLink to="/admin/dashboard" class="nav-link">Dashboard</RouterLink>
                <RouterLink to="/admin/users" class="nav-link">User Management</RouterLink>
                <RouterLink to="/admin/reports" class="nav-link">Reports</RouterLink>
                <RouterLink to="/admin/settings" class="nav-link">Settings</RouterLink>
            </nav>
        </aside>

        <main>
            <header class="admin-header">
                <h1>Admin Dashboard</h1>
                <div class="header-links">
                    <RouterLink to="/admin/profile" class="header-button">Profile</RouterLink>
                    <RouterLink to="/login" class="header-button logout">Logout</RouterLink>
                </div>
            </header>
            <section class="content-section">
                <RouterView />
            </section>
        </main>
    </div>
</template>

<script>
export default {
    name: 'AdminLayout',
};
</script>

<style scoped>
/* Style cho layout */
.admin-layout {
    display: flex;
    height: 100vh;
    /* Chiếm toàn bộ chiều cao màn hình */
}

.sidebar {
    width: 250px;
    background-color: #2c3e50;
    /* Màu nền tối hơn cho sidebar */
    color: white;
    /* Màu chữ trắng */
    padding: 1.5rem;
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.2);
    transition: width 0.3s;
    /* Hiệu ứng chuyển đổi khi thay đổi kích thước */
}

.sidebar h2 {
    text-align: center;
    margin-bottom: 2rem;
    font-weight: bold;
    /* Chữ đậm cho tiêu đề */
    font-size: 24px;
    /* Kích thước chữ lớn hơn */
}

.nav-link {
    display: block;
    padding: 12px 15px;
    /* Tăng kích thước padding để tạo cảm giác thoải mái hơn */
    color: #bdc3c7;
    /* Màu chữ nhạt hơn cho các liên kết */
    text-decoration: none;
    border-radius: 4px;
    transition: background-color 0.3s, color 0.3s;
    /* Hiệu ứng chuyển màu và nền */
}

.nav-link:hover {
    background-color: #1abc9c;
    /* Màu nền khi hover */
    color: white;
    /* Màu chữ chuyển sang trắng khi hover */
}

.admin-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background-color: #ecf0f1;
    /* Màu nền của header */
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.header-links {
    display: flex;
    gap: 15px;
    /* Khoảng cách giữa các nút */
}

.header-button {
    background-color: #3498db;
    /* Màu nền cho nút */
    color: white;
    /* Màu chữ */
    padding: 10px 15px;
    /* Padding cho nút */
    border-radius: 5px;
    /* Bo góc cho nút */
    text-decoration: none;
    /* Không gạch chân */
    transition: background-color 0.3s, transform 0.3s;
    /* Hiệu ứng chuyển màu và chuyển động */
    font-weight: bold;
    /* Chữ in đậm */
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    /* Hiệu ứng bóng cho nút */
}

.header-button:hover {
    background-color: #2980b9;
    /* Màu nền khi hover */
    transform: translateY(-2px);
    /* Nâng nút lên khi hover */
}

.header-button.logout {
    background-color: #e74c3c;
    /* Màu nền cho nút logout */
}

.header-button.logout:hover {
    background-color: #c0392b;
    /* Màu nền khi hover cho nút logout */
}

main {
    flex-grow: 1;
    padding: 2rem;
    background-color: #ecf0f1;
    overflow-y: auto;
    /* Cho phép cuộn nội dung nếu quá dài */
}

.content-section {
    margin-top: 20px;
    /* Khoảng cách giữa header và nội dung */
}
</style>
