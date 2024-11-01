<template>
    <div class="order-management">
        <h2>Order Management</h2>
        <!-- Danh sách đơn hàng -->
        <table>
            <thead>
                <tr>
                    <th>Order ID</th>
                    <th>User ID</th>
                    <th>Order Date</th>
                    <th>Total Amount</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="order in orders" :key="order.OrderId">
                    <td>{{ order.OrderId }}</td>
                    <td>{{ order.UserId }}</td>
                    <td>{{ order.OrderDate }}</td>
                    <td>{{ order.TotalAmount }} VND</td>
                    <td>{{ order.Status }}</td>
                    <td>
                        <button @click="updateOrderStatus(order.OrderId)">Update Status</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    data() {
        return {
            orders: [] // Lưu trữ danh sách đơn hàng
        };
    },
    mounted() {
        this.fetchOrders();
    },
    methods: {
        async fetchOrders() {
            // Gọi API lấy danh sách đơn hàng
            const response = await fetch('http://localhost:5000/api/orders');
            this.orders = await response.json();
        },
        updateOrderStatus(orderId) {
            // Logic để cập nhật trạng thái đơn hàng
        }
    }
};
</script>
