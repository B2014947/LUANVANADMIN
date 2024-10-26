<template>
    <div class="customer-details-container">
        <h2><font-awesome-icon icon="user" /> Chi Tiết Người Dùng</h2>

        <section class="user-info">
            <h3><font-awesome-icon icon="user" /> Thông Tin Người Dùng</h3>
            <p><strong><font-awesome-icon icon="user" /> Tên người dùng:</strong> {{ user.Username }}</p>
            <p><strong><font-awesome-icon icon="id-card" /> Họ và tên:</strong> {{ user.FullName }}</p>
            <p><strong><font-awesome-icon icon="envelope" /> Email:</strong> {{ user.Email }}</p>
            <p><strong><font-awesome-icon icon="phone" /> Số điện thoại:</strong> {{ user.PhoneNumber }}</p>
            <p><strong>Trạng thái:</strong> {{ user.IsActive ? "Hoạt động" : "Vô hiệu hóa" }}</p>
            <p><strong>Ngày tạo:</strong> {{ formatDate(user.CreatedAt) }}</p>
            <p><strong>Ngày cập nhật:</strong> {{ formatDate(user.UpdatedAt) }}</p>
        </section>

        <section class="shipping-address" v-if="address.length">
            <h3><font-awesome-icon icon="shipping-fast" /> Địa Chỉ Vận Chuyển</h3>
            <div v-for="addr in address" :key="addr.AddressId">
                <p><strong>Tỉnh:</strong> {{ addr.Province }}</p>
                <p><strong>Quận/Huyện:</strong> {{ addr.District }}</p>
                <p><strong>Phường/Xã:</strong> {{ addr.Ward }}</p>
                <p><strong>Địa chỉ chi tiết:</strong> {{ addr.DetailedAddress }}</p>
            </div>
        </section>

        <section class="user-cart" v-if="cart">
            <h3><font-awesome-icon icon="shopping-cart" /> Giỏ Hàng</h3>
            <p><strong>ID Giỏ hàng:</strong> {{ cart.CartId }}</p>
        </section>

        <section class="user-orders" v-if="orders.length">
            <h3><font-awesome-icon icon="file-alt" /> Danh Sách Đơn Hàng</h3>
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

        <section class="user-wishlist" v-if="wishlist.length">
            <h3><font-awesome-icon icon="heart" /> Danh Sách Mong Muốn</h3>
            <ul>
                <li v-for="item in wishlist" :key="item.ProductId">
                    Sản phẩm ID: {{ item.ProductId }}
                </li>
            </ul>
        </section>

        <button class="edit-button" @click="editUser">
            <font-awesome-icon icon="edit" /> Chỉnh Sửa Thông Tin
        </button>
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
        editUser() {
            this.$router.push({ name: 'EditCustomer', params: { userId: this.user.UserId } });
        }
    }
};
</script>

<style scoped>
.customer-details-container {
    max-width: 800px;
    margin: auto;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    font-family: 'Arial', sans-serif;
}

h2,
h3 {
    color: #34495e;
    display: flex;
    align-items: center;
    gap: 10px;
}

.user-info,
.shipping-address,
.user-cart,
.user-orders,
.user-wishlist {
    margin-bottom: 20px;
}

table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
}

th,
td {
    padding: 8px;
    border: 1px solid #ccc;
    text-align: left;
}

th {
    background-color: #34495e;
    color: #fff;
}

.edit-button {
    display: inline-block;
    padding: 10px 15px;
    background-color: #3498db;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.3s ease;
    display: flex;
    align-items: center;
    gap: 5px;
}

.edit-button:hover {
    background-color: #2980b9;
}
</style>
