<template>
    <div class="payment-transactions">
        <h2 class="title">
            <i class="fas fa-wallet"></i> Quản lý Giao dịch Thanh toán
        </h2>
        <div class="filter-container">
            <label>Trạng thái:</label>
            <select v-model="selectedStatus" @change="fetchStatistics">
                <option value="">Tất cả</option>
                <option value="Pending">Đang chờ xử lý</option>
                <option value="Completed">Hoàn tất</option>
                <option value="Failed">Thất bại</option>
            </select>
        </div>
        <p class="total-amount">
            <i class="fas fa-coins"></i> Tổng số tiền giao dịch:
            <span>{{ statistics.totalAmount ? statistics.totalAmount.toLocaleString() : '0' }} VND</span>
        </p>

        <!-- Biểu đồ thống kê -->
        <div class="charts">
            <div class="chart-container">
                <h3><i class="fas fa-chart-bar"></i> Tình trạng Giao dịch</h3>
                <canvas id="statusChart"></canvas>
            </div>
            <div class="chart-container">
                <h3><i class="fas fa-chart-line"></i> Biểu đồ Tổng số tiền giao dịch</h3>
                <canvas id="amountChart"></canvas>
            </div>
        </div>

        <!-- Bảng danh sách giao dịch -->
        <table>
            <thead>
                <tr>
                    <th>ID Giao dịch</th>
                    <th>Order ID</th>
                    <th>Phương thức Thanh toán</th>
                    <th>Số tiền</th>
                    <th>Trạng thái</th>
                    <th>Ngày Thanh toán</th>
                    <th>Hành động</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="transaction in transactions" :key="transaction.TransactionId">
                    <td>{{ transaction.TransactionId }}</td>
                    <td>{{ transaction.OrderId }}</td>
                    <td>{{ transaction.PaymentMethod }}</td>
                    <td>{{ transaction.TransactionAmount.toLocaleString() }} VND</td>
                    <td class="status-cell">
                        <i :class="getStatusIcon(transaction.TransactionStatus)" class="status-icon"></i>
                        <select v-model="transaction.TransactionStatus" @change="updateTransactionStatus(transaction)"
                            :class="`status-${transaction.TransactionStatus.toLowerCase()}`">
                            <option value="Pending">Đang chờ xử lý</option>
                            <option value="Completed">Hoàn tất</option>
                            <option value="Failed">Thất bại</option>
                        </select>
                    </td>
                    <td>{{ formatDate(transaction.PaymentDate) }}</td>
                    <td>
                        <button class="delete-button" @click="deleteTransaction(transaction.TransactionId)">
                            <i class="fas fa-trash-alt"></i> Xóa
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export default {
    data() {
        return {
            transactions: [],
            statistics: {
                totalTransactions: 0,
                totalAmount: 0,
                transactionStatusCounts: { Pending: 0, Completed: 0, Failed: 0 }
            },
            selectedStatus: '', // Thêm selectedStatus để lọc trạng thái
            statusChart: null,
            amountChart: null,
        };
    },
    mounted() {
        this.fetchTransactions();
        this.fetchStatistics();
    },
    methods: {
        async fetchTransactions() {
            try {
                const response = await fetch("http://localhost:5000/api/transactions");
                if (!response.ok) throw new Error("Error fetching transactions");
                this.transactions = await response.json();
            } catch (error) {
                console.error("Không thể tải danh sách giao dịch:", error);
                alert("Lỗi khi tải danh sách giao dịch.");
            }
        },
        async fetchStatistics() {
            const filterParams = new URLSearchParams();
            if (this.selectedStatus) filterParams.set('status', this.selectedStatus); // Lọc theo trạng thái

            try {
                const response = await fetch(`http://localhost:5000/api/transactions/Statistics-payment?${filterParams}`);
                const data = await response.json();
                this.statistics = data;

                if (!data.totalTransactions) {
                    alert("Không có dữ liệu cho bộ lọc hiện tại.");
                }
                this.renderCharts(); // Render lại biểu đồ khi có thay đổi
            } catch (error) {
                console.error("Lỗi khi tải thống kê giao dịch:", error);
                alert("Lỗi khi tải thống kê giao dịch.");
            }
        },
        renderCharts() {
            if (this.statusChart) this.statusChart.destroy();
            if (this.amountChart) this.amountChart.destroy();

            const ctxStatus = document.getElementById("statusChart").getContext("2d");
            this.statusChart = new Chart(ctxStatus, {
                type: 'bar',
                data: {
                    labels: ["Đang chờ xử lý", "Hoàn tất", "Thất bại"],
                    datasets: [{
                        data: [
                            this.statistics.transactionStatusCounts.Pending,
                            this.statistics.transactionStatusCounts.Completed,
                            this.statistics.transactionStatusCounts.Failed,
                        ],
                        backgroundColor: ["#f39c12", "#27ae60", "#e74c3c"],
                    }]
                },
                options: {
                    responsive: true,
                    plugins: { legend: { display: false } },
                    scales: { y: { beginAtZero: true } },
                }
            });

            const ctxAmount = document.getElementById("amountChart").getContext("2d");
            this.amountChart = new Chart(ctxAmount, {
                type: 'bar',
                data: {
                    labels: ["Tổng số tiền giao dịch"],
                    datasets: [{
                        label: "Số tiền (VND)",
                        data: [this.statistics.totalAmount],
                        backgroundColor: "#3498db",
                    }]
                },
                options: {
                    responsive: true,
                    scales: { y: { beginAtZero: true } },
                    plugins: { legend: { display: false } },
                }
            });
        },
        getStatusIcon(status) {
            switch (status) {
                case "Pending": return "fas fa-hourglass-half status-pending-icon";
                case "Completed": return "fas fa-check-circle status-completed-icon";
                case "Failed": return "fas fa-times-circle status-failed-icon";
                default: return "";
            }
        },
        async updateTransactionStatus(transaction) {
            try {
                const response = await fetch(`http://localhost:5000/api/transactions/${transaction.TransactionId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ transactionStatus: transaction.TransactionStatus }),
                });
                if (!response.ok) throw new Error("Error updating transaction status");
                alert("Trạng thái giao dịch đã được cập nhật.");
                this.fetchStatistics(); // Cập nhật lại số liệu sau khi thay đổi trạng thái
            } catch (error) {
                console.error("Không thể cập nhật trạng thái giao dịch:", error);
                alert("Lỗi khi cập nhật trạng thái giao dịch.");
            }
        },
        async deleteTransaction(transactionId) {
            if (!confirm("Bạn có chắc chắn muốn xóa giao dịch này không?")) return;
            try {
                const response = await fetch(`http://localhost:5000/api/transactions/${transactionId}`, { method: "DELETE" });
                if (!response.ok) throw new Error("Error deleting transaction");
                this.fetchTransactions();
                this.fetchStatistics();
            } catch (error) {
                console.error("Không thể xóa giao dịch:", error);
                alert("Lỗi khi xóa giao dịch.");
            }
        },
        formatDate(date) {
            return new Date(date).toLocaleDateString("vi-VN");
        },
    },
};
</script>

<style scoped>
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css");

.payment-transactions {
    padding: 30px;
    background-color: #f9f9f9;
    font-family: "Roboto", sans-serif;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    max-width: 1000px;
    margin: auto;
}

.title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    color: #34495e;
}

