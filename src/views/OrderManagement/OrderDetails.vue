<template>
    <div class="order-details">
        <h2 class="details-title"><i class="fas fa-info-circle"></i> Chi Tiết Đơn Hàng</h2>

        <div v-if="order">
            <div class="order-info">
                <h3><i class="fas fa-receipt"></i> Thông Tin Đơn Hàng</h3>
                <p><i class="fas fa-hashtag"></i> <strong>Mã Đơn Hàng</strong>: {{ order.OrderId }}</p>
                <p><i class="fas fa-user"></i> <strong>Mã Khách Hàng</strong>: {{ order.UserId }}</p>
                <p><i class="fas fa-calendar-alt"></i> <strong>Ngày Đặt Hàng</strong>: {{ formatDate(order.OrderDate) }}
                </p>
                <p><i class="fas fa-money-bill-wave"></i> <strong>Tổng Tiền Hàng</strong>:{{ subtotal.toLocaleString()
                    }} VND</p>
                <p><i class="fas fa-shipping-fast"></i> <strong>Phí Vận Chuyển</strong>: {{
                    shippingDetails.shippingCost.toLocaleString() }} VND</p>
                <p><i class="fas fa-dollar-sign"></i> <strong>Tổng Thanh Toán</strong>: {{ totalAmount.toLocaleString()
                    }} VND</p>
                <p><i class="fas fa-calendar-check"></i> <strong>Ngày Giao Hàng Dự Kiến</strong>: {{
                    formatDate(shippingDetails.estimatedDeliveryDate) }}</p>
                <p><i class="fas fa-map-marker-alt"></i> <strong>Địa Chỉ Giao Hàng</strong>: {{
                    formatAddress(shippingAddress) }}</p>
                <p><i class="fas fa-credit-card"></i> <strong>Phương Thức Thanh Toán</strong>: {{ order.PaymentMethod }}
                </p>
                <p><i class="fas fa-clipboard-check"></i> <strong>Trạng Thái</strong>: {{ orderStatus.StatusName }}</p>
            </div>

            <div class="payment-info">
                <h3><i class="fas fa-wallet"></i> Thông Tin Thanh Toán</h3>
                <p><i class="fas fa-exclamation-circle"></i> <strong>Trạng Thái Thanh Toán</strong>: {{
                    paymentDetails.TransactionStatus }}</p>
                <p><i class="fas fa-coins"></i> <strong>Số Tiền Giao Dịch</strong>: {{
                    paymentDetails.TransactionAmount.toLocaleString() }} VND</p>
                <p><i class="fas fa-calendar-day"></i> <strong>Ngày Thanh Toán</strong>: {{
                    formatDate(paymentDetails.PaymentDate) }}</p>
            </div>

            <div class="order-items">
                <h3><i class="fas fa-box"></i> Sản Phẩm Trong Đơn Hàng</h3>
                <table>
                    <thead>
                        <tr>
                            <th><i class="fas fa-barcode"></i> Mã Sản Phẩm</th>
                            <th><i class="fas fa-tag"></i> Tên Sản Phẩm</th>
                            <th><i class="fas fa-boxes"></i> Số Lượng</th>
                            <th><i class="fas fa-dollar-sign"></i> Giá</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in orderItems" :key="item.OrderItemId">
                            <td>{{ item.ProductId }}</td>
                            <td>{{ item.ProductName }}</td>
                            <td>{{ item.Quantity }}</td>
                            <td>{{ item.Price.toLocaleString() }} VND</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <button @click="goBack" class="back-button"><i class="fas fa-arrow-left"></i> Quay Lại</button>
    </div>
</template>


<script>
export default {
    data() {
        return {
            order: null,
            orderStatus: {},
            paymentDetails: {},
            orderItems: [],
            shippingDetails: {},
            subtotal: 0,
            totalAmount: 0,
            shippingAddress: {}
        };
    },
    mounted() {
        this.fetchOrderDetails();
    },
    methods: {
        async fetchOrderDetails() {
            const orderId = this.$route.params.orderId;
            try {
                const response = await fetch(`http://localhost:5000/api/Order/${orderId}`);
                if (!response.ok) throw new Error('Lỗi khi tải chi tiết đơn hàng');
                const data = await response.json();

                this.order = data.order;
                this.orderStatus = data.orderStatus;
                this.paymentDetails = data.paymentDetails;
                this.orderItems = data.orderItems;
                this.shippingDetails = data.shippingDetails;
                this.subtotal = data.subtotal;
                this.totalAmount = data.totalAmount;
                this.shippingAddress = data.shippingAddress;
            } catch (error) {
                console.error(error);
                alert('Không thể tải chi tiết đơn hàng.');
            }
        },
        formatDate(date) {
            return new Date(date).toLocaleDateString('vi-VN');
        },
        formatAddress(address) {
            return `${address.detailedAddress}, ${address.ward}, ${address.district}, ${address.province}`;
        },
        goBack() {
            this.$router.push({ name: 'OrderManagement' });
        }
    }
};
</script>


<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

.order-details {
    padding: 30px;
    background-color: #f4f6f8;
    border-radius: 15px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    font-family: 'Roboto', sans-serif;
    max-width: 800px;
    margin: auto;
    color: #333;
}

.details-title {
    font-size: 26px;
    font-weight: bold;
    color: #2c3e50;
    text-align: center;
    margin-bottom: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.details-title i {
    margin-right: 10px;
    color: #3498db;
}

.order-info,
.payment-info {
    margin-bottom: 20px;
    background-color: #ffffff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

h3 {
    margin-bottom: 15px;
    font-size: 20px;
    color: #34495e;
    display: flex;
    align-items: center;
}

h3 i {
    margin-right: 8px;
    color: #e67e22;
}

p {
    font-size: 16px;
    margin: 8px 0;
    color: #7f8c8d;
    display: flex;
    align-items: center;
}

p i {
    margin-right: 8px;
    color: #3498db;
}

table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
}

th,
td {
    border: 1px solid #bdc3c7;
    text-align: center;
    font-size: 16px;
}

th {
    background-color: #34495e;
    color: #ecf0f1;
}

.back-button {
    margin-top: 25px;
    padding: 10px 20px;
    border: none;
    border-radius: 6px;
    background-color: #3498db;
    color: white;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.back-button i {
    margin-right: 8px;
    font-size: 18px;
}

.back-button:hover {
    background-color: #2980b9;
}

.order-items {
    margin-top: 20px;
    background-color: #ffffff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.order-items h3 {
    font-size: 20px;
    color: #2c3e50;
    margin-bottom: 15px;
    display: flex;
    align-items: center;
}

.order-items h3 i {
    color: #e67e22;
    margin-right: 10px;
}

table {
    width: 100%;
    border-collapse: collapse;
    font-size: 16px;
}

thead th {
    background-color: #34495e;
    color: #ecf0f1;
    text-align: left;
    padding: 12px;
    font-weight: 500;
    font-size: 15px;
}

thead th i {
    margin-right: 5px;
}

tbody tr {
    background-color: #f7f7f7;
    transition: background-color 0.3s;
}



tbody tr:hover {
    background-color: #e8f6ff;
}

tbody td {
    padding: 12px;
    border-bottom: 1px solid #ddd;
    color: #34495e;
}

tbody td:last-child {
    font-weight: 600;
    color: #27ae60;
}

table thead th,
table tbody td {
    padding-left: 10px;
}

table tbody tr:nth-child(even) {
    background-color: #fbfbfb;
}
</style>
