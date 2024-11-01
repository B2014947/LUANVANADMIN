<template>
    <div class="category-management">
        <h2>Quản lý danh mục và danh mục phụ</h2>

        <!-- Nút tạo mới -->
        <button @click="goToCreate" class="add-button">Thêm mới danh mục hoặc danh mục phụ</button>

        <!-- Quản lý danh mục -->
        <section class="section">
            <h3>Danh mục</h3>
            <table>
                <thead>
                    <tr>
                        <th>Category ID</th>
                        <th>Category Name</th>
                        <th>Description</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="category in categories" :key="category.CategoryId">
                        <td>{{ category.CategoryId }}</td>
                        <td>{{ category.CategoryName }}</td>
                        <td>{{ category.Description }}</td>
                        <td>
                            <button @click="goToEditCategory(category.CategoryId)">Sửa</button>
                            <button @click="deleteCategory(category.CategoryId)">Xóa</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </section>

        <!-- Quản lý danh mục phụ -->
        <section class="section">
            <h3>Danh mục phụ</h3>
            <table>
                <thead>
                    <tr>
                        <th>Subcategory ID</th>
                        <th>Category ID</th>
                        <th>Description</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="subcategory in subcategories" :key="subcategory.SubcategoryId">
                        <td>{{ subcategory.SubcategoryId }}</td>
                        <td>{{ subcategory.CategoryId }}</td>
                        <td>{{ subcategory.Description }}</td>
                        <td>
                            <button @click="goToEditSubcategory(subcategory.SubcategoryId)">Sửa</button>
                            <button @click="deleteSubcategory(subcategory.SubcategoryId)">Xóa</button>
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
            categories: [],
            subcategories: []
        };
    },
    mounted() {
        this.fetchCategories();
        this.fetchSubcategories();
    },
    methods: {
        async fetchCategories() {
            try {
                const response = await fetch('http://localhost:5000/api/Category');
                this.categories = await response.json();
            } catch (error) {
                console.error('Lỗi khi tải danh sách danh mục:', error);
            }
        },
        async fetchSubcategories() {
            try {
                const response = await fetch('http://localhost:5000/api/Category/subcategories');
                this.subcategories = await response.json();
            } catch (error) {
                console.error('Lỗi khi tải danh sách danh mục phụ:', error);
            }
        },
        goToCreate() {
            this.$router.push({ name: 'CategoriesAdd' });
        },
        goToEditCategory(categoryId) {
            this.$router.push({ name: 'CategoryEdit', params: { categoryId: categoryId } });
        },
        async deleteCategory(categoryId) {
            if (confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
                try {
                    await fetch(`http://localhost:5000/api/Category/categories/${categoryId}`, { method: 'DELETE' });
                    this.fetchCategories();
                    alert('Danh mục đã được xóa thành công');
                } catch (error) {
                    console.error('Lỗi khi xóa danh mục:', error);
                    alert('Đã xảy ra lỗi.');
                }
            }
        },
        goToEditSubcategory(subcategoryId) {
            this.$router.push({ name: 'SubcategoryEdit', params: { subcategoryId: subcategoryId } });
        },
        async deleteSubcategory(subcategoryId) {
            if (confirm('Bạn có chắc chắn muốn xóa danh mục phụ này?')) {
                try {
                    await fetch(`http://localhost:5000/api/Category/subcategories/${subcategoryId}`, { method: 'DELETE' });
                    this.fetchSubcategories();
                    alert('Danh mục phụ đã được xóa thành công');
                } catch (error) {
                    console.error('Lỗi khi xóa danh mục phụ:', error);
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
