<template>
    <div class="create-product-container">
        <h2>Tạo sản phẩm mới</h2>
        <form @submit.prevent="createProduct" class="product-form">
            <!-- Thông tin sản phẩm -->
            <label><strong>Tên sản phẩm:</strong><input type="text" v-model="productName" required /></label>
            <label><strong>Mô tả:</strong><textarea v-model="description" required></textarea></label>
            <label><strong>Giá (VND):</strong><input type="number" v-model="price" required /></label>
            <label><strong>Số lượng trong kho:</strong><input type="number" v-model="stockQuantity" required /></label>
            <label><strong>Danh mục phụ:</strong><input type="text" v-model="subCategoryId" required /></label>
            <label><strong>Danh mục:</strong><input type="text" v-model="categoryId" required /></label>
            <label><strong>Kích hoạt:</strong>
                <select v-model="isActive">
                    <option :value="true">Có</option>
                    <option :value="false">Không</option>
                </select>
            </label>

            <!-- Thêm phần chi tiết sản phẩm -->
            <h3>Chi tiết sản phẩm</h3>
            <label><strong>Thương hiệu:</strong><input type="text" v-model="brand" /></label>
            <label><strong>CPU:</strong><input type="text" v-model="processor" /></label>
            <label><strong>RAM:</strong><input type="text" v-model="ram" /></label>
            <label><strong>Lưu trữ:</strong><input type="text" v-model="storage" /></label>
            <label><strong>Màn hình:</strong><input type="text" v-model="display" /></label>
            <label><strong>Pin:</strong><input type="text" v-model="battery" /></label>
            <label><strong>Hệ điều hành:</strong><input type="text" v-model="operatingSystem" /></label>
            <label><strong>Camera:</strong><input type="text" v-model="camera" /></label>
            <label><strong>Kích thước:</strong><input type="text" v-model="dimensions" /></label>
            <label><strong>Trọng lượng:</strong><input type="text" v-model="weight" /></label>
            <label><strong>Kết nối:</strong><input type="text" v-model="connectivity" /></label>
            <label><strong>Tùy chọn màu:</strong><input type="text" v-model="colorOptions" /></label>
            <label><strong>Thời gian bảo hành:</strong><input type="number" v-model="warrantyPeriod" /></label>
            <label><strong>Đặc điểm bổ sung:</strong><textarea v-model="additionalFeatures"></textarea></label>

            <label>
                <strong>Hình ảnh:</strong>
                <input type="file" @change="handleFileUpload" multiple />
                <div class="image-preview">
                    <h4>Hình ảnh đã chọn:</h4>
                    <div class="image-list">
                        <div v-for="(url, index) in imagePreviews" :key="index" class="image-item">
                            <img :src="url" alt="Ảnh sản phẩm" />
                            <button class="delete-button" @click.prevent="removeImage(index)">Xóa</button>
                        </div>
                    </div>
                </div>
            </label>

            <button type="submit" class="save-button">Lưu sản phẩm</button>
        </form>

        <button class="back-button" @click="goBack">Quay lại</button>
    </div>
</template>

