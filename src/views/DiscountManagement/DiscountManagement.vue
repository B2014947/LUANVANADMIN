<template>
    <div class="discounts-management">
        <h2 class="management-title">Quản lý Khuyến Mãi</h2>

        <!-- Nút thêm mới -->
        <button @click="goToAddDiscount" class="add-button">Thêm mới khuyến mãi</button>

        <!-- Tìm kiếm khuyến mãi -->
        <div class="search-container">
            <input type="text" v-model="searchCriteria.discountCode" placeholder="Mã khuyến mãi" />
            <input type="text" v-model="searchCriteria.description" placeholder="Mô tả" />
            <button @click="searchDiscounts" class="search-button">Tìm kiếm</button>
        </div>

        <!-- Danh sách khuyến mãi -->
        <section class="section">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Mã Khuyến Mãi</th>
                        <th>Mô tả</th>
                        <th>Phần trăm giảm giá</th>
                        <th>Ngày hết hạn</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="discount in discounts" :key="discount.DiscountId">
                        <td>{{ discount.DiscountId }}</td>
                        <td>{{ discount.DiscountCode }}</td>
                        <td>{{ discount.Description }}</td>
                        <td>{{ discount.DiscountPercentage }}%</td>
                        <td>{{ formatDate(discount.ExpiryDate) }}</td>
                        <td>{{ discount.IsActive ? 'Hoạt động' : 'Không hoạt động' }}</td>
                        <td>
                            <button @click="goToEditDiscount(discount.DiscountId)" class="edit-button">Sửa</button>
                            <button @click="deleteDiscount(discount.DiscountId)" class="delete-button">Xóa</button>
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
            discounts: [], // Danh sách khuyến mãi
            searchCriteria: {
                discountCode: '',
                description: ''
            }
        };
    },
    mounted() {
        this.fetchDiscounts();
    },
    methods: {
        async fetchDiscounts() {
            try {
                const response = await fetch('http://localhost:5000/api/discounts');
                this.discounts = await response.json();
            } catch (error) {
                console.error('Lỗi khi tải danh sách khuyến mãi:', error);
                alert('Đã xảy ra lỗi khi tải dữ liệu.');
            }
        },
        goToAddDiscount() {
            this.$router.push({ name: 'DiscountAdd' });
        },
        goToEditDiscount(discountId) {
            this.$router.push({ name: 'DiscountEdit', params: { discountId } });
        },
        async deleteDiscount(discountId) {
            if (confirm('Bạn có chắc chắn muốn xóa khuyến mãi này?')) {
                try {
                    await fetch(`http://localhost:5000/api/discounts/${discountId}`, { method: 'DELETE' });
                    alert('Khuyến mãi đã được xóa thành công');
                    this.fetchDiscounts();
                } catch (error) {
                    console.error('Lỗi khi xóa khuyến mãi:', error);
                    alert('Đã xảy ra lỗi khi xóa khuyến mãi.');
                }
            }
        },
        async searchDiscounts() {
            try {
                const queryParams = new URLSearchParams(this.searchCriteria).toString();
                const response = await fetch(`http://localhost:5000/api/discounts/search?${queryParams}`);
                this.discounts = await response.json();
            } catch (error) {
                console.error('Lỗi khi tìm kiếm khuyến mãi:', error);
                alert('Đã xảy ra lỗi khi tìm kiếm.');
            }
        },
        formatDate(date) {
            return new Date(date).toLocaleDateString('vi-VN');
        }
    }
};
</script>

<style scoped>
.discounts-management {
    padding: 24px;
    background-color: #f9f9f9;
    border-radius: 12px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    font-family: 'Roboto', sans-serif;
    max-width: 800px;
    margin: auto;
}

.management-title {
    font-size: 26px;
    font-weight: 700;
    color: #2d3e50;
    margin-bottom: 8px;
    text-align: center;
}

.search-container {
    margin-bottom: 20px;
    display: flex;
    gap: 10px;
}

.search-container input {
    padding: 10px;
    border: 1px solid #bdc3c7;
    border-radius: 5px;
    flex: 1;
}

.add-button,
.search-button,
.edit-button,
.delete-button {
    background-color: #27ae60;
    /* Màu xanh cho các nút thêm mới và tìm kiếm */
    color: #fff;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
    /* Thêm hiệu ứng chuyển động */
}

.add-button:hover,
.search-button:hover,
.edit-button:hover,
.delete-button:hover {
    opacity: 0.9;
    transform: scale(1.05);
    /* Tăng kích thước nút khi hover */
}

.table-container {
    overflow-x: auto;
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
}

th {
    background-color: #34495e;
    color: #ecf0f1;
    border-radius: 8px 8px 0 0;
    /* Góc bo cho header bảng */
}

tbody tr:hover {
    background-color: #f1f3f5;
    /* Đổi màu hàng khi hover */
}

.edit-button {
    background-color: #3498db;
    /* Màu xanh dương cho nút sửa */
}

.delete-button {
    background-color: #e74c3c;
    /* Màu đỏ cho nút xóa */
}

.edit-button:hover,
.delete-button:hover {
    opacity: 0.9;
    /* Hiệu ứng hover cho nút sửa và xóa */
}
</style>
