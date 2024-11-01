<template>
    <div class="shipping-costs-management">
        <h2>Shipping Costs Management</h2>
        <button class="add-shipping-button" @click="addShippingCost">Add Shipping Cost</button>
        <!-- Danh sách chi phí vận chuyển -->
        <table>
            <thead>
                <tr>
                    <th>Shipping ID</th>
                    <th>Province</th>
                    <th>Shipping Cost</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="cost in shippingCosts" :key="cost.ShippingId">
                    <td>{{ cost.ShippingId }}</td>
                    <td>{{ cost.Province }}</td>
                    <td>{{ cost.ShippingCosts }} VND</td>
                    <td>
                        <button @click="editShippingCost(cost)">Edit</button>
                        <button @click="deleteShippingCost(cost.ShippingId)">Delete</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    data() {
        return {
            shippingCosts: [] // Lưu trữ danh sách chi phí vận chuyển
        };
    },
    mounted() {
        this.fetchShippingCosts();
    },
    methods: {
        async fetchShippingCosts() {
            // Gọi API lấy danh sách chi phí vận chuyển
            const response = await fetch('http://localhost:5000/api/shipping-costs');
            this.shippingCosts = await response.json();
        },
        addShippingCost() {
            // Logic để thêm chi phí vận chuyển mới
        },
        editShippingCost(cost) {
            // Logic để chỉnh sửa chi phí vận chuyển
        },
        async deleteShippingCost(shippingId) {
            // Gọi API xóa chi phí vận chuyển
            await fetch(`http://localhost:5000/api/shipping-costs/${shippingId}`, { method: 'DELETE' });
            this.fetchShippingCosts();
        }
    }
};
</script>
