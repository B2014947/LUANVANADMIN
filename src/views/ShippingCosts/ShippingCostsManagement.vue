<template>
    <div class="shipping-costs-management">
        <h2 class="management-title"><i class="fas fa-shipping-fast"></i> Quản lý phí vận chuyển</h2>

        <!-- Nút tạo mới -->
        <button @click="goToCreate" class="action-button add">Thêm mới phí vận chuyển</button>

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
                            <button class="action-button edit" @click="goToEditCost(cost.ShippingId)">Sửa</button>
                            <button class="action-button delete"
                                @click="deleteShippingCost(cost.ShippingId)">Xóa</button>
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
    padding: 24px;
    background-color: #f9f9f9;
    border-radius: 12px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    font-family: 'Roboto', sans-serif;
    max-width: 1000px;
    margin: auto;
}

.management-title {
    font-size: 28px;
    font-weight: 700;
    color: #2d3e50;
    margin-bottom: 20px;
    text-align: center;
}

.section-title {
    text-align: center;
    font-size: 20px;
    font-weight: 600;
    color: #34495e;
    margin-bottom: 15px;
}

.table-container {
    overflow-x: auto;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
    background-color: #ffffff;
}

table {
    width: 100%;
    border-collapse: collapse;
}

thead th {
    background-color: #34495e;
    color: #ffffff;
    padding: 12px;
    text-align: left;
    border-radius: 8px 8px 0 0;
}

tbody td {
    padding: 12px;
    border-bottom: 1px solid #dee2e6;
    color: #2d3e50;
}

tbody tr:hover {
    background-color: #f1f3f5;
}

.action-button {
    padding: 8px 12px;
    margin: 3px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    color: #fff;
    transition: background-color 0.3s ease, transform 0.2s ease;
}

.add {
    background-color: #4caf50;
}

.edit {
    background-color: #3498db;
}

.delete {
    background-color: #e74c3c;
}

.action-button:hover {
    transform: scale(1.05);
}
</style>
