<template>
    <div class="management-container">
        <h2 class="management-title"><i class="fas fa-box-open"></i> Quản lý sản phẩm</h2>
        <p class="description">Danh sách các sản phẩm hiện có trong hệ thống.</p>

        <!-- Thanh tìm kiếm và bộ lọc -->
        <div class="filter-container">
            <input type="text" v-model="searchTerm" placeholder="🔍 Tìm kiếm sản phẩm..." />
            <select v-model="selectedCategory">
                <option value="">Tất cả danh mục</option>
                <option v-for="category in categories" :key="category.CategoryId" :value="category.CategoryId">
                    {{ category.CategoryName }}
                </option>
            </select>
            <button @click="fetchProducts" class="action-button search">Tìm kiếm</button>
            <button @click="addNewProduct" class="action-button add">Thêm sản phẩm mới</button>
        </div>

        <!-- Bảng sản phẩm -->
        <div class="table-container">
            <table v-if="products.length">
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
                        <td>
                            <span :class="product.IsActive ? 'status-active' : 'status-inactive'">
                                {{ product.IsActive ? 'Có' : 'Không' }}
                            </span>
                        </td>
                        <td>
                            <button class="action-button view" @click="viewProduct(product.ProductId)">Xem</button>
                            <button class="action-button edit" @click="editProduct(product.ProductId)">Sửa</button>
                            <button class="action-button delete" @click="deleteProduct(product.ProductId)">Xóa</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <p v-else>Không có sản phẩm nào được tìm thấy.</p>
        </div>
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
            this.$router.push({ name: 'ProductForm', params: { productId } });
        },
        async deleteProduct(productId) {
            const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?');
            if (!confirmDelete) return;

            try {
                const response = await fetch(`http://localhost:5000/api/Product/${productId}`, { method: 'DELETE' });
                if (!response.ok) throw new Error('Lỗi khi xóa sản phẩm');
                alert('Sản phẩm đã được xóa thành công.');
                this.fetchProducts(); // Cập nhật lại danh sách sản phẩm
            } catch (error) {
                console.error(error);
                alert('Lỗi khi xóa sản phẩm.');
            }
        },
        addNewProduct() {
            this.$router.push({ name: 'AddProduct' });
        }
    }
};
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

.management-container {
    padding: 24px;
    background-color: #f9f9f9;
    border-radius: 15px;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
    font-family: 'Roboto', sans-serif;
    max-width: 1200px;
    margin: auto;
}

.management-title {
    font-size: 28px;
    font-weight: 700;
    color: #2d3e50;
    margin-bottom: 10px;
    text-align: center;
}

.description {
    font-size: 16px;
    color: #6c757d;
    margin-bottom: 24px;
    text-align: center;
}

.table-container {
    overflow-x: auto;
    margin-bottom: 24px;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
    background-color: #ffffff;
}

table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
}

thead th {
    background-color: #34495e;
    color: #ffffff;
    padding: 14px;
    text-align: left;
    font-weight: 500;
    border-radius: 8px 8px 0 0;
}

tbody td {
    padding: 12px;
    border-bottom: 1px solid #dee2e6;
    color: #2d3e50;
}

tbody tr:hover {
    background-color: #f4f6f8;
}

.status-active {
    color: #2ecc71;
}

.status-inactive {
    color: #e74c3c;
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

.view {
    background-color: #5a67d8;
}

.edit {
    background-color: #3498db;
}

.delete {
    background-color: #e74c3c;
}

.add {
    background-color: #4caf50;
}

.action-button:hover {
    transform: scale(1.05);
}

.filter-container {
    display: flex;
    gap: 12px;
    margin-bottom: 20px;
    align-items: center;
    justify-content: flex-end;
    flex-wrap: wrap;
}

.filter-container input,
.filter-container select {
    padding: 10px;
    font-size: 16px;
    border-radius: 8px;
    border: 1px solid #d1d5db;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
    flex: 1;
}

.filter-container button {
    padding: 10px 20px;
    font-size: 15px;
    font-weight: 600;
    color: #ffffff;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.search {
    background-color: #3498db;
}

.search:hover {
    background-color: #2980b9;
}

button.add:hover {
    background-color: #45a049;
}

button.edit:hover {
    background-color: #2980b9;
}

button.delete:hover {
    background-color: #c0392b;
}
</style>
