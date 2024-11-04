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
    padding: 2.5rem;
    background-color: #ffffff;
    /* Nền sáng */
    color: #2c3e50;
    /* Màu chữ tối */
    border-radius: 12px;
    max-width: 700px;
    margin: auto;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    font-family: 'Roboto', sans-serif;
}

h2 {
    text-align: center;
    margin-bottom: 1.5rem;
    color: #27ae60;
    /* Màu nhấn */
}

form {
    display: flex;
    flex-direction: column;
}

label {
    margin-bottom: 1rem;
    color: #2c3e50;
    /* Màu chữ tối */
    font-weight: 600;
}

input[type="text"],
textarea {
    width: 100%;
    padding: 12px;
    background-color: #ecf0f1;
    /* Nền sáng cho input */
    border: 1px solid #bdc3c7;
    /* Viền sáng */
    border-radius: 8px;
    color: #2c3e50;
    /* Màu chữ tối */
    margin-bottom: 1rem;
    outline: none;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

input[type="text"]:focus,
textarea:focus {
    border-color: #27ae60;
    /* Màu nhấn khi focus */
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
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.submit-button {
    background-color: #27ae60;
    /* Màu xanh lá */
}

.back-button {
    background-color: #2980b9;
    /* Màu xanh lam */
}

button:hover {
    opacity: 0.95;
    transform: scale(1.02);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

button:active {
    transform: scale(1);
}
</style>
