<template>
    <div class="payment-transactions">
        <h2 class="title">
            <i class="fas fa-wallet"></i> Quản lý Giao dịch Thanh toán
        </h2>

        <div class="filter-container">
            <label>Trạng thái:</label>
            <select v-model="selectedStatus" @change="fetchStatistics">
                <option value="">Tất cả trạng thái</option>
                <option value="Pending">Chờ xử lý</option>
                <option value="Completed">Hoàn thành</option>
                <option value="Failed">Thất bại</option>
            </select>


            <label>Ngày:</label>
            <input type="date" v-model="selectedDate" @change="fetchStatistics" />

            <label>Tháng:</label>
            <input type="month" v-model="selectedMonth" @change="fetchStatistics" />

            <label>Năm:</label>
            <input type="number" v-model="selectedYear" @change="fetchStatistics" min="2000" />
        </div>

        <p class="total-amount">
            <i class="fas fa-coins"></i> Tổng số tiền giao dịch:
            <span>{{ statistics.totalAmount ? statistics.totalAmount.toLocaleString() : '0' }} VND</span>
        </p>

        <!-- Biểu đồ thống kê -->
        <div class="charts">
            <h3>
                <i class="fas fa-chart-line"></i> Thống kê Giao dịch
            </h3>
            <div class="chart-container">
                <canvas id="transactionChart" width="100" height="100"></canvas>
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
                    <!-- <th>Hành động</th> -->
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
                    <!-- <td>
                        <button class="delete-button" @click="deleteTransaction(transaction.TransactionId)">
                            <i class="fas fa-trash-alt"></i> Xóa
                        </button>
                    </td> -->
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import Swal from 'sweetalert2'; // Import SweetAlert2
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, LineController, BarController, BarElement } from 'chart.js';
import { nextTick } from 'vue';
// Đăng ký các thành phần cần thiết cho biểu đồ line
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    LineController,
    BarController,
    BarElement
);

