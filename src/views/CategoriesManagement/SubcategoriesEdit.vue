<template>
    <div class="subcategory-edit-container">
        <h2>Chỉnh sửa danh mục phụ</h2>
        <form @submit.prevent="handleSubmit">
            <label>
                <strong>ID danh mục:</strong>
                <input type="text" v-model="categoryId" required />
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
    data() {
        return {
            subcategoryId: this.$route.params.subcategoryId || '', // Lấy ID từ route params
            categoryId: '',
            description: ''
        };
    },
    async created() {
        if (this.subcategoryId) {
            console.log('subcategoryId:', this.subcategoryId); // Kiểm tra giá trị subcategoryId
            await this.fetchSubcategory();
        } else {
            console.error('subcategoryId không được truyền đúng cách');
            alert('Không tìm thấy ID danh mục phụ.');
            this.goBack();
        }
    },
    methods: {
        async fetchSubcategory() {
            try {
                const response = await fetch(`http://localhost:5000/api/Category/subcategories/${this.subcategoryId}`);
                if (!response.ok) throw new Error('Lỗi khi tải thông tin danh mục phụ');
                const subcategory = await response.json();
                this.categoryId = subcategory.CategoryId;
                this.description = subcategory.Description;
            } catch (error) {
                console.error('Lỗi khi tải thông tin danh mục phụ:', error);
                alert('Không thể tải thông tin danh mục phụ.');
            }
        },
        async handleSubmit() {
            try {
                const response = await fetch(`http://localhost:5000/api/Category/subcategories/${this.subcategoryId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        categoryId: this.categoryId,
                        description: this.description
                    })
                });

                if (!response.ok) throw new Error('Lỗi khi cập nhật danh mục phụ');

                alert('Danh mục phụ đã được cập nhật thành công');
                this.goBack();
            } catch (error) {
                console.error('Lỗi khi cập nhật danh mục phụ:', error);
                alert('Đã xảy ra lỗi khi cập nhật.');
            }
        },
        goBack() {
            this.$router.push('/admin/categories');
        }
    }
};
</script>


<style scoped>
.subcategory-edit-container {
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
