<template>
    <div class="statuses-management">
        <h2>Quản lý Trạng Thái Đơn Hàng</h2>

        <!-- Nút thêm mới -->
        <button @click="showAddStatusForm = true" class="add-button">Thêm mới trạng thái</button>

        <!-- Form thêm trạng thái mới -->
        <div v-if="showAddStatusForm" class="form-container">
            <h3>Thêm Trạng Thái Mới</h3>
            <form @submit.prevent="handleAddStatus">
                <label>
                    <strong>Tên Trạng Thái:</strong>
                    <input type="text" v-model="newStatusName" required />
                </label>
                <label>
                    <strong>Mô tả:</strong>
                    <textarea v-model="newDescription" required></textarea>
                </label>
                <button type="submit" class="submit-button">Thêm</button>
                <button type="button" class="back-button" @click="showAddStatusForm = false">Hủy</button>
            </form>
        </div>

        <!-- Danh sách trạng thái -->
        <section class="section">
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
                            <button @click="deleteStatus(status.StatusId)" class="delete-button">Xóa</button>
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
            statuses: [], // Danh sách trạng thái
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
    padding: 2rem;
    background-color: #1e2a38;
    color: #ecf0f1;
    border-radius: 12px;
    max-width: 800px;
    margin: auto;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
    font-family: 'Arial', sans-serif;
}

h2,
h3 {
    text-align: center;
    margin-bottom: 1.5rem;
    font-size: 24px;
    color: #ffffff;
    font-weight: bold;
}

.add-button,
.submit-button,
.back-button {
    background-color: #27ae60;
    color: #fff;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-bottom: 1rem;
}

.add-button:hover,
.submit-button:hover,
.back-button:hover {
    opacity: 0.9;
}

.section {
    margin-top: 2rem;
}

table {
    width: 100%;
    border-collapse: collapse;
}

th,
td {
    border: 1px solid #bdc3c7;
    padding: 12px 15px;
    text-align: left;
}

th {
    background-color: #34495e;
    color: #ecf0f1;
}

.delete-button {
    background-color: #e74c3c;
    color: #fff;
    padding: 5px 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.delete-button:hover {
    opacity: 0.9;
}

.form-container {
    margin-bottom: 2rem;
    background-color: #2c3e50;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

label {
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
    font-size: 14px;
    color: #bdc3c7;
}

input[type="text"],
textarea {
    padding: 12px;
    background-color: #34495e;
    border: 1px solid #7f8c8d;
    border-radius: 6px;
    color: #ecf0f1;
    margin-top: 5px;
    outline: none;
    transition: border-color 0.3s ease;
}

input[type="text"]:focus,
textarea:focus {
    border-color: #27ae60;
}
</style>
