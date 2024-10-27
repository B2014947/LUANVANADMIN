<template>
    <div class="reports-container">
        <h2 class="reports-title">Reports</h2>
        <p class="description">Xem báo cáo tại đây.</p>

        <div class="report-table">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tên Báo Cáo</th>
                        <th>Ngày Tạo</th>
                        <th>Trạng Thái</th>
                        <th>Hành Động</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="report in reports" :key="report.id">
                        <td>{{ report.id }}</td>
                        <td>{{ report.title }}</td>
                        <td>{{ new Date(report.createdAt).toLocaleDateString() }}</td>
                        <td>{{ report.status }}</td>
                        <td>
                            <button class="view-button" @click="viewReport(report.id)">Xem</button>
                            <button class="delete-button" @click="deleteReport(report.id)">Xóa</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <button class="generate-report-button" @click="generateReport">Tạo Báo Cáo Mới</button>
    </div>
</template>

<script>
export default {
    name: 'Reports',
    data() {
        return {
            reports: [] // Dữ liệu báo cáo sẽ được lấy từ API
        };
    },
    methods: {
        viewReport(reportId) {
            // Chức năng xem báo cáo
            console.log(`View report with ID: ${reportId}`);
        },
        deleteReport(reportId) {
            // Chức năng xóa báo cáo
            console.log(`Delete report with ID: ${reportId}`);
        },
        generateReport() {
            // Chức năng tạo báo cáo mới
            console.log('Generate new report');
        }
    },
    mounted() {
        // Gọi API để lấy danh sách báo cáo
        this.fetchReports();
    },
    async fetchReports() {
        try {
            const response = await fetch('http://localhost:5000/api/reports');
            this.reports = await response.json();
        } catch (error) {
            console.error('Error fetching reports:', error);
        }
    }
};
</script>

<style scoped>
.reports-container {
    padding: 20px;
    background-color: #ecf0f1;
    /* Màu nền cho trang báo cáo */
}

.reports-title {
    font-size: 28px;
    font-weight: bold;
    color: #34495e;
    margin-bottom: 10px;
}

.description {
    font-size: 16px;
    color: #7f8c8d;
    margin-bottom: 20px;
}

.report-table {
    margin-bottom: 20px;
}

table {
    width: 100%;
    border-collapse: collapse;
}

th,
td {
    border: 1px solid #bdc3c7;
    padding: 12px;
    text-align: left;
}

th {
    background-color: #34495e;
    /* Màu nền tiêu đề bảng */
    color: white;
    /* Màu chữ tiêu đề bảng */
}

tr:nth-child(even) {
    background-color: #f2f2f2;
    /* Màu nền cho hàng chẵn */
}

.view-button,
.delete-button,
.generate-report-button {
    padding: 8px 12px;
    margin: 5px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.view-button {
    background-color: #3498db;
    /* Màu nút xem */
    color: white;
}

.delete-button {
    background-color: #e74c3c;
    /* Màu nút xóa */
    color: white;
}

.generate-report-button {
    background-color: #2ecc71;
    /* Màu nút tạo báo cáo mới */
    color: white;
    margin-top: 10px;
}

.view-button:hover {
    background-color: #2980b9;
    /* Hiệu ứng hover cho nút xem */
}

.delete-button:hover {
    background-color: #c0392b;
    /* Hiệu ứng hover cho nút xóa */
}

.generate-report-button:hover {
    background-color: #27ae60;
    /* Hiệu ứng hover cho nút tạo báo cáo mới */
}
</style>
