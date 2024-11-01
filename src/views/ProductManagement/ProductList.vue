<template>
    <div class="product-list-container">
        <h2>Danh sách sản phẩm</h2>

        <!-- Thanh tìm kiếm và bộ lọc -->
        <div class="filter-container">
            <input type="text" v-model="searchTerm" placeholder="🔍 Tìm kiếm sản phẩm..." />
            <select v-model="selectedCategory">
                <option value="">Tất cả danh mục</option>
                <option v-for="category in categories" :key="category.CategoryId" :value="category.CategoryId">
                    {{ category.CategoryName }}
                </option>
            </select>
            <!-- Nút tìm kiếm -->
            <button @click="fetchProducts">Tìm kiếm</button>
            <button @click="addNewProduct">Thêm sản phẩm mới</button>
        </div>

        <!-- Bảng sản phẩm -->
        <table v-if="products.length" class="product-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Tên sản phẩm</th>
                    <th>Mô tả</th>
                    <th>Giá</th>
                    <th>Tồn kho</th>
                    <th>Ngày tạo</th>
                    <th>Ngày cập nhật</th>
                    <th>Kích hoạt</th>
                    <th>Hành động</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="product in products" :key="product.ProductId">
                    <td>{{ product.ProductId }}</td>
                    <td>{{ product.ProductName }}</td>
                    <td>{{ product.Description }}</td>
                    <td>{{ product.Price.toLocaleString() }} VND</td>
                    <td>{{ product.StockQuantity }}</td>
                    <td>{{ new Date(product.CreatedAt).toLocaleDateString() }}</td>
                    <td>{{ new Date(product.UpdatedAt).toLocaleDateString() }}</td>
                    <td>{{ product.IsActive ? "Có" : "Không" }}</td>
                    <td class="action-buttons">
                        <button @click="viewProduct(product.ProductId)">Xem chi tiết</button>
                        <button @click="editProduct(product.ProductId)">Chỉnh sửa</button>
                        <button @click="deleteProduct(product.ProductId)">Xóa</button>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- Thông báo nếu không tìm thấy sản phẩm -->
        <p v-else>Không có sản phẩm nào được tìm thấy.</p>
    </div>
</template>


<script>
export default {
    name: 'ProductList',
    data() {
        return {
            products: [],
            categories: [],
            selectedCategory: '',
            searchTerm: '',
        };
    },
    async created() {
        await this.fetchCategories();
        await this.fetchProducts();
    },
    methods: {
        async fetchCategories() {
            try {
                const response = await fetch(`http://localhost:5000/api/Category`);
                if (!response.ok) throw new Error('Lỗi khi tải danh sách danh mục');
                this.categories = await response.json();
            } catch (error) {
                console.error(error);
                alert('Không thể tải danh sách danh mục.');
            }
        },
        async fetchProducts() {
            try {
                const query = new URLSearchParams();
                if (this.selectedCategory) query.append('categoryId', this.selectedCategory);
                if (this.searchTerm) query.append('productName', this.searchTerm);

                const response = await fetch(`http://localhost:5000/api/Product/search?${query.toString()}`);
                if (!response.ok) throw new Error('Lỗi khi tải danh sách sản phẩm');
                this.products = await response.json();
            } catch (error) {
                console.error(error);
                alert('Không thể tải danh sách sản phẩm.');
            }
        },
        viewProduct(productId) {
            this.$router.push({ name: 'ProductDetail', params: { productId } });
        },
        editProduct(productId) {
            this.$router.push(`/product/edit/${productId}`);
        },
        async deleteProduct(productId) {
            try {
                await fetch(`http://localhost:5000/api/Product/${productId}`, { method: 'DELETE' });
                this.products = this.products.filter(p => p.ProductId !== productId);
            } catch (error) {
                console.error(error);
                alert('Lỗi khi xóa sản phẩm.');
            }
        },
        addNewProduct() {
            this.$router.push(`/product/new`);
        }
    }
};
</script>

<style scoped>
.product-list-container {
    max-width: 1200px;
    margin: auto;
    padding: 30px;
    background-color: #f5f7fa;
    border-radius: 12px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
    font-family: 'Arial', sans-serif;
}

h2 {
    text-align: center;
    color: #34495e;
    font-size: 28px;
    margin-bottom: 25px;
    font-weight: bold;
}

.filter-container {
    display: flex;
    gap: 12px;
    margin-bottom: 20px;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
}

.filter-container input,
.filter-container select {
    padding: 12px;
    font-size: 16px;
    border-radius: 8px;
    border: 1px solid #d1d5db;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
    width: 240px;
}

button {
    padding: 12px 18px;
    font-size: 16px;
    font-weight: bold;
    color: #ffffff;
    background-color: #3498db;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
    box-shadow: 0 4px 8px rgba(52, 152, 219, 0.2);
}

button:hover {
    background-color: #2980b9;
    transform: translateY(-2px);
}

.product-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0 8px;
    margin-top: 20px;
}

.product-table th,
.product-table td {
    padding: 12px 10px;
    text-align: center;
    background-color: #ffffff;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 500;
    word-wrap: break-word;
}

.product-table th {
    background-color: #3498db;
    color: #ffffff;
    font-weight: 600;
}

.product-table td a {
    color: #3498db;
    text-decoration: underline;
}

.product-table tbody tr:hover td {
    background-color: #ecf6fd;
    transition: background-color 0.3s ease;
}

/* Căn giữa các nút hành động */
.product-table .action-buttons {
    display: flex;
    gap: 6px;
    justify-content: center;
}

.action-buttons button {
    padding: 8px 10px;
    font-size: 14px;
    font-weight: bold;
    color: #ffffff;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    transition: opacity 0.2s ease;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.action-buttons button:nth-child(1) {
    background-color: #27ae60;
}

.action-buttons button:nth-child(2) {
    background-color: #f39c12;
}

.action-buttons button:nth-child(3) {
    background-color: #e74c3c;
}

.action-buttons button:hover {
    opacity: 0.9;
}
</style>