<script>
export default {
    name: 'CreateProduct',
    data() {
        return {
            productName: '',
            description: '',
            price: null,
            stockQuantity: null,
            subCategoryId: '',
            categoryId: '',
            isActive: true,
            brand: '',
            processor: '',
            ram: '',
            storage: '',
            display: '',
            battery: '',
            operatingSystem: '',
            camera: '',
            dimensions: '',
            weight: '',
            connectivity: '',
            colorOptions: '',
            warrantyPeriod: null,
            additionalFeatures: '',
            imageFiles: [],
            imagePreviews: []
        };
    },
    methods: {
        async createProduct() {
            try {
                const formData = new FormData();
                formData.append('productName', this.productName);
                formData.append('description', this.description);
                formData.append('price', this.price);
                formData.append('stockQuantity', this.stockQuantity);
                formData.append('subCategoryId', this.subCategoryId);
                formData.append('categoryId', this.categoryId);
                formData.append('isActive', this.isActive);
                formData.append('brand', this.brand);
                formData.append('processor', this.processor);
                formData.append('ram', this.ram);
                formData.append('storage', this.storage);
                formData.append('display', this.display);
                formData.append('battery', this.battery);
                formData.append('operatingSystem', this.operatingSystem);
                formData.append('camera', this.camera);
                formData.append('dimensions', this.dimensions);
                formData.append('weight', this.weight);
                formData.append('connectivity', this.connectivity);
                formData.append('colorOptions', this.colorOptions);
                formData.append('warrantyPeriod', this.warrantyPeriod);
                formData.append('additionalFeatures', this.additionalFeatures);

                this.imageFiles.forEach(file => {
                    formData.append('images', file);
                });

                const response = await fetch('http://localhost:5000/api/Product', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) throw new Error('Lỗi khi tạo sản phẩm');

                alert('Sản phẩm đã được tạo thành công');
                this.resetForm();
                this.goBack();
            } catch (error) {
                console.error('Lỗi tạo sản phẩm:', error);
                alert('Không thể tạo sản phẩm.');
            }
        },
        handleFileUpload(event) {
            const files = Array.from(event.target.files);
            this.imageFiles = files;
            this.imagePreviews = files.map(file => URL.createObjectURL(file));
        },
        removeImage(index) {
            URL.revokeObjectURL(this.imagePreviews[index]);
            this.imagePreviews.splice(index, 1);
            this.imageFiles.splice(index, 1);
        },
        goBack() {
            this.$router.push('/admin/products');
        },
        resetForm() {
            this.productName = '';
            this.description = '';
            this.price = null;
            this.stockQuantity = null;
            this.subCategoryId = '';
            this.categoryId
                = ''; this.isActive = true; this.brand = ''; this.processor = ''; this.ram = ''; this.storage = ''; this.display = ''; this.battery = ''; this.operatingSystem = ''; this.camera = ''; this.dimensions = ''; this.weight = ''; this.connectivity = ''; this.colorOptions = ''; this.warrantyPeriod = null; this.additionalFeatures = ''; this.imageFiles = []; this.imagePreviews = [];
        }
    }
}; </script>

<style scoped>
.create-product-container {
    padding: 3rem;
    background-color: #2c3e50;
    color: #ecf0f1;
    border-radius: 12px;
    max-width: 600px;
    margin: auto;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
}

h2 {
    color: #ecf0f1;
    text-align: center;
    margin-bottom: 1.5rem;
}

.product-form {
    display: flex;
    flex-direction: column;
}

label {
    color: #bdc3c7;
    font-weight: 500;
    margin-top: 1rem;
}

input[type="text"],
input[type="number"],
textarea,
select {
    width: 100%;
    padding: 10px;
    margin-top: 5px;
    background-color: #34495e;
    border: 1px solid #7f8c8d;
    border-radius: 6px;
    color: #ecf0f1;
}

.save-button {
    background-color: #27ae60;
    margin-top: 1rem;
}

.back-button {
    background-color: #c0392b;
    width: 100%;
    margin-top: 1rem;
}

button {
    padding: 10px 20px;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 16px;
}

.delete-button {
    background-color: #e74c3c;
    color: #ffffff;
    border: none;
    padding: 5px 8px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    margin-top: 5px;
}

.delete-button:hover {
    background-color: #c0392b;
}

button:hover {
    opacity: 0.9;
}

.image-preview {
    margin-top: 10px;
}

.image-list {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.image-item {
    position: relative;
}

.image-item img {
    width: 100px;
    height: auto;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.delete-button {
    position: absolute;
    top: 5px;
    right: 5px;
    background-color: #e74c3c;
    color: #ffffff;
    border: none;
    padding: 5px 8px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
}
</style>