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
                            <button class="action-button edit" @click="goToEditCategory(category.CategoryId)">
                                <i class="fas fa-edit"></i> Sửa
                            </button>
                            <button class="action-button delete" @click="deleteCategory(category.CategoryId)">
                                <i class="fas fa-trash-alt"></i> Xóa
                            </button>
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
                            <button class="action-button edit" @click="goToEditSubcategory(subcategory.SubcategoryId)">
                                <i class="fas fa-edit"></i> Sửa
                            </button>
                            <button class="action-button delete" @click="deleteSubcategory(subcategory.SubcategoryId)">
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
.management-container {
    padding: 2.5rem;
    background-color: #ffffff;
    color: #2c3e50;
    border-radius: 15px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    font-family: 'Roboto', sans-serif;
    max-width: 1100px;
    margin: 40px auto;
}

.management-title {
    font-size: 32px;
    font-weight: bold;
    color: #27ae60;
    text-align: center;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.management-title i {
    margin-right: 8px;
    color: #27ae60;
}

.description {
    font-size: 16px;
    color: #7f8c8d;
    text-align: center;
    margin-bottom: 24px;
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
    border-collapse: collapse;
    border-radius: 12px;
    overflow: hidden;
    background-color: #ffffff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

thead th {
    background-color: #27ae60;
    color: #ffffff;
    padding: 12px;
    text-align: center;
    font-weight: 600;
    border-radius: 6px 6px 0 0;
}

tbody td {
    border-bottom: 1px solid #e5e7eb;
    color: #2c3e50;
    text-align: center;
}

tbody tr {
    transition: background-color 0.3s;
}

tbody tr:hover {
    background-color: #f1f8f5;
}

.section-title {
    text-align: center;
    font-size: 20px;
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
    margin: 5px;
}

.add {
    align-items: center;
    background-color: #27ae60;
}

.edit {
    background-color: #f39c12;
}

.delete {
    background-color: #e74c3c;
}

.action-button:hover {
    transform: scale(1.05);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.filter-container {
    display: flex;
    justify-content: center;
    margin-bottom: 24px;
    gap: 12px;
}

button.add:hover {
    background-color: #2ecc71;
}

button.edit:hover {
    background-color: #3498db;
}

button.delete:hover {
    background-color: #c0392b;
}
</style>