.total-amount {
    font-size: 18px;
    color: #2c3e50;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
}

.total-amount i {
    margin-right: 8px;
    color: #e67e22;
}

.total-amount span {
    font-weight: bold;
    color: #3498db;
}

.charts {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
    justify-content: space-between;
}

.chart-container {
    width: 48%;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 20px;
}

h3 {
    font-size: 18px;
    color: #34495e;
    margin: 0 0 10px;
}

table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    background-color: #ffffff;
    border-radius: 8px;
    overflow: hidden;
}

th,
td {
    padding: 14px 12px;
    border: 1px solid #ddd;
    text-align: left;
    font-size: 14px;
    color: #34495e;
}

th {
    background-color: #2c3e50;
    color: #ecf0f1;
    font-weight: bold;
}

.status-cell select {
    font-weight: bold;
    color: #000000;
    background-color: inherit;
    border: none;
    outline: none;
    cursor: pointer;
    padding: 5px 8px;
}

.status-pending-icon,
.status-pending select {
    background-color: #f39c12;
}

.status-completed-icon,
.status-completed select {
    background-color: #27ae60;
}

.status-failed-icon,
.status-failed select {
    background-color: #e74c3c;
}

button {
    padding: 8px 12px;
    font-size: 14px;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
    display: flex;
    align-items: center;
    gap: 5px;
}

.delete-button {
    background-color: #e74c3c;
}

.delete-button:hover {
    background-color: #c0392b;
}

button i {
    font-size: 14px;
}
</style>
        