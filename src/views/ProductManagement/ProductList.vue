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
    padding: 2.5rem;
    background-color: var(--main-bg-color);
    color: var(--text-color);
    border-radius: 12px;
    box-shadow: 0 4px 12px var(--shadow-color);
    font-family: 'Roboto', sans-serif;
    max-width: 1100px;
    margin: 40px auto;
}

.management-title {
    font-size: 32px;
    font-weight: bold;
    color: var(--highlight-color);
    text-align: center;
    margin-bottom: 20px;
}

.description {
    font-size: 16px;
    color: #bdc3c7;
    text-align: center;
    margin-bottom: 24px;
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
    padding: 10px;
    font-size: 16px;
    border-radius: 8px;
    border: 1px solid #7f8c8d;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
    background-color: var(--input-bg-color);
    color: var(--text-color);
    flex: 1;
}

.table-container {
    overflow-x: auto;
    border-radius: 12px;
    background-color: var(--secondary-bg-color);
    box-shadow: 0 4px 8px var(--shadow-color);
}

table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
    border-radius: 6px;
    background-color: var(--secondary-bg-color);
}

thead th {
    background-color: var(--highlight-color);
    color: #ffffff;
    padding: 14px;
    text-align: left;
    font-weight: 600;
    border-radius: 6px 6px 0 0;
}

tbody td {
    padding: 12px;
    border-bottom: 1px solid #7f8c8d;
    color: var(--text-color);
}

tbody tr {
    transition: background-color 0.3s ease, color 0.3s ease;
}

tbody tr:hover {
    background-color: var(--hover-bg-color);
    color: #ffffff;
}

.status-active {
    color: #2ecc71;
    font-weight: 600;
}

.status-inactive {
    color: #e74c3c;
    font-weight: 600;
}

.action-button {
    padding: 8px 16px;
    margin: 3px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    color: #ffffff;
    transition: background-color 0.3s ease, transform 0.2s ease;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.view {
    background-color: var(--accent-color);
}

.edit {
    background-color: #2980b9;
}

.delete {
    background-color: #e74c3c;
}

.search {
    background-color: #2ecc71;
}

.add {
    background-color: #2ecc71;
}

.action-button:hover {
    transform: scale(1.05);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.add-button {
    display: block;
    width: fit-content;
    padding: 12px 18px;
    font-size: 15px;
    font-weight: 600;
    background-color: var(--button-bg-color);
    color: #ffffff;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    margin: 20px auto 0;
    text-align: center;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s ease, transform 0.2s ease;
}

.add-button:hover {
    background-color: var(--hover-bg-color);
    transform: scale(1.05);
}
</style>
