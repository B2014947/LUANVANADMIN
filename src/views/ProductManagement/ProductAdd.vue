<template>
    <div class="create-product-container">
        <h2><i class="fas fa-plus-circle"></i> Tạo sản phẩm mới</h2>
        <form @submit.prevent="createProduct" class="product-form">
            <!-- Thông tin sản phẩm -->
            <label>
                <strong><i class="fas fa-tag"></i> Tên sản phẩm:</strong>
                <input type="text" v-model="productName" required />
            </label>
            <label>
                <strong><i class="fas fa-align-left"></i> Mô tả:</strong>
                <textarea v-model="description" required></textarea>
            </label>
            <label>
                <strong><i class="fas fa-money-bill-wave"></i> Giá (VND):</strong>
                <input type="number" v-model="price" required />
            </label>
            <label>
                <strong><i class="fas fa-box"></i> Số lượng trong kho:</strong>
                <input type="number" v-model="stockQuantity" required />
            </label>

            <!-- Hiển thị danh mục -->
            <label>
                <strong><i class="fas fa-list"></i> Danh mục:</strong>
                <select v-model="categoryId" @change="fetchSubcategoriesByCategory">
                    <option v-for="category in categories" :key="category.CategoryId" :value="category.CategoryId">
                        {{ category.CategoryName }}
                    </option>
                </select>
            </label>

            <!-- Hiển thị danh mục phụ -->
            <label>
                <strong><i class="fas fa-list-alt"></i> Danh mục phụ:</strong>
                <select v-model="subCategoryId">
                    <option v-for="subcategory in subcategories" :key="subcategory.SubcategoryId"
                        :value="subcategory.SubcategoryId">
                        {{ subcategory.Description }}
                    </option>
                </select>
            </label>

            <label>
                <strong><i class="fas fa-toggle-on"></i> Kích hoạt:</strong>
                <select v-model="isActive">
                    <option :value="true">Có</option>
                    <option :value="false">Không</option>
                </select>
            </label>

            <!-- Thêm phần chi tiết sản phẩm -->
            <h3><i class="fas fa-info-circle"></i> Chi tiết sản phẩm</h3>
            <label>
                <strong><i class="fas fa-industry"></i> Thương hiệu:</strong>
                <select v-model="brandId">
                    <option v-for="brand in brands" :key="brand.BrandId" :value="brand.BrandId">
                        {{ brand.BrandName }}
                    </option>
                </select>
            </label>
            <label>
                <strong><i class="fas fa-microchip"></i> CPU:</strong>
                <input type="text" v-model="processor" />
            </label>
            <label>
                <strong><i class="fas fa-memory"></i> RAM:</strong>
                <input type="text" v-model="ram" />
            </label>
            <label>
                <strong><i class="fas fa-hdd"></i> Lưu trữ:</strong>
                <input type="text" v-model="storage" />
            </label>
            <label>
                <strong><i class="fas fa-desktop"></i> Màn hình:</strong>
                <input type="text" v-model="display" />
            </label>
            <label>
                <strong><i class="fas fa-battery-half"></i> Pin:</strong>
                <input type="text" v-model="battery" />
            </label>
            <label>
                <strong><i class="fas fa-cogs"></i> Hệ điều hành:</strong>
                <input type="text" v-model="operatingSystem" />
            </label>
            <label>
                <strong><i class="fas fa-camera"></i> Camera:</strong>
                <input type="text" v-model="camera" />
            </label>
            <label>
                <strong><i class="fas fa-ruler"></i> Kích thước:</strong>
                <input type="text" v-model="dimensions" />
            </label>
            <label>
                <strong><i class="fas fa-weight"></i> Trọng lượng:</strong>
                <input type="text" v-model="weight" />
            </label>
            <label>
                <strong><i class="fas fa-wifi"></i> Kết nối:</strong>
                <input type="text" v-model="connectivity" />
            </label>
            <label>
                <strong><i class="fas fa-palette"></i> Tùy chọn màu:</strong>
                <input type="text" v-model="colorOptions" />
            </label>
            <label>
                <strong><i class="fas fa-shield-alt"></i> Thời gian bảo hành:</strong>
                <input type="number" v-model="warrantyPeriod" />
            </label>
            <label>
                <strong><i class="fas fa-lightbulb"></i> Đặc điểm bổ sung:</strong>
                <textarea v-model="additionalFeatures"></textarea>
            </label>

            <label>
                <strong><i class="fas fa-images"></i> Hình ảnh:</strong>
                <input type="file" @change="handleFileUpload" multiple />
                <div class="image-preview">
                    <h4><i class="fas fa-eye"></i> Hình ảnh đã chọn:</h4>
                    <div class="image-list">
                        <div v-for="(url, index) in imagePreviews" :key="index" class="image-item">
                            <img :src="url" alt="Ảnh sản phẩm" />
                            <button class="delete-button" @click.prevent="removeImage(index)">
                                <i class="fas fa-trash"></i> Xóa
                            </button>
                        </div>
                    </div>
                </div>
            </label>
        </form>
        <button type="submit" class="save-button"><i class="fas fa-save"></i> Lưu sản phẩm</button>
        <button class="back-button" @click="goBack"><i class="fas fa-arrow-left"></i> Quay lại</button>
    </div>
</template>


<script>
export default {
    data() {
        return {
            productName: '',
            description: '',
            price: null,
            stockQuantity: null,
            categoryId: '',
            subCategoryId: null,
            isActive: true,
            brandId: '', // Thay đổi từ brand sang brandId
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
            imagePreviews: [],
            categories: [],
            subcategories: [],

        };
    },
    mounted() {
        this.fetchCategories();
        this.fetchBrands(); // Gọi hàm tải nhãn hàng khi component được mount
    },
    methods: {
        async fetchCategories() {
            try {
                const response = await fetch('http://localhost:5000/api/Category');
                this.categories = await response.json();
            } catch (error) {
                console.error('Lỗi khi tải danh sách danh mục:', error);
                alert('Đã xảy ra lỗi khi tải danh mục.');
            }
        },
        async fetchBrands() {
            try {
                const response = await fetch('http://localhost:5000/api/Brands');
                this.brands = await response.json(); // Tải danh sách nhãn hàng
            } catch (error) {
                console.error('Lỗi khi tải danh sách nhãn hàng:', error);
                alert('Đã xảy ra lỗi khi tải nhãn hàng.');
            }
        },
        async fetchSubcategoriesByCategory() {
            if (!this.categoryId) return;
            try {
                const response = await fetch(`http://localhost:5000/api/Category/${this.categoryId}`);
                this.subcategories = await response.json();
            } catch (error) {
                console.error('Lỗi khi tải danh sách danh mục phụ:', error);
                alert('Đã xảy ra lỗi khi tải danh mục phụ.');
            }
        },
        async createProduct() {
            try {
                const formData = new FormData();
                formData.append('productName', this.productName);
                formData.append('description', this.description);
                formData.append('price', this.price);
                formData.append('stockQuantity', this.stockQuantity);
                formData.append('categoryId', this.categoryId);
                formData.append('subCategoryId', this.subCategoryId);
                formData.append('isActive', this.isActive);
                formData.append('brandId', this.brandId); // Cập nhật để sử dụng brandId
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
            this.categoryId = '';
            this.subCategoryId = '';
            this.isActive = true;
            this.brandId = ''; // Reset brandId
            this.processor = '';
            this.ram = '';
            this.storage = '';
            this.display = '';
            this.battery = '';
            this.operatingSystem = '';
            this.camera = '';
            this.dimensions = '';
            this.weight = '';
            this.connectivity = '';
            this.colorOptions = '';
            this.warrantyPeriod = null;
            this.additionalFeatures = '';
            this.imageFiles = [];
            this.imagePreviews = [];
        }
    }
};
</script>

<style scoped>
.create-product-container {
    padding: 2rem 3rem;
    /* Giảm khoảng cách padding cho gọn gàng */
    background-color: #ffffff;
    color: #2c3e50;
    border-radius: 12px;
    max-width: 1200px;
    /* Đặt giới hạn chiều rộng */
    margin: auto;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    font-family: 'Roboto', sans-serif;
}

h2 {
    color: #27ae60;
    text-align: center;
    margin-bottom: 2rem;
    /* Tăng khoảng cách dưới tiêu đề */
    font-weight: 700;
    font-size: 24px;
}

.product-form {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    /* Chia thành 4 cột */
    gap: 2rem;
    /* Thêm khoảng cách giữa các cột */
}

label {
    color: #2c3e50;
    font-weight: 600;
    margin-top: 1rem;
}

input[type="text"],
input[type="number"],
textarea,
select {
    width: 100%;
    padding: 12px;
    margin-top: 5px;
    background-color: #ecf0f1;
    border: 1px solid #bdc3c7;
    border-radius: 8px;
    color: #2c3e50;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

input:focus,
textarea:focus,
select:focus {
    border-color: #27ae60;
    box-shadow: 0 0 8px rgba(39, 174, 96, 0.3);
}

.save-button,
.back-button {
    width: 100%;
    padding: 12px 20px;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
    margin-top: 1rem;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.save-button {
    background-color: #27ae60;
    color: #ffffff;
}

.save-button:hover {
    background-color: #2ecc71;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.back-button {
    background-color: #2980b9;
    color: #ffffff;
}

.back-button:hover {
    background-color: #3498db;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.delete-button {
    background-color: #e74c3c;
    color: #ffffff;
    border: none;
    padding: 5px 8px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.3s;
}

.delete-button:hover {
    background-color: #c0392b;
}

.image-preview {
    margin-top: 20px;
}

.image-list {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.image-item {
    position: relative;
    width: 100px;
    /* Thêm giới hạn chiều rộng cho ảnh */
}

.image-item img {
    width: 100%;
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
    transition: background-color 0.3s;
}

.delete-button:hover {
    background-color: #c0392b;
}

/* Tạo khoảng cách cho các trường thêm chi tiết sản phẩm */
h3 {
    font-size: 20px;
    color: #2c3e50;
    margin-top: 2rem;
    margin-bottom: 1rem;
    font-weight: 700;
    text-align: center;
}

/* Cải thiện hiển thị các trường chọn (select) */
select {
    padding: 10px;
    background-color: #ecf0f1;
    border: 1px solid #bdc3c7;
    border-radius: 8px;
    color: #2c3e50;
    font-size: 14px;
    width: 100%;
}

@media (max-width: 768px) {
    .product-form {
        grid-template-columns: 1fr;
        /* Chuyển sang một cột cho màn hình nhỏ */
    }
}
</style>
