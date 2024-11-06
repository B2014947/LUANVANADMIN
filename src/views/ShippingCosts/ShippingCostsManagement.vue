<template>
    <div class="shipping-costs-management">
        <h2 class="management-title"><i class="fas fa-shipping-fast"></i> Quản lý phí vận chuyển</h2>

        <!-- Nút tạo mới -->
        <div class="filter-container">
            <button @click="goToCreate" class="action-button add">
                <i class="fas fa-plus-circle"></i> Thêm mới chi phí vận chuyển
            </button>
        </div>

        <!-- Danh sách phí vận chuyển -->
        <section class="table-container">
            <h3 class="section-title">Danh sách phí vận chuyển</h3>
            <table>
                <thead>
                    <tr>
                        <th>Shipping ID</th>
                        <th>Province</th>
                        <th>Shipping Cost (VND)</th>
                        <th>Thời gian giao hàng</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="cost in shippingCosts" :key="cost.ShippingId">
                        <td>{{ cost.ShippingId }}</td>
                        <td>{{ cost.Province }}</td>
                        <td>{{ cost.ShippingCosts.toLocaleString() }} VND</td>
                        <td>{{ cost.EstimatedDeliveryTime }} Ngày</td>
                        <td>
                            <button class="action-button edit" @click="goToEditCost(cost.ShippingId)">
                                <i class="fas fa-edit"></i> Sửa
                            </button>
                            <button class="action-button delete" @click="deleteShippingCost(cost.ShippingId)">
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
export default {
    data() {
        return {
            shippingCosts: []
        };
    },
    mounted() {
        this.fetchShippingCosts();
    },
    methods: {
        async fetchShippingCosts() {
            try {
                const response = await fetch('http://localhost:5000/api/ShippingCost');
                if (!response.ok) throw new Error('Failed to fetch data');
                this.shippingCosts = await response.json();
            } catch (error) {
                console.error('Lỗi khi tải danh sách phí vận chuyển:', error);
                alert('Không thể tải dữ liệu phí vận chuyển.');
            }
        },
        goToCreate() {
            this.$router.push({ name: 'ShippingCostsAdd' });
        },
        goToEditCost(shippingId) {
            this.$router.push({ name: 'ShippingCostsEdit', params: { shippingId: shippingId } });
        },
        async deleteShippingCost(shippingId) {
            if (confirm('Bạn có chắc chắn muốn xóa phí vận chuyển này?')) {
                try {
                    const response = await fetch(`http://localhost:5000/api/ShippingCost/${shippingId}`, { method: 'DELETE' });
                    if (!response.ok) throw new Error('Failed to delete');
                    this.fetchShippingCosts();
                    alert('Phí vận chuyển đã được xóa thành công.');
                } catch (error) {
                    console.error('Lỗi khi xóa phí vận chuyển:', error);
                    alert('Đã xảy ra lỗi khi xóa phí vận chuyển.');
                }
            }
        }
    }
};
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

.shipping-costs-management {
    padding: 2rem;
    background-color: #ffffff;
    color: #2c3e50;
    border-radius: 12px;
    max-width: 900px;
    margin: 30px auto;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    font-family: 'Roboto', sans-serif;
}

.management-title {
    font-size: 1.8rem;
    font-weight: bold;
    color: #27ae60;
    text-align: center;
    margin-bottom: 20px;
}

.table-container {
    margin-top: 1rem;
    overflow-x: auto;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
    background-color: #ffffff;
}

table {
    width: 100%;
    border-collapse: collapse;
    background-color: #f4f4f4;
    border-radius: 8px;
    overflow: hidden;
}

thead th {
    background-color: #27ae60;
    color: #ffffff;
    padding: 12px;
    font-weight: 600;
    text-align: left;
    border-radius: 6px 6px 0 0;
}

tbody td {
    padding: 12px;
    color: #2c3e50;
    border-bottom: 1px solid #dee2e6;
}

tbody tr:hover {
    background-color: #f1f8f5;
}

.section-title {
    text-align: center;
    font-size: 1.2rem;
    font-weight: bold;
    color: #34495e;
    margin-bottom: 15px;
}

.action-button {
    padding: 12px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
    font-weight: 500;
    color: #ffffff;
    transition: background-color 0.3s ease, transform 0.2s ease;
    align-items: center;
    margin: 5px;
    gap: 10px;
}

.add {
    background-color: #4caf50;
}

.edit {
    background-color: #f39c12;
}

.delete {
    background-color: #e74c3c;
}

.action-button:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.add:hover {
    background-color: #388e3c;
}

.edit:hover {
    background-color: #1e88e5;
}

.delete:hover {
    background-color: #c0392b;
}

.filter-container {
    display: flex;
    justify-content: center;
    margin-bottom: 24px;
    gap: 12px;
}
</style>
