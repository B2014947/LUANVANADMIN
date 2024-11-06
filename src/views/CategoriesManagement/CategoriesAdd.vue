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
    padding: 2.5rem;
    background-color: #ffffff;
    color: #2c3e50;
    border-radius: 12px;
    max-width: 600px;
    margin: auto;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    font-family: 'Roboto', sans-serif;
}

h2 {
    text-align: center;
    margin-bottom: 2rem;
    font-size: 24px;
    color: #27ae60;
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
    color: #2c3e50;
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
    outline: none;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

input[type="text"]:focus,
textarea:focus {
    border-color: #27ae60;
    box-shadow: 0 0 8px rgba(39, 174, 96, 0.3);
}

textarea {
    resize: vertical;
}

/* Bố trí các nút để trông ngay ngắn */
button {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 12px;
    border: none;
    border-radius: 8px;
    color: #ffffff;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s ease, transform 0.2s ease;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    margin-top: 10px;
    /* Thêm khoảng cách giữa các nút */
}

.submit-button {
    background-color: #27ae60;
}

.back-button {
    background-color: #2980b9;
}

.toggle-button {
    background-color: #2980b9;
}

button:hover {
    opacity: 0.95;
    transform: scale(1.02);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

button:active {
    transform: scale(1);
}

button:focus {
    outline: 2px solid #27ae60;
}

/* Đảm bảo tất cả các nút căn chỉnh chính xác */
.submit-button,
.toggle-button,
.back-button {
    margin-top: 1rem;
}
</style>
