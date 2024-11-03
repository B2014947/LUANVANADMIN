<template>
    <div class="discounts-management">
        <h2>Quản lý Khuyến Mãi</h2>

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
    padding: 2rem;
    background-color: #1e2a38;
    color: #ecf0f1;
    border-radius: 12px;
    max-width: 1200px;
    margin: auto;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
    font-family: 'Arial', sans-serif;
}

h2 {
    text-align: center;
    margin-bottom: 1.5rem;
    font-size: 24px;
    color: #ffffff;
    font-weight: bold;
}

.add-button,
.search-button {
    background-color: #27ae60;
    color: #fff;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-bottom: 1rem;
}

.add-button:hover,
.search-button:hover {
    opacity: 0.9;
}

.search-container {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.5rem;
}

.search-container input {
    flex: 1;
    padding: 10px 15px;
    border: 1px solid #bdc3c7;
    border-radius: 5px;
}

table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
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

button {
    padding: 8px 12px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin: 0 2px;
}

.edit-button {
    background-color: #3498db;
    color: #fff;
}

.delete-button {
    background-color: #e74c3c;
    color: #fff;
}

button:hover {
    opacity: 0.9;
    transform: scale(1.02);
}

button:active {
    transform: scale(1);
}

button:focus {
    outline: 2px solid #27ae60;
}
</style>
