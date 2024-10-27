<template>
    <div class="customer-details-container">
        <h2><i class="fas fa-user"></i> Thông tin người dùng</h2>
        <div v-if="user" class="info-group">
            <p><strong><i class="fas fa-id-badge"></i> ID:</strong> {{ user.UserId }}</p>
            <p><strong><i class="fas fa-user"></i> Tên người dùng:</strong> {{ user.Username }}</p>
            <p><strong><i class="fas fa-envelope"></i> Email:</strong> {{ user.Email }}</p>
            <p><strong><i class="fas fa-phone"></i> Số điện thoại:</strong> {{ user.PhoneNumber }}</p>
            <p><strong><i class="fas fa-toggle-on"></i> Trạng thái:</strong>
                <span :class="user.IsActive ? 'status-active' : 'status-inactive'">
                    {{ user.IsActive ? 'Hoạt động' : 'Vô hiệu hóa' }}
                </span>
            </p>
            <p><strong><i class="fas fa-calendar-plus"></i> Ngày tạo:</strong> {{ formatDate(user.CreatedAt) }}</p>
            <p><strong><i class="fas fa-calendar-check"></i> Ngày cập nhật:</strong> {{ formatDate(user.UpdatedAt) }}
            </p>
        </div>

        <section v-if="address.length" class="shipping-address">
            <h3><i class="fas fa-shipping-fast"></i> Địa chỉ vận chuyển</h3>
            <div v-for="addr in address" :key="addr.AddressId" class="address-info">
                <p><strong>Tỉnh:</strong> {{ addr.Province }}</p>
                <p><strong>Quận/Huyện:</strong> {{ addr.District }}</p>
                <p><strong>Phường/Xã:</strong> {{ addr.Ward }}</p>
                <p><strong>Địa chỉ chi tiết:</strong> {{ addr.DetailedAddress }}</p>
            </div>
        </section>

        <section v-if="cart" class="user-cart">
            <h3><i class="fas fa-shopping-cart"></i> Giỏ hàng</h3>
            <p><strong>ID Giỏ hàng:</strong> {{ cart.CartId }}</p>
        </section>

        <section v-if="orders.length" class="user-orders">
            <h3><i class="fas fa-file-alt"></i> Danh sách đơn hàng</h3>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Ngày Đặt</th>
                        <th>Tổng Tiền</th>
                        <th>Trạng Thái</th>
                        <th>Địa Chỉ Giao Hàng</th>
                        <th>Phương Thức Thanh Toán</th>
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
                    </tr>
                </tbody>
            </table>
        </section>

        <section v-if="wishlist.length" class="user-wishlist">
            <h3><i class="fas fa-heart"></i> Danh sách mong muốn</h3>
            <ul>
                <li v-for="item in wishlist" :key="item.ProductId">
                    Sản phẩm ID: {{ item.ProductId }}
                </li>
            </ul>
        </section>

        <div class="button-group">
            <button class="back-button" @click="goBack">
                <i class="fas fa-arrow-left" style="margin-right: 10px;"> </i> Quay lại
            </button>
            <button class="edit-button" @click="editUser">
                <i class="fas fa-edit" style="margin-right: 10px;"> </i> Chỉnh sửa thông tin
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
            return date.toLocaleDateString();
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
    padding: 3rem;
    background-color: #2c3e50;
    color: #ecf0f1;
    border-radius: 12px;
    max-width: 600px;
    margin: auto;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
    font-family: 'Arial', sans-serif;
    text-align: center;
}

h2 {
    color: #ecf0f1;
    margin-bottom: 1.5rem;
    font-weight: 600;
}

.info-group,
.shipping-address,
.user-cart,
.user-orders,
.user-wishlist {
    text-align: left;
    margin-bottom: 20px;
}

.info-group p,
.address-info p {
    font-size: 16px;
    color: #bdc3c7;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
}

.status-active {
    color: #2ecc71;
}

.status-inactive {
    color: #e74c3c;
}

table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
    background-color: #34495e;
}

th,
td {
    padding: 12px;
    border: 1px solid #7f8c8d;
    text-align: left;
    color: #ecf0f1;
}

th {
    background-color: #1abc9c;
    font-weight: 600;
}

tr:nth-child(even) {
    background-color: #3c556b;
}

.button-group {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 1.5rem;
}

.back-button,
.edit-button {
    padding: 10px 20px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    color: white;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s ease;
}

.back-button {
    background-color: #2980b9;
}

.edit-button {
    background-color: #27ae60;
}

.back-button:hover {
    background-color: #3498db;
}

.edit-button:hover {
    background-color: #2ecc71;
}
</style>
