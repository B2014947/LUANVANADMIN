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
            if (this.selectedStatus) filterParams.set('status', this.selectedStatus);

            try {
                const response = await fetch(`http://localhost:5000/api/transactions/Statistics-payment?${filterParams}`);
                if (!response.ok) throw new Error("Lỗi khi tải thống kê giao dịch");

                const data = await response.json();
                this.statistics = data;

                // Hủy biểu đồ nếu có lỗi từ localhost hoặc không có dữ liệu
                if (this.statusChart) this.statusChart.destroy();
                if (this.amountChart) this.amountChart.destroy();

                if (data.totalTransactions > 0 || data.totalAmount > 0) {
                    this.renderCharts(); // Render biểu đồ mới nếu có dữ liệu
                } else {
                    alert("Không có dữ liệu cho trạng thái hiện tại.");
                }
            } catch (error) {
                console.error("Lỗi khi tải thống kê giao dịch:", error);
                alert("Lỗi khi tải thống kê giao dịch. Vui lòng kiểm tra kết nối hoặc thử lại.");

                // Hủy biểu đồ nếu có lỗi từ localhost
                if (this.statusChart) this.statusChart.destroy();
                if (this.amountChart) this.amountChart.destroy();
            }
        },
        renderCharts() {
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
.payment-transactions {
    padding: 2.5rem;
    background-color: #ffffff;
    font-family: "Roboto", sans-serif;
    border-radius: 15px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    max-width: 1000px;
    margin: auto;
    color: #2c3e50;
}

.title {
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #27ae60;
}

.title i {
    margin-right: 10px;
    color: #27ae60;
}

.filter-container {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 20px;
    font-size: 16px;
}

.filter-container label {
    font-weight: bold;
    color: #34495e;
}

.filter-container select {
    padding: 10px 12px;
    font-size: 14px;
    border-radius: 6px;
    border: 1px solid #bdc3c7;
    background-color: #f8f9fa;
    color: #2c3e50;
    width: auto;
    /* Điều chỉnh lại để phù hợp */
    box-sizing: border-box;
    transition: border-color 0.3s ease, background-color 0.3s ease;
}

.total-amount {
    font-size: 18px;
    color: #2c3e50;
    margin-bottom: 25px;
    display: flex;
    align-items: center;
    font-weight: bold;
}

.total-amount i {
    margin-right: 8px;
    color: #27ae60;
}

.total-amount span {
    color: #3498db;
    font-weight: bold;
}

.charts {
    display: flex;
    gap: 25px;
    margin-bottom: 30px;
    justify-content: space-between;
}

.chart-container {
    width: 48%;
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    padding: 20px;
    text-align: center;
}

.chart-container h3 {
    font-size: 18px;
    font-weight: bold;
    color: #34495e;
    margin-bottom: 15px;
}

.chart-container h3 i {
    margin-right: 6px;
    color: #27ae60;
}

table {
    width: 100%;
    border-collapse: collapse;
    background-color: #ffffff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

th,
td {
    padding: 10px 10px;
    text-align: center;
    font-size: 15px;
    color: #2c3e50;
    border-bottom: 1px solid #e5e7eb;
    border-radius: 6px 6px 0 0;
}

th {
    background-color: #27ae60;
    color: #ecf0f1;
    font-weight: 600;
}

.status-cell {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
}

.status-cell .status-icon {
    font-size: 18px;
}

.status-cell select {
    padding: 10.5px;
    font-size: 14px;
    border-radius: 6px;
    border: 1px solid #bdc3c7;
    background-color: #f8f9fa;
    color: #2c3e50;
    width: 100%;
    /* Đảm bảo cân đối trong ô */
    box-sizing: border-box;
    transition: border-color 0.3s ease, background-color 0.3s ease;
}

.status-pending {
    background-color: #f39c12;
}

.status-completed {
    background-color: #27ae60;
}

.status-failed {
    background-color: #e74c3c;
}

.status-cell select.status-pending {
    background-color: #f39c12;
    color: #ffffff;
}

.status-cell select.status-completed {
    background-color: #27ae60;
    color: #ffffff;
}

.status-cell select.status-failed {
    background-color: #e74c3c;
    color: #ffffff;
}

button {
    padding: 10px 16px;
    font-size: 14px;
    color: #ffffff;
    border: none;
    border-radius: 8px;
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