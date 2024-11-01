<template>
    <div class="category-edit-container">
        <h2>Chỉnh sửa danh mục</h2>
        <form @submit.prevent="handleSubmit">
            <label>
                <strong>Tên danh mục:</strong>
                <input type="text" v-model="categoryName" required />
            </label>
            <label>
                <strong>Mô tả:</strong>
                <textarea v-model="description"></textarea>
            </label>
            <button type="submit" class="submit-button">Cập nhật</button>
        </form>
        <button @click="goBack" class="back-button">Quay lại</button>
    </div>
</template>

<script>
export default {
    props: ['categoryId'],
    data() {
        return {
            categoryName: '',
            description: ''
        };
    },
    async created() {
        const categoryId = this.$route.params.categoryId;
        console.log('categoryId received:', categoryId);
        await this.fetchCategory(categoryId);
    }
    ,
    methods: {
        async fetchCategory(categoryId) {
            try {
                const response = await fetch(`http://localhost:5000/api/Category/categories/${categoryId}`);
                if (!response.ok) throw new Error('Lỗi khi tải thông tin danh mục');
                const category = await response.json();
                this.categoryName = category.CategoryName;
                this.description = category.Description;
            } catch (error) {
                console.error('Lỗi khi tải thông tin danh mục:', error);
                alert('Không thể tải thông tin danh mục.');
            }
        }
        ,
        async handleSubmit() {
            const categoryId = this.$route.params.categoryId || this.categoryId; // Lấy từ route hoặc prop

            try {
                const response = await fetch(`http://localhost:5000/api/Category/categories/${categoryId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        categoryName: this.categoryName,
                        description: this.description
                    })
                });

                if (!response.ok) throw new Error('Lỗi khi cập nhật danh mục');

                alert('Danh mục đã được cập nhật thành công');
                this.goBack();
            } catch (error) {
                console.error('Lỗi khi cập nhật danh mục:', error);
                alert('Đã xảy ra lỗi khi cập nhật.');
            }
        }
        ,
        goBack() {
            this.$router.push('/admin/categories');
        }
    }
};
</script>

<style scoped>
.category-edit-container {
    padding: 2rem;
    background-color: #2c3e50;
    color: #ecf0f1;
    border-radius: 12px;
    max-width: 600px;
    margin: auto;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
    font-family: 'Arial', sans-serif;
}

h2 {
    text-align: center;
    margin-bottom: 1.5rem;
}

form {
    display: flex;
    flex-direction: column;
}

label {
    margin-bottom: 1rem;
}

input[type="text"],
textarea {
    width: 100%;
    padding: 10px;
    background-color: #34495e;
    border: none;
    border-radius: 5px;
    color: #ecf0f1;
    margin-bottom: 1rem;
}

button {
    padding: 10px;
    border: none;
    border-radius: 5px;
    color: #fff;
    cursor: pointer;
    margin-top: 10px;
}

.submit-button {
    background-color: #27ae60;
}

.back-button {
    background-color: #c0392b;
}

button:hover {
    opacity: 0.9;
}
</style>
