<template>
    <div class="category-management">
        <h2>Category Management</h2>
        <button class="add-category-button" @click="addCategory">Add Category</button>
        <!-- Danh sách danh mục -->
        <table>
            <thead>
                <tr>
                    <th>Category ID</th>
                    <th>Category Name</th>
                    <th>Description</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="category in categories" :key="category.CategoryId">
                    <td>{{ category.CategoryId }}</td>
                    <td>{{ category.CategoryName }}</td>
                    <td>{{ category.Description }}</td>
                    <td>
                        <button @click="editCategory(category)">Edit</button>
                        <button @click="deleteCategory(category.CategoryId)">Delete</button>
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
            categories: [] // Lưu trữ danh sách các danh mục
        };
    },
    mounted() {
        this.fetchCategories();
    },
    methods: {
        async fetchCategories() {
            // Gọi API lấy danh sách danh mục
            const response = await fetch('http://localhost:5000/api/categories');
            this.categories = await response.json();
        },
        addCategory() {
            // Logic để thêm danh mục mới
        },
        editCategory(category) {
            // Logic để chỉnh sửa danh mục
        },
        async deleteCategory(categoryId) {
            // Gọi API xóa danh mục
            await fetch(`http://localhost:5000/api/categories/${categoryId}`, { method: 'DELETE' });
            this.fetchCategories();
        }
    }
};
</script>
