<template>
    <div class="discounts-management">
        <h2 class="management-title"><i class="fas fa-tags"></i> Quản lý Khuyến Mãi</h2>

        <!-- Nút thêm mới -->
        <button @click="goToAddDiscount" class="add-button">
            <i class="fas fa-plus-circle"></i> Thêm mới khuyến mãi
        </button>

        <!-- Tìm kiếm khuyến mãi -->
        <div class="search-container">
            <input type="text" v-model="searchCriteria.discountCode" placeholder="🔍 Mã khuyến mãi" />
            <input type="text" v-model="searchCriteria.description" placeholder="🔍 Mô tả" />
            <button @click="searchDiscounts" class="search-button">
                <i class="fas fa-search"></i> Tìm kiếm
            </button>
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
                            <button @click="goToEditDiscount(discount.DiscountId)" class="edit-button">
                                <i class="fas fa-edit"></i> Sửa
                            </button>
                            <button @click="deleteDiscount(discount.DiscountId)" class="delete-button">
                                <i class="fas fa-trash-alt"></i> Xóa
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </section>
    </div>
</template>


<script>
import Swal from 'sweetalert2';
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
            const result = await Swal.fire({
                title: 'Bạn có chắc chắn muốn xóa khuyến mãi này?',
                text: "Hành động này không thể hoàn tác!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Xóa',
                cancelButtonText: 'Hủy'
            });

            if (result.isConfirmed) {
                try {
                    await fetch(`http://localhost:5000/api/discounts/${discountId}`, { method: 'DELETE' });
                    Swal.fire('Đã xóa!', 'Khuyến mãi đã được xóa thành công.', 'success');
                    this.fetchDiscounts();
                } catch (error) {
                    console.error('Lỗi khi xóa khuyến mãi:', error);
                    Swal.fire('Lỗi', 'Đã xảy ra lỗi khi xóa khuyến mãi.', 'error');
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
    padding: 2.5rem;
    background-color: #ffffff;
    border-radius: 15px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    font-family: 'Roboto', sans-serif;
    max-width: 1000px;
    margin: 40px auto;
    color: #2c3e50;
}

.management-title {
    font-size: 28px;
    font-weight: bold;
    color: #27ae60;
    text-align: center;
    margin-bottom: 20px;
}

.search-container {
    margin-top: 20px;
    margin-bottom: 20px;
    display: flex;
    gap: 15px;
}

.search-container input {
    padding: 12px;
    border: 1px solid #bdc3c7;
    border-radius: 8px;
    flex: 1;
    background-color: #ecf0f1;
    color: #2c3e50;
    outline: none;
    transition: border-color 0.3s ease;
}

.search-container input:focus {
    border-color: #27ae60;
    box-shadow: 0 0 8px rgba(39, 174, 96, 0.3);
}

.add-button,
.search-button,
.edit-button,
.delete-button {
    margin: 5px;
    padding: 12px 16px;
    border: none;
    border-radius: 8px;
    color: #ffffff;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s ease, transform 0.2s ease;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.add-button,
.search-button {
    background-color: #27ae60;
}

.edit-button {
    background-color: #f39c12;
}

.delete-button {
    background-color: #e74c3c;
}

.add-button:hover,
.search-button:hover,
.edit-button:hover,
.delete-button:hover {
    opacity: 0.9;
    transform: scale(1.05);
}

.table-container {
    overflow-x: auto;
}

table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1.5rem;
    background-color: #ffffff;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
}

th,
td {
    padding: 15px 10px;
    text-align: left;
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

tbody tr:hover {
    background-color: #f1f8f5;
}
</style>
