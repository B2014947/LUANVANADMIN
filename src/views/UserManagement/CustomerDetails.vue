<template>
    <div class="customer-details-container">
        <h2><i class="fas fa-user"></i> Thông Tin Người Dùng</h2>
        <div v-if="user" class="info-group">
            <p><strong><i class="fas fa-id-badge"></i> ID:</strong> {{ user.UserId }}</p>
            <p><strong><i class="fas fa-user"></i> Tên Người Dùng:</strong> {{ user.Username }}</p>
            <p><strong><i class="fas fa-envelope"></i> Email:</strong> {{ user.Email }}</p>
            <p><strong><i class="fas fa-phone"></i> Số Điện Thoại:</strong> {{ user.PhoneNumber }}</p>
            <p><strong><i class="fas fa-toggle-on"></i> Trạng Thái:</strong>
                <span :class="user.IsActive ? 'status-active' : 'status-inactive'">
                    {{ user.IsActive ? 'Hoạt Động' : 'Vô Hiệu Hóa' }}
                </span>
            </p>
            <p><strong><i class="fas fa-calendar-plus"></i> Ngày Tạo:</strong> {{ formatDate(user.CreatedAt) }}</p>
            <p><strong><i class="fas fa-calendar-check"></i> Ngày Cập Nhật:</strong> {{ formatDate(user.UpdatedAt) }}
            </p>
        </div>

        <section v-if="address.length" class="shipping-address">
            <h3><i class="fas fa-shipping-fast"></i> Địa Chỉ Vận Chuyển</h3>
            <div v-for="addr in address" :key="addr.AddressId" class="address-info">
                <p><strong>Tỉnh/Thành Phố:</strong> {{ addr.Province }}</p>
                <p><strong>Quận/Huyện:</strong> {{ addr.District }}</p>
                <p><strong>Phường/Xã:</strong> {{ addr.Ward }}</p>
                <p><strong>Địa Chỉ Chi Tiết:</strong> {{ addr.DetailedAddress }}</p>
            </div>
        </section>

        <section v-if="cart" class="user-cart">
            <h3><i class="fas fa-shopping-cart"></i> Giỏ Hàng</h3>
            <p><strong>ID Giỏ Hàng:</strong> {{ cart.CartId }}</p>
        </section>

        <section v-if="orders.length" class="user-orders">
            <h3><i class="fas fa-file-alt"></i> Danh Sách Đơn Hàng</h3>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Ngày Đặt</th>
                        <th>Tổng Tiền</th>
                        <th>Trạng Thái</th>
                        <th>Địa Chỉ Giao Hàng</th>
                        <th>Phương Thức Thanh Toán</th>
                        <th>Ngày Tạo</th>
                        <th>Ngày Cập Nhật</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="order in orders" :key="order.OrderId">
                        <td>{{ order.OrderId }}</td>
                        <td>{{ formatDate(order.OrderDate) }}</td>
                        <td>{{ formatCurrency(order.TotalAmount) }}</td>
                        <td>{{ order.Status }}</td>
                        <td>{{ order.ShippingAddress }}</td>
                        <td>{{ order.PaymentMethod }}</td>
                        <td>{{ formatDate(order.CreatedAt) }}</td>
                        <td>{{ formatDate(order.UpdatedAt) }}</td>
                    </tr>
                </tbody>
            </table>
        </section>

        <section v-if="wishlist.length" class="user-wishlist">
            <h3><i class="fas fa-heart"></i> Danh Sách Mong Muốn</h3>
            <table>
                <thead>
                    <tr>
                        <th>ID Sản Phẩm</th>
                        <th>Tên Sản Phẩm</th>
                        <th>Giá</th>
                        <th>Mô Tả</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in wishlist" :key="item.ProductId">
                        <td>{{ item.ProductId }}</td>
                        <td>{{ item.ProductName }}</td>
                        <td>{{ formatCurrency(item.Price) }}</td>
                        <td>{{ item.Description }}</td>
                    </tr>
                </tbody>
            </table>
        </section>


        <div class="button-group">
            <button class="back-button" @click="goBack">
                <i class="fas fa-arrow-left" style="margin-right: 10px;"></i> Quay Lại
            </button>
            <button class="edit-button" @click="editUser">
                <i class="fas fa-edit" style="margin-right: 10px;"></i> Chỉnh Sửa Thông Tin
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'CustomerDetails',
    data() {
        return {
            user: {},
            address: [],
            cart: null,
            orders: [],
            wishlist: []
        };
    },
    async mounted() {
        await this.fetchUserDetails();
    },
    methods: {
        async fetchUserDetails() {
            const { userId } = this.$route.params;
            try {
                const response = await fetch(`http://localhost:5000/api/AccountCustomer/users/${userId}`);
                const data = await response.json();
                this.user = data.user;
                this.address = data.address;
                this.cart = data.cart;
                this.orders = data.orders;
                this.wishlist = data.wishlist;
            } catch (error) {
                console.error('Lỗi khi lấy chi tiết người dùng:', error);
            }
        },
        formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString('vi-VN');
        },
        formatCurrency(value) {
            return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
        },
        goBack() {
            this.$router.push({ name: 'UserManagement' });
        },
        editUser() {
            this.$router.push({ name: 'EditCustomer', params: { userId: this.user.UserId } });
        }
    }
};
</script>

<style scoped>
.customer-details-container {
    padding: 2rem;
    background-color: #ffffff;
    /* Nền sáng */
    color: #2c3e50;
    /* Màu chữ chính */
    border-radius: 12px;
    max-width: 1100px;
    margin: 40px auto;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    font-family: 'Roboto', sans-serif;
}

h2 {
    color: #3498db;
    /* Màu xanh lam cho tiêu đề */
    margin-bottom: 1.5rem;
    font-weight: 700;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
}

.info-group p,
.address-info p {
    font-size: 16px;
    color: #2c3e50;
    margin-bottom: 1rem;
    display: block;
}

.info-group {
    display: block;
    margin-bottom: 20px;
}

.status-active {
    color: #2ecc71;
    /* Màu xanh cho trạng thái hoạt động */
    font-weight: 600;
}

.status-inactive {
    color: #e74c3c;
    /* Màu đỏ cho trạng thái vô hiệu hóa */
    font-weight: 600;
}

table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    background-color: #f4f4f4;
    /* Màu nền sáng cho bảng */
    border-radius: 6px;
    overflow: hidden;
}

th,
td {
    padding: 14px;
    border: 1px solid #bdc3c7;
    text-align: left;
    color: #2c3e50;
}

th {
    background-color: #27ae60;
    /* Màu xanh lá cho đầu bảng */
    color: #ffffff;
    font-weight: 600;
}

tr:nth-child(even) {
    background-color: #f9f9f9;
    /* Màu nền xen kẽ */
}

tr:hover {
    background-color: #e0f7fa;
    /* Màu nền khi hover */
}

.button-group {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-top: 20px;
}

.back-button,
.edit-button {
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    color: #ffffff;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s ease, box-shadow 0.3s ease;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.back-button {
    background-color: #3498db;
    /* Màu xanh lam cho nút Quay Lại */
}

.edit-button {
    background-color: #27ae60;
    /* Màu xanh lá cho nút Chỉnh Sửa */
}

.back-button:hover {
    background-color: #2980b9;
    /* Màu xanh đậm khi hover nút Quay Lại */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.edit-button:hover {
    background-color: #219150;
    /* Màu xanh đậm khi hover nút Chỉnh Sửa */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}
</style>
