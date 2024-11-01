<template>
    <div class="form-container">
        <h2>{{ isSubcategoryMode ? 'Tạo mới danh mục phụ' : 'Tạo mới danh mục' }}</h2>
        <form @submit.prevent="handleSubmit">
            <div v-if="isSubcategoryMode">
                <label>
                    <strong>Category ID:</strong>
                    <input type="text" v-model="categoryId" required />
                </label>
            </div>
            <label>
                <strong>Tên {{ isSubcategoryMode ? 'danh mục phụ' : 'danh mục' }}:</strong>
                <input type="text" v-model="categoryName" required />
            </label>
            <label>
                <strong>Mô tả:</strong>
                <textarea v-model="description"></textarea>
            </label>
            <button type="submit" class="submit-button">Tạo mới</button>
        </form>
        <button @click="toggleMode" class="toggle-button">
            {{ isSubcategoryMode ? 'Chuyển sang tạo danh mục' : 'Chuyển sang tạo danh mục phụ' }}
        </button>
        <button @click="goBack" class="back-button">Quay lại</button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            categoryId: '',
            categoryName: '',
            description: '',
            isSubcategoryMode: false // Biến để kiểm tra chế độ hiện tại
        };
    },
    methods: {
        async handleSubmit() {
            try {
                const url = this.isSubcategoryMode
                    ? 'http://localhost:5000/api/Category/subcategories'
                    : 'http://localhost:5000/api/Category/categories';

                const bodyData = this.isSubcategoryMode
                    ? { categoryId: this.categoryId, description: this.description }
                    : { categoryName: this.categoryName, description: this.description };

                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(bodyData)
                });

                if (!response.ok) {
                    throw new Error('Lỗi khi tạo mới');
                }

                alert(this.isSubcategoryMode ? 'Danh mục phụ đã được tạo thành công' : 'Danh mục đã được tạo thành công');
                this.goBack();
            } catch (error) {
                console.error('Lỗi khi tạo mới:', error);
                alert('Đã xảy ra lỗi khi tạo mới.');
            }
        },
        toggleMode() {
            this.isSubcategoryMode = !this.isSubcategoryMode;
        },
        goBack() {
            this.$router.push('/admin/categories');
        }
    }
};
</script>


<style scoped>
.form-container {
    padding: 2rem;
    background-color: #1e2a38;
    color: #ecf0f1;
    border-radius: 12px;
    max-width: 600px;
    margin: auto;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
    font-family: 'Arial', sans-serif;
}

h2 {
    text-align: center;
    margin-bottom: 2rem;
    font-size: 24px;
    color: #ffffff;
    font-weight: bold;
}

form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

label {
    display: flex;
    flex-direction: column;
    font-size: 14px;
    color: #bdc3c7;
}

input[type="text"],
textarea {
    width: 100%;
    padding: 12px;
    background-color: #34495e;
    border: 1px solid #7f8c8d;
    border-radius: 6px;
    color: #ecf0f1;
    outline: none;
    transition: border-color 0.3s ease;
}

input[type="text"]:focus,
textarea:focus {
    border-color: #27ae60;
}

textarea {
    resize: vertical;
}

button {
    padding: 12px;
    border: none;
    border-radius: 6px;
    color: #fff;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s ease, transform 0.2s ease;
}

.submit-button {
    background-color: #2ecc71;
}

.back-button {
    background-color: #e74c3c;
}

.toggle-button {
    background-color: #3498db;
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
