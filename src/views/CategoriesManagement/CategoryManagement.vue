<template>
    <div class="management-container">
        <h2 class="management-title"><i class="fas fa-list-alt"></i> Quản lý danh mục và danh mục phụ</h2>
        <p class="description">Danh sách các danh mục và danh mục phụ hiện có trong hệ thống.</p>

        <!-- Nút tạo mới -->
        <div class="filter-container">
            <button @click="goToCreate" class="action-button add">
                <i class="fas fa-plus-circle"></i> Thêm mới danh mục hoặc danh mục phụ
            </button>
        </div>

        <!-- Quản lý danh mục -->
        <section class="table-container">
            <h3 class="section-title">Danh mục</h3>
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
                            <button class="action-button edit"
                                @click="goToEditCategory(category.CategoryId)">Sửa</button>
                            <button class="action-button delete"
                                @click="deleteCategory(category.CategoryId)">Xóa</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </section>

        <!-- Quản lý danh mục phụ -->
        <section class="table-container">
            <h3 class="section-title">Danh mục phụ</h3>
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
                            <button class="action-button edit"
                                @click="goToEditSubcategory(subcategory.SubcategoryId)">Sửa</button>
                            <button class="action-button delete"
                                @click="deleteSubcategory(subcategory.SubcategoryId)">Xóa</button>
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

tbody tr {
    transition: background-color 0.3s;
}

tbody tr:hover {
    background-color: #f4f6f8;
}

.section-title {
    text-align: center;
    font-size: 20px;
    font-weight: 600;
    color: #34495e;
    margin-bottom: 12px;
}

.action-button {
    padding: 8px 12px;
    margin: 3px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
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

.filter-container {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 24px;
    gap: 12px;
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
