<template>
    <div class="shipping-costs-management">
        <h2>Quản lý phí vận chuyển</h2>

        <!-- Nút tạo mới -->
        <button @click="goToCreate" class="add-button">Thêm mới phí vận chuyển</button>

        <!-- Danh sách phí vận chuyển -->
        <section class="section">
            <h3>Danh sách phí vận chuyển</h3>
            <table>
                <thead>
                    <tr>
                        <th>Shipping ID</th>
                        <th>Province</th>
                        <th>Shipping Cost (VND)</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="cost in shippingCosts" :key="cost.ShippingId">
                        <td>{{ cost.ShippingId }}</td>
                        <td>{{ cost.Province }}</td>
                        <td>{{ cost.ShippingCosts }}</td>
                        <td>
                            <button @click="goToEditCost(cost.ShippingId)">Sửa</button>
                            <button @click="deleteShippingCost(cost.ShippingId)">Xóa</button>
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
            shippingCosts: [] // Lưu trữ danh sách phí vận chuyển
        };
    },
    mounted() {
        this.fetchShippingCosts();
    },
    methods: {
        async fetchShippingCosts() {
            try {
                const response = await fetch('http://localhost:5000/api/ShippingCost');
                this.shippingCosts = await response.json();
            } catch (error) {
                console.error('Lỗi khi tải danh sách phí vận chuyển:', error);
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
                    await fetch(`http://localhost:5000/api/ShippingCost/${shippingId}`, { method: 'DELETE' });
                    this.fetchShippingCosts();
                    alert('Phí vận chuyển đã được xóa thành công');
                } catch (error) {
                    console.error('Lỗi khi xóa phí vận chuyển:', error);
                    alert('Đã xảy ra lỗi.');
                }
            }
        }
    }
};
</script>

<style scoped>
.section {
    margin-bottom: 2rem;
}

h2,
h3 {
    color: #2c3e50;
    margin-bottom: 1rem;
}

table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 1rem;
}

th,
td {
    border: 1px solid #bdc3c7;
    padding: 10px;
    text-align: left;
}

th {
    background-color: #34495e;
    color: #ecf0f1;
}

button {
    padding: 5px 10px;
    margin-right: 5px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.add-button {
    background-color: #27ae60;
    color: #fff;
    margin-bottom: 1rem;
}

button:hover {
    opacity: 0.9;
}
</style>
