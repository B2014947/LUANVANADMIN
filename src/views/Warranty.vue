<template>
    <div>
        <h1>Quản lý bảo hành</h1>
        <!-- Thông báo lỗi hoặc thành công -->
        <div v-if="message" :class="message.type" class="message">{{ message.text }}</div>
        <div v-if="error" class="error">{{ error }}</div>

        <table v-if="warranties.length > 0">
            <thead>
                <tr>
                    <th>ID bảo hành</th>
                    <th>Sản phẩm</th>
                    <th>Người dùng</th>
                    <th>Ngày bắt đầu</th>
                    <th>Ngày kết thúc</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="warranty in warranties" :key="warranty.WarrantyId">
                    <td>{{ warranty.WarrantyId }}</td>
                    <td>{{ warranty.ProductName }}</td>
                    <td>{{ warranty.UserName }}</td>
                    <td>{{ formatDate(warranty.WarrantyStartDate) }}</td>
                    <td>{{ formatDate(warranty.WarrantyEndDate) }}</td>
                    <td>{{ warranty.Status }}</td>
                    <td>
                        <button v-if="warranty.Status === 'Yêu câù bảo hành'" @click="openUpdateModal(warranty)">Cập
                            nhật
                            trạng thái</button>
                        <button v-if="warranty.Status === 'Đang xử lý'" @click="openUpdateModal(warranty)">Đang xử
                            lý</button>
                    </td>
                </tr>
            </tbody>
        </table>

        <div v-else>
            <p>Không có bảo hành nào.</p>
        </div>

        <!-- Modal để chỉnh sửa bảo hành -->
        <div v-if="isModalOpen" class="modal-overlay" :class="{ show: isModalOpen }">
            <div class="modal">
                <h2>Cập nhật bảo hành</h2>
                <form @submit.prevent="updateWarranty">
                    <div>
                        <label for="status">Trạng thái</label>
                        <select v-model="selectedWarranty.Status" id="status" required>
                            <option value="Yêu câù bảo hành">Yêu câù bảo hành</option>
                            <option value="Đang xử lý">Đang xử lý</option>
                            <option value="Hoàn tất">Hoàn tất</option>
                        </select>
                    </div>
                    <button type="submit">Cập nhật</button>
                    <button type="button" @click="closeModal">Hủy</button>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            warranties: [],
            error: '',
            message: null,
            isModalOpen: false,
            selectedWarranty: null,
        };
    },
    created() {
        this.fetchWarranties();
    },
    methods: {
        async fetchWarranties() {
            try {
                const response = await axios.get('http://localhost:5000/api/Warranty/warranties');
                this.warranties = response.data.warranties;
            } catch (err) {
                this.error = 'Không thể lấy thông tin bảo hành.';
            }
        },
        openUpdateModal(warranty) {
            // Mở modal và thiết lập bảo hành đã chọn
            this.selectedWarranty = { ...warranty };
            this.isModalOpen = true;
        },
        closeModal() {
            // Đóng modal và reset thông tin bảo hành
            this.isModalOpen = false;
            this.selectedWarranty = null;
        },
        async updateWarranty() {
            try {
                const { WarrantyId, Status, IssueDescription } = this.selectedWarranty;
                const response = await axios.put(`http://localhost:5000/api/Warranty/warranties/${WarrantyId}/status`, {
                    status: Status,
                    issueDescription: IssueDescription
                });
                if (response.status === 200) {
                    const warrantyIndex = this.warranties.findIndex(w => w.WarrantyId === WarrantyId);
                    this.warranties[warrantyIndex].Status = Status;
                    this.warranties[warrantyIndex].IssueDescription = IssueDescription;
                    this.message = {
                        text: 'Bảo hành đã được cập nhật thành công!',
                        type: 'success',
                    };
                    this.closeModal();
                }
            } catch (err) {
                this.message = {
                    text: 'Không thể cập nhật bảo hành.',
                    type: 'error',
                };
            }
        },
        formatDate(date) {
            const d = new Date(date);
            return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
        }
    }
};
</script>

<style scoped>
/* Định dạng lỗi */
.error {
    color: red;
}

/* Thông báo thành công và lỗi */
.message {
    padding: 10px;
    margin: 10px 0;
    border-radius: 5px;
    font-weight: bold;
}

.message.success {
    background-color: #d4edda;
    color: #155724;
}

.message.error {
    background-color: #f8d7da;
    color: #721c24;
}

/* Định dạng bảng */
table {
    width: 100%;
    border-collapse: collapse;
}

th,
td {
    padding: 10px;
    border: 1px solid #ddd;
    text-align: center;
}

button {
    padding: 5px 10px;
    margin-top: 5px;
}

/* Modal Overlay */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    /* Màu nền mờ */
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    /* Ẩn modal ban đầu */
    transition: opacity 0.3s ease-in-out;
    /* Hiệu ứng fade */
}

.modal-overlay.show {
    opacity: 1;
    /* Hiển thị modal */
}

.modal {
    background: white;
    padding: 30px;
    border-radius: 10px;
    width: 450px;
    max-width: 100%;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
    /* Tạo bóng cho modal */
    animation: modalFadeIn 0.3s ease-out;
    /* Thêm hiệu ứng fade-in */
}

/* Định dạng cho form trong modal */
.modal h2 {
    text-align: center;
    color: #333;
    font-size: 24px;
    margin-bottom: 20px;
}

/* Trường nhập liệu */
.modal input,
.modal select,
.modal textarea {
    width: 100%;
    padding: 12px;
    margin-bottom: 15px;
    border-radius: 8px;
    border: 1px solid #ccc;
    font-size: 16px;
    box-sizing: border-box;
}

/* Định dạng textarea */
.modal textarea {
    height: 100px;
    resize: vertical;
}

/* Nút submit và hủy */
.modal button {
    padding: 12px 20px;
    font-size: 16px;
    border: none;
    cursor: pointer;
    border-radius: 8px;
    transition: background-color 0.3s ease;
    width: 100%;
    margin-bottom: 10px;
}

.modal button[type="submit"] {
    background-color: #4CAF50;
    color: white;
}

.modal button[type="button"] {
    background-color: #f44336;
    color: white;
}

.modal button[type="submit"]:hover {
    background-color: #45a049;
}

.modal button[type="button"]:hover {
    background-color: #e53935;
}

/* Hiệu ứng fade cho modal */
@keyframes modalFadeIn {
    0% {
        opacity: 0;
        transform: translateY(-50px);
    }

    100% {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
