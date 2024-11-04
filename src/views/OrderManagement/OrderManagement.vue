<template>
    <div class="order-management">
        <h2 class="management-title"><i class="fas fa-boxes"></i> Quản lý Đơn Hàng</h2>

        <table>
            <thead>
                <tr>
                    <th>Order ID</th>
                    <th>User ID</th>
                    <th>Order Date</th>
                    <th>Total Amount</th>
                    <th>Trạng thái</th>
                    <th>Địa chỉ giao hàng</th>
                    <th>Phương thức thanh toán</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="order in orders" :key="order.OrderId">
                    <td>{{ order.OrderId }}</td>
                    <td>{{ order.UserId }}</td>
                    <td>{{ formatDate(order.OrderDate) }}</td>
                    <td>{{ order.TotalAmount.toLocaleString() }} VND</td>
                    <td :class="getStatusClass(order.StatusId)">
                        <i :class="getStatusIcon(order.StatusId)"></i> {{ getStatusName(order.StatusId) }}
                    </td>
                    <td>{{ order.ShippingAddress }}</td>
                    <td>{{ order.PaymentMethod }}</td>
                    <td class="actions-cell">
                        <div class="status-dropdown">
                            <select v-model="order.newStatus" @change="updateOrderStatus(order)">
                                <option v-for="(name, id) in orderStatuses" :key="id" :value="id">
                                    {{ name }}
                                </option>
                            </select>
                            <i class="fas fa-sync-alt dropdown-icon"></i>
                        </div>
                        <button @click="viewOrderDetails(order.OrderId)" class="action-button view-details"
                            title="View Order Details">
                            <i class="fas fa-eye"></i>
                        </button>
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
            orders: [],
            orderStatuses: {
                13: 'Chờ xử lý',
                14: 'Đã xác nhận',
                15: 'Đang đóng gói',
                16: 'Bàn giao vận chuyển',
                17: 'Đang vận chuyển',
                18: 'Đã giao',
                19: 'Đã hủy'
            }
        };
    },
    mounted() {
        this.fetchOrders();
    },
    methods: {
        async fetchOrders() {
            try {
                const response = await fetch('http://localhost:5000/api/Order');
                if (!response.ok) throw new Error('Lỗi khi tải danh sách đơn hàng');
                this.orders = await response.json();
            } catch (error) {
                console.error(error);
                alert('Không thể tải danh sách đơn hàng.');
            }
        },
        formatDate(date) {
            return new Date(date).toLocaleDateString('vi-VN');
        },
        getStatusName(statusId) {
            return this.orderStatuses[statusId] || 'Không xác định';
        },
        getStatusClass(statusId) {
            switch (statusId) {
                case 13:
                    return 'status-pending';
                case 14:
                    return 'status-confirmed';
                case 15:
                    return 'status-packing';
                case 16:
                    return 'status-shipped';
                case 17:
                    return 'status-in-transit';
                case 18:
                    return 'status-delivered';
                case 19:
                    return 'status-canceled';
                default:
                    return '';
            }
        },
        getStatusIcon(statusId) {
            switch (statusId) {
                case 13:
                    return 'fas fa-hourglass-start';
                case 14:
                    return 'fas fa-check-circle';
                case 15:
                    return 'fas fa-box';
                case 16:
                    return 'fas fa-shipping-fast';
                case 17:
                    return 'fas fa-truck';
                case 18:
                    return 'fas fa-check-double';
                case 19:
                    return 'fas fa-ban';
                default:
                    return '';
            }
        },
        async updateOrderStatus(order) {
            const newStatus = order.newStatus;
            if (newStatus) {
                try {
                    const response = await fetch(`http://localhost:5000/api/Order/${order.OrderId}/update-status`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ statusId: newStatus })
                    });
                    if (!response.ok) throw new Error('Lỗi khi cập nhật trạng thái đơn hàng');
                    alert('Trạng thái đơn hàng đã được cập nhật thành công.');
                    this.fetchOrders();
                } catch (error) {
                    console.error(error);
                    alert('Đã xảy ra lỗi khi cập nhật trạng thái.');
                }
            } else {
                alert('Trạng thái không hợp lệ.');
            }
        },
        viewOrderDetails(orderId) {
            this.$router.push({ name: 'OrderDetail', params: { orderId } });
        }
    }
};
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

.order-management {
    padding: 24px;
    background-color: #f9f9f9;
    border-radius: 12px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    font-family: 'Roboto', sans-serif;
    max-width: 1200px;
    margin: auto;
}

.management-title {
    font-size: 28px;
    font-weight: 700;
    color: #2d3e50;
    margin-bottom: 20px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
}

.management-title i {
    margin-right: 10px;
    color: #3498db;
}

table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
}

th,
td {
    border: 1px solid #bdc3c7;
    padding: 12px;
    text-align: left;
    font-size: 14px;
}

th {
    background-color: #34495e;
    color: #ecf0f1;
    font-weight: bold;
}

tbody tr:hover {
    background-color: #f4f6f8;
}

.actions-cell {
    display: flex;
    align-items: center;
    gap: 10px;
}

/* Status dropdown with icon */
.status-dropdown {
    position: relative;
    display: flex;
    align-items: center;
}

.dropdown-icon {
    position: absolute;
    right: 8px;
    pointer-events: none;
    color: #bdc3c7;
}

.status-dropdown select {
    appearance: none;
    padding: 8px 30px 8px 12px;
    border: 1px solid #bdc3c7;
    border-radius: 6px;
    background-color: #ffffff;
    font-size: 14px;
    color: #333;
    cursor: pointer;
}

/* Action button with icon */
.action-button {
    background-color: #3498db;
    color: #fff;
    padding: 8px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
}

.action-button:hover {
    background-color: #2980b9;
}

.action-button i {
    font-size: 18px;
}

/* Status Styles */
.status-pending {
    color: #f39c12;
}

.status-confirmed {
    color: #2ecc71;
}

.status-packing {
    color: #e67e22;
}

.status-shipped {
    color: #3498db;
}

.status-in-transit {
    color: #1abc9c;
}

.status-delivered {
    color: #27ae60;
}

.status-canceled {
    color: #e74c3c;
}
</style>
