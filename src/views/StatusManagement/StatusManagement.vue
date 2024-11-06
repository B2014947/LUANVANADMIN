<template>
    <div class="statuses-management">
        <h2 class="management-title">Quản lý Trạng Thái Đơn Hàng</h2>

        <!-- Nút thêm mới -->
        <button @click="showAddStatusForm = true" class="action-button add">Thêm mới trạng thái</button>

        <!-- Form thêm trạng thái mới -->
        <div v-if="showAddStatusForm" class="form-container">
            <h3 class="form-title">Thêm Trạng Thái Mới</h3>
            <form @submit.prevent="handleAddStatus">
                <label>
                    Tên Trạng Thái:
                    <input type="text" v-model="newStatusName" required />
                </label>
                <label>
                    Mô tả:
                    <textarea v-model="newDescription" required></textarea>
                </label>
                <button type="submit" class="action-button submit">Thêm</button>
                <button type="button" class="action-button cancel" @click="showAddStatusForm = false">Hủy</button>
            </form>
        </div>

        <!-- Danh sách trạng thái -->
        <section class="table-container">
            <h3 class="section-title">Danh sách trạng thái</h3>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tên Trạng Thái</th>
                        <th>Mô tả</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="status in statuses" :key="status.StatusId">
                        <td>{{ status.StatusId }}</td>
                        <td>{{ status.StatusName }}</td>
                        <td>{{ status.Description }}</td>
                        <td>
                            <button @click="deleteStatus(status.StatusId)" class="action-button delete">Xóa</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </section>
    </div>
</template>

<script>
export default {
    data() {
        return {
            statuses: [],
            newStatusName: '',
            newDescription: '',
            showAddStatusForm: false
        };
    },
    mounted() {
        this.fetchStatuses();
    },
    methods: {
        async fetchStatuses() {
            try {
                const response = await fetch('http://localhost:5000/api/Status');
                this.statuses = await response.json();
            } catch (error) {
                console.error('Lỗi khi tải danh sách trạng thái:', error);
                alert('Đã xảy ra lỗi khi tải dữ liệu.');
            }
        },
        async handleAddStatus() {
            try {
                const response = await fetch('http://localhost:5000/api/Status/create-status', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        statusName: this.newStatusName,
                        description: this.newDescription
                    })
                });

                if (!response.ok) {
                    throw new Error('Lỗi khi thêm trạng thái mới');
                }

                alert('Trạng thái đã được thêm thành công');
                this.showAddStatusForm = false;
                this.newStatusName = '';
                this.newDescription = '';
                this.fetchStatuses();
            } catch (error) {
                console.error('Lỗi khi thêm trạng thái mới:', error);
                alert('Đã xảy ra lỗi khi thêm trạng thái.');
            }
        },
        async deleteStatus(statusId) {
            if (confirm('Bạn có chắc chắn muốn xóa trạng thái này?')) {
                try {
                    await fetch(`http://localhost:5000/api/Status/${statusId}`, { method: 'DELETE' });
                    alert('Trạng thái đã được xóa thành công');
                    this.fetchStatuses();
                } catch (error) {
                    console.error('Lỗi khi xóa trạng thái:', error);
                    alert('Đã xảy ra lỗi khi xóa trạng thái.');
                }
            }
        }
    }
};
</script>

<style scoped>
.statuses-management {
    padding: 2.5rem;
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    font-family: 'Roboto', sans-serif;
    max-width: 900px;
    margin: auto;
}

.management-title {
    font-size: 28px;
    font-weight: bold;
    color: #27ae60;
    margin-bottom: 20px;
    text-align: center;
}

.table-container {
    overflow-x: auto;
    margin-top: 20px;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
    background-color: #f7f9fc;
}

table {
    width: 100%;
    border-collapse: collapse;
}

thead th {
    background-color: #27ae60;
    color: #ffffff;
    padding: 12px;
    text-align: left;
    font-weight: bold;
    border-radius: 6px 6px 0 0;
}

tbody td {
    padding: 12px;
    border-bottom: 1px solid #e5e7eb;
    color: #2d3e50;
}

tbody tr:hover {
    background-color: #e8f5e9;
}

.action-button {
    padding: 10px 15px;
    margin: 3px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;
    color: #fff;
    transition: background-color 0.3s ease, transform 0.2s ease;
}

.add {
    background-color: #27ae60;
}

.submit {
    background-color: #27ae60;
}

.cancel {
    background-color: #e74c3c;
}

.delete {
    background-color: #e74c3c;
}

.action-button:hover {
    opacity: 0.9;
    transform: scale(1.05);
}

.form-container {
    background-color: #2c3e50;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    margin-top: 20px;
}

.form-title {
    font-size: 22px;
    font-weight: bold;
    color: #ffffff;
    text-align: center;
    margin-bottom: 20px;
}

label {
    display: block;
    font-size: 16px;
    color: #bdc3c7;
    margin-bottom: 10px;
}

input[type="text"],
textarea {
    width: 100%;
    padding: 12px;
    background-color: #34495e;
    border: 1px solid #7f8c8d;
    border-radius: 8px;
    color: #ecf0f1;
    margin-top: 5px;
    font-size: 15px;
    outline: none;
    transition: border-color 0.3s ease;
}

input[type="text"]:focus,
textarea:focus {
    border-color: #27ae60;
}
</style>