export default {
    data() {
        return {
            transactions: [],
            statistics: {
                totalAmount: 0,
                dailyAmounts: [],
                monthlyAmounts: [],
                yearlyAmounts: []
            },
            selectedStatus: '',
            selectedDate: '',
            selectedMonth: '',
            selectedYear: '',
            chart: null // Biến để giữ đối tượng Chart
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

                const data = await response.json();

                // Sắp xếp giao dịch theo ngày giảm dần (giao dịch mới nhất lên đầu)
                this.transactions = data.sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate));
            } catch (error) {
                console.error("Không thể tải danh sách giao dịch:", error);
                Swal.fire({
                    title: 'Lỗi!',
                    text: 'Không thể tải danh sách giao dịch.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
                alert("Lỗi khi tải danh sách giao dịch.");
            }
        }
        ,
        async fetchStatistics() {
            const filterParams = new URLSearchParams();

            // Lọc theo trạng thái (Status filter)
            if (this.selectedStatus) {
                filterParams.set('status', this.selectedStatus);
            }

            // Lọc theo ngày (Date filter)
            if (this.selectedDate) {
                const formattedDate = new Date(this.selectedDate).toISOString().split('T')[0]; // Convert to YYYY-MM-DD format
                filterParams.set('date', formattedDate);
            }

            // Lọc theo tháng và năm (Month and Year filter)
            if (this.selectedMonth && this.selectedYear) {
                const month = this.selectedMonth.split('-')[1]; // Extract month from 'YYYY-MM'
                const year = this.selectedYear; // Take the year directly

                filterParams.set('month', month);
                filterParams.set('year', year);
            } else if (this.selectedMonth) {
                const month = this.selectedMonth.split('-')[1]; // Extract month from 'YYYY-MM'
                const year = new Date().getFullYear(); // Use current year if only month is selected

                filterParams.set('month', month);
                filterParams.set('year', year);
            } else if (this.selectedYear) {
                filterParams.set('year', this.selectedYear);
            }

            // Xây dựng URL API với các tham số
            const url = filterParams.toString()
                ? `http://localhost:5000/api/transactions/Statistics-payment?${filterParams.toString()}`
                : 'http://localhost:5000/api/transactions/Statistics-payment';

            console.log("Request URL:", url);  // Log URL để kiểm tra

            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error("Lỗi khi tải thống kê giao dịch");

                const data = await response.json();
                console.log("API data:", data);  // Log dữ liệu trả về từ API

                // Xử lý thống kê
                if (data.dailyAmounts) {
                    this.statistics.totalAmount = data.dailyAmounts.reduce((acc, cur) => acc + cur.totalAmount, 0);
                } else if (data.monthlyAmounts) {
                    this.statistics.totalAmount = data.monthlyAmounts.reduce((acc, cur) => acc + cur.totalAmount, 0);
                } else if (data.yearlyAmounts) {
                    this.statistics.totalAmount = data.yearlyAmounts.reduce((acc, cur) => acc + cur.totalAmount, 0);
                } else if (data.statusAmounts) {
                    this.statistics.totalAmount = data.statusAmounts.reduce((acc, cur) => acc + cur.totalAmount, 0);
                } else {
                    this.statistics = data;  // Khi không có dữ liệu theo các loại lọc
                }

                // Sau khi dữ liệu đã sẵn sàng, gọi renderChart
                nextTick(() => {
                    this.renderChart(data);
                });

            } catch (error) {
                console.error("Lỗi khi tải thống kê giao dịch:", error);
                Swal.fire({
                    title: 'Lỗi!',
                    text: 'Lỗi khi tải thống kê giao dịch. Vui lòng kiểm tra kết nối hoặc thử lại.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        }
        ,

        renderChart(data) {
            const ctx = document.getElementById('transactionChart').getContext('2d');

            // Xóa biểu đồ cũ nếu có
            if (this.chart) {
                this.chart.destroy();  // Hủy bỏ biểu đồ cũ ngay lập tức
            }

            console.log("Đang vẽ lại biểu đồ với dữ liệu:", data);  // Log dữ liệu biểu đồ

            const labels = [];
            const values = [];

            // Nếu không có bộ lọc, hiển thị tổng số tiền
            if (!this.selectedStatus && !this.selectedDate && !this.selectedMonth && !this.selectedYear) {
                // Hiển thị tổng số tiền cho tất cả các giao dịch
                const totalAmount = this.statistics.totalAmount || 0; // Nếu không có tổng số tiền, mặc định là 0
                labels.push("Tổng Số Tiền");
                values.push(totalAmount);
            }

            // Kiểm tra statusAmounts sau khi tổng số tiền được hiển thị
            if (data.statusAmounts && data.statusAmounts.length > 0) {
                console.log("Dữ liệu statusAmounts:", data.statusAmounts);  // Kiểm tra statusAmounts
                data.statusAmounts.forEach(item => {
                    labels.push(item.TransactionStatus);  // Trạng thái giao dịch (chắc là TransactionStatus)
                    values.push(item.totalAmount);  // Tổng số tiền tương ứng với trạng thái đó
                });
            }

            // Tiếp tục xử lý các loại dữ liệu khác nếu không có statusAmounts
            else if (data.dailyAmounts && data.dailyAmounts.length > 0) {
                data.dailyAmounts.forEach(item => {
                    labels.push(item.date);
                    values.push(item.totalAmount);
                });
            } else if (data.monthlyAmounts && data.monthlyAmounts.length > 0) {
                data.monthlyAmounts.forEach(item => {
                    labels.push(item.month);
                    values.push(item.totalAmount);
                });
            } else if (data.yearlyAmounts && data.yearlyAmounts.length > 0) {
                data.yearlyAmounts.forEach(item => {
                    labels.push(item.year);
                    values.push(item.totalAmount);
                });
            }

            // Kiểm tra lại labels và values trước khi vẽ biểu đồ
            if (labels.length === 0 || values.length === 0) {
                console.error("Dữ liệu không hợp lệ để vẽ biểu đồ");
                return;
            }

            // Kiểm tra xem dữ liệu có thay đổi trước khi gọi update
            if (!this.chart || !this.chart.data.labels.every((label, index) => label === labels[index]) || !this.chart.data.datasets[0].data.every((value, index) => value === values[index])) {
                // Tạo mới biểu đồ cột nếu dữ liệu thay đổi
                this.chart = new ChartJS(ctx, {
                    type: 'bar',  // Đổi kiểu biểu đồ từ line sang bar
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Số tiền giao dịch (VND)',
                            data: values,
                            backgroundColor: '#27ae60',  // Màu nền của cột
                            borderColor: '#2c3e50',  // Màu viền cột
                            borderWidth: 1  // Độ dày viền cột
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            title: {
                                display: true,
                                text: 'Biểu đồ thống kê giao dịch'
                            },
                            tooltip: {
                                callbacks: {
                                    label: (tooltipItem) => {
                                        // Hiển thị số tiền với định dạng VND
                                        return tooltipItem.raw.toLocaleString() + ' VND';
                                    }
                                }
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,  // Đảm bảo trục Y bắt đầu từ 0
                                ticks: {
                                    callback: function (value) {
                                        return value.toLocaleString();  // Định dạng số với dấu phân cách hàng nghìn
                                    }
                                }
                            }
                        }
                    }
                });
            } else {
                // Nếu dữ liệu không thay đổi, chỉ cần gọi update
                this.chart.update();
            }
        }
        ,

        getStatusIcon(status) {
            switch (status) {
                case "Pending": return "fas fa-hourglass-half status-pending-icon";
                case "Completed": return "fas fa-check-circle status-completed-icon";
                case "Failed": return "fas fa-times-circle status-failed-icon";
                default: return "";
            }
        },

        async updateTransactionStatus(transaction) {
            // Hiển thị hộp thoại xác nhận trước khi cập nhật trạng thái
            const result = await Swal.fire({
                title: 'Xác nhận cập nhật trạng thái giao dịch?',
                text: "Bạn chắc chắn muốn thay đổi trạng thái giao dịch này?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Cập nhật',
                cancelButtonText: 'Hủy'
            });

            // Nếu người dùng không nhấn "Cập nhật", hủy thao tác
            if (!result.isConfirmed) return;

            try {
                const response = await fetch(`http://localhost:5000/api/transactions/${transaction.TransactionId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ transactionStatus: transaction.TransactionStatus }),
                });
                if (!response.ok) throw new Error("Error updating transaction status");

                // Thông báo thành công
                Swal.fire({
                    title: 'Thành công!',
                    text: 'Trạng thái giao dịch đã được cập nhật.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then(() => {
                    setTimeout(() => {
                        window.location.reload(); // Reload trang sau khi nhấn OK
                    }, 100);
                });

                // Tải lại dữ liệu thống kê (nếu cần thiết, nhưng reload trang sẽ làm mới toàn bộ)
                // this.fetchStatistics(); // Nếu không reload trang, bạn có thể gọi hàm này ở đây để làm mới thống kê

            } catch (error) {
                console.error("Không thể cập nhật trạng thái giao dịch:", error);
                Swal.fire({
                    title: 'Lỗi!',
                    text: 'Lỗi khi cập nhật trạng thái giao dịch.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        },


        async deleteTransaction(transactionId) {
            // Thay confirm bằng SweetAlert2 với kiểu 'warning'
            const result = await Swal.fire({
                title: 'Bạn có chắc chắn muốn xóa giao dịch này không?',
                text: "Hành động này không thể hoàn tác.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Xóa',
                cancelButtonText: 'Hủy'
            });

            if (!result.isConfirmed) return; // Nếu người dùng không xác nhận, thoát hàm

            try {
                const response = await fetch(`http://localhost:5000/api/transactions/${transactionId}`, { method: "DELETE" });
                if (!response.ok) throw new Error("Error deleting transaction");

                // Tải lại danh sách giao dịch và thống kê
                this.fetchTransactions();
                this.fetchStatistics();

                // Thông báo thành công
                Swal.fire({
                    title: 'Thành công!',
                    text: 'Giao dịch đã được xóa.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });

            } catch (error) {
                console.error("Không thể xóa giao dịch:", error);
                // Thông báo lỗi
                Swal.fire({
                    title: 'Lỗi!',
                    text: 'Lỗi khi xóa giao dịch.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        }
        ,

        formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString('vi-VN');
        }
    }
};
</script>

<style scoped>
.charts h3 {
    text-align: center;
    align-items: center;
}

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

.chart-container {
    width: 30%;
    /* Hoặc thay đổi width nếu cần */
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    padding: 20px;
    text-align: center;
    position: relative;
    margin: 0 auto;
    /* Căn giữa container */
    display: flex;
    justify-content: center;
    /* Căn giữa nội dung trong container */
    align-items: center;
    /* Căn giữa theo chiều dọc */
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

/* Cải tiến cho canvas biểu đồ */
#transactionChart {
    width: 100% !important;
    height: 400px;
    /* Đảm bảo chiều cao ổn định cho biểu đồ */
    background-color: #f9f9f9;
    /* Thêm nền sáng cho biểu đồ */
    border-radius: 12px;
    border: 1px solid #ddd;
    /* Viền nhẹ quanh biểu đồ */
}

/* Cải tiến màu sắc và các hiệu ứng hover cho biểu đồ */
.chart-container .chart-tooltip {
    background-color: rgba(0, 0, 0, 0.7);
    color: #fff;
    border-radius: 6px;
    padding: 6px 10px;
    font-size: 14px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

/* Các đường trong biểu đồ */
.chartjs-render-monitor {
    border-color: #2c3e50 !important;
    /* Đặt màu đường viền của canvas */
}

.chartjs-tooltip {
    font-size: 14px;
    background-color: #27ae60 !important;
    /* Thêm màu nền cho tooltip */
    color: #fff;
    border-radius: 5px;
    padding: 5px 10px;
}

/* Tùy chỉnh cho các điểm và đường trong biểu đồ */
.chartjs-legend {
    display: none;
    /* Ẩn legend nếu không cần thiết */
}

.chartjs-dataset-0 {
    border-width: 3px;
    /* Tăng độ dày cho đường trong biểu đồ */
}

/* Thêm bóng cho các đường vẽ trong biểu đồ */
.chartjs-dataset-0 {
    box-shadow: 0 2px 10px rgba(39, 174, 96, 0.3);
    /* Hiệu ứng bóng nhẹ cho các đường */
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