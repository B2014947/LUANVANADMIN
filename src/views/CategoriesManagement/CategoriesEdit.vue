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
    padding: 2.5rem;
    background-color: #ffffff;
    color: #2c3e50;
    border-radius: 12px;
    max-width: 800px;
    margin: 40px auto;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    font-family: 'Roboto', sans-serif;
}

h2 {
    color: #27ae60;
    text-align: center;
    margin-bottom: 1.5rem;
    font-weight: 700;
}

form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

label {
    display: flex;
    flex-direction: column;
    font-size: 14px;
    color: #34495e;
    font-weight: 600;
}

input[type="text"],
textarea {
    width: 100%;
    padding: 12px;
    background-color: #ecf0f1;
    border: 1px solid #bdc3c7;
    border-radius: 8px;
    color: #2c3e50;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
    outline: none;
}

input[type="text"]:focus,
textarea:focus {
    border-color: #27ae60;
    box-shadow: 0 0 8px rgba(39, 174, 96, 0.3);
}

textarea {
    resize: vertical;
}

button {
    padding: 12px;
    border: none;
    border-radius: 8px;
    color: #ffffff;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s ease, transform 0.2s ease;
    margin-top: 1rem;
}

.submit-button {
    background-color: #27ae60;
}

.back-button {
    background-color: #2980b9;
}

button:hover {
    opacity: 0.95;
    transform: scale(1.02);
}

button:active {
    transform: scale(1);
}

button:focus {
    outline: 2px solid #27ae60;
}
</style>
