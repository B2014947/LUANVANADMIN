<template>
    <div class="product-edit-container">
        <h2>Cập nhật thông tin sản phẩm</h2>

        <form @submit.prevent="updateProduct" class="product-form">
            <div v-if="product">
                <!-- Thông tin sản phẩm -->
                <div class="form-group">
                    <label for="ProductName"><strong>Tên sản phẩm:</strong></label>
                    <input type="text" id="ProductName" v-model="product.ProductName" required />
                </div>

                <div class="form-group">
                    <label for="Description"><strong>Mô tả:</strong></label>
                    <textarea id="Description" v-model="product.Description" required></textarea>
                </div>

                <div class="form-row">
                    <div class="form-group half-width">
                        <label for="Price"><strong>Giá (VND):</strong></label>
                        <input type="number" id="Price" v-model="product.Price" required />
                    </div>
                    <div class="form-group half-width">
                        <label for="StockQuantity"><strong>Số lượng trong kho:</strong></label>
                        <input type="number" id="StockQuantity" v-model="product.StockQuantity" required />
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group half-width">
                        <label for="CategoryId"><strong>Danh mục:</strong></label>
                        <select id="CategoryId" v-model="product.CategoryId" @change="onChangeCategory">
                            <option v-for="category in categories" :key="category.CategoryId"
                                :value="category.CategoryId">
                                {{ category.CategoryName }}
                            </option>
                        </select>
                    </div>
                    <div class="form-group half-width">
                        <label for="SubCategoryId"><strong>Danh mục phụ:</strong></label>
                        <select id="SubCategoryId" v-model="product.SubCategoryId">
                            <option v-for="subcategory in subcategories" :key="subcategory.SubcategoryId"
                                :value="subcategory.SubcategoryId">
                                {{ subcategory.Description }}
                            </option>
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label for="IsActive"><strong>Kích hoạt:</strong></label>
                    <select id="IsActive" v-model="product.IsActive">
                        <option :value="true">Có</option>
                        <option :value="false">Không</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="BrandId"><strong>Thương hiệu:</strong></label>
                    <select id="BrandId" v-model="product.BrandId">
                        <option v-for="brand in brands" :key="brand.BrandId" :value="brand.BrandId">
                            {{ brand.BrandName }}
                        </option>
                    </select>
                </div>

                <h3>Thông số kỹ thuật</h3>
                <div class="form-group">
                    <label for="Processor"><strong>CPU:</strong></label>
                    <input type="text" id="Processor" v-model="product.Processor" />
                </div>
                <div class="form-group">
                    <label for="RAM"><strong>RAM:</strong></label>
                    <input type="text" id="RAM" v-model="product.RAM" />
                </div>
                <div class="form-group">
                    <label for="Storage"><strong>Lưu trữ:</strong></label>
                    <input type="text" id="Storage" v-model="product.Storage" />
                </div>
                <div class="form-group">
                    <label for="Display"><strong>Màn hình:</strong></label>
                    <input type="text" id="Display" v-model="product.Display" />
                </div>
                <div class="form-group">
                    <label for="Battery"><strong>Pin:</strong></label>
                    <input type="text" id="Battery" v-model="product.Battery" />
                </div>
                <div class="form-group">
                    <label for="OperatingSystem"><strong>Hệ điều hành:</strong></label>
                    <input type="text" id="OperatingSystem" v-model="product.OperatingSystem" />
                </div>
                <div class="form-group">
                    <label for="Camera"><strong>Camera:</strong></label>
                    <input type="text" id="Camera" v-model="product.Camera" />
                </div>
                <div class="form-group">
                    <label for="Dimensions"><strong>Kích thước:</strong></label>
                    <input type="text" id="Dimensions" v-model="product.Dimensions" />
                </div>
                <div class="form-group">
                    <label for="Weight"><strong>Trọng lượng:</strong></label>
                    <input type="text" id="Weight" v-model="product.Weight" />
                </div>
                <div class="form-group">
                    <label for="Connectivity"><strong>Kết nối:</strong></label>
                    <input type="text" id="Connectivity" v-model="product.Connectivity" />
                </div>
                <div class="form-group">
                    <label for="ColorOptions"><strong>Tùy chọn màu:</strong></label>
                    <input type="text" id="ColorOptions" v-model="product.ColorOptions" />
                </div>
                <div class="form-group">
                    <label for="WarrantyPeriod"><strong>Thời gian bảo hành:</strong></label>
                    <input type="text" id="WarrantyPeriod" v-model="product.WarrantyPeriod" />
                </div>
                <div class="form-group">
                    <label for="AdditionalFeatures"><strong>Đặc điểm bổ sung:</strong></label>
                    <textarea id="AdditionalFeatures" v-model="product.AdditionalFeatures"></textarea>
                </div>

                <!-- Phần hình ảnh -->
                <div class="form-group">
                    <label><strong>Hình ảnh hiện có:</strong></label>
                    <div class="image-list">
                        <div v-for="(url, index) in existingImages" :key="index" class="image-item">
                            <img :src="getImageUrl(url)" alt="Ảnh sản phẩm" />
                            <button class="delete-button" @click.prevent="addImageToDelete(url)">
                                <i class="fas fa-trash"></i> Xóa
                            </button>
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <label><strong>Thêm hình ảnh mới:</strong></label>
                    <input type="file" name="images" ref="fileInput" @change="handleFileUpload" multiple />
                    <div class="image-list">
                        <div v-for="(newImageUrl, index) in newImageUrls" :key="index" class="image-item">
                            <img :src="newImageUrl" alt="Hình ảnh mới" />
                            <button class="delete-button" @click.prevent="removeNewImageUrl(index)">
                                <i class="fas fa-times"></i> Xóa
                            </button>
                        </div>
                    </div>
                </div>

                <button type="submit" class="save-button"><i class="fas fa-save"></i> Lưu thay đổi</button>
            </div>
        </form>

        <button class="back-button" @click="goBack"><i class="fas fa-arrow-left"></i> Quay lại</button>
    </div>
</template>

<script>
export default {
    name: 'ProductEdit',
    data() {
        return {
            product: {},
            existingImages: [],
            newImageUrls: [],
            newImages: [],
            imagesToDelete: [],
            productId: this.$route.params.productId,
            brands: [],
            categories: [],
            subcategories: []
        };
    },
    async created() {
        await this.fetchProduct();
        await this.fetchBrands();
        await this.fetchCategories();
    },
    methods: {
        getImageUrl(url) {
            return `${url}`; // Nếu cần thêm domain, có thể thêm `${window.location.origin}/${url}`
        },
        async fetchProduct() {
            try {
                const response = await fetch(`http://localhost:5000/api/Product/${this.productId}`);
                if (!response.ok) throw new Error('Lỗi khi tải chi tiết sản phẩm');
                const productData = await response.json();
                this.product = productData;

                await this.fetchProductImages(this.productId);
                await this.fetchProductDetails();

                if (this.product.CategoryId) {
                    await this.fetchSubcategories(this.product.CategoryId);
                }
            } catch (error) {
                console.error(error);
                alert('Không thể tải chi tiết sản phẩm.');
            }
        },
        async fetchProductImages(productId) {
            try {
                const response = await fetch(`http://localhost:5000/api/Product/images/${productId}`);
                if (!response.ok) throw new Error('Lỗi khi tải hình ảnh sản phẩm');
                const imagesData = await response.json();
                this.existingImages = imagesData.map(image => image.ImageUrl);
            } catch (error) {
                console.error('Lỗi khi tải hình ảnh:', error);
                this.existingImages = [];
            }
        },
        async fetchProductDetails() {
            try {
                const response = await fetch(`http://localhost:5000/api/productdetails/product/${this.productId}`);
                if (!response.ok) throw new Error('Lỗi khi tải thông số kỹ thuật sản phẩm');
                const details = await response.json();

                if (details.length > 0) {
                    const detail = details[0];
                    Object.assign(this.product, detail);
                }
            } catch (error) {
                console.error('Lỗi khi tải thông số kỹ thuật:', error);
                alert('Không thể tải thông số kỹ thuật sản phẩm.');
            }
        },
        async fetchBrands() {
            try {
                const response = await fetch('http://localhost:5000/api/Brands');
                this.brands = await response.json();
            } catch (error) {
                console.error('Lỗi khi tải danh sách nhãn hàng:', error);
                alert('Đã xảy ra lỗi khi tải nhãn hàng.');
            }
        },
        async fetchCategories() {
            try {
                const response = await fetch('http://localhost:5000/api/Category');
                this.categories = await response.json();
            } catch (error) {
                console.error('Lỗi khi tải danh sách danh mục:', error);
                alert('Đã xảy ra lỗi khi tải danh mục.');
            }
        },
        async fetchSubcategories(categoryId) {
            if (!categoryId) return;
            try {
                const response = await fetch(`http://localhost:5000/api/Category/${categoryId}`);
                if (!response.ok) throw new Error('Lỗi khi tải danh mục phụ');
                this.subcategories = await response.json();
            } catch (error) {
                console.error('Lỗi khi tải danh mục phụ:', error);
                alert('Đã xảy ra lỗi khi tải danh mục phụ.');
            }
        },
        async updateProduct() {
            const formData = new FormData();
            for (const key in this.product) {
                if (this.product.hasOwnProperty(key)) {
                    formData.append(key, this.product[key]);
                }
            }

            const input = this.$refs.fileInput;
            if (input && input.files.length > 0) {
                for (const file of input.files) {
                    formData.append('images', file);
                }
            }

            try {
                const response = await fetch(`http://localhost:5000/api/Product/${this.productId}`, {
                    method: 'PUT',
                    body: formData
                });

                if (!response.ok) throw new Error('Lỗi khi cập nhật sản phẩm');
                alert('Cập nhật sản phẩm thành công');
                this.$router.push('/admin/products');
            } catch (error) {
                console.error("Lỗi cập nhật:", error.message);
                alert("Không thể cập nhật sản phẩm.");
            }
        },
        addImageToDelete(url) {
            if (!this.imagesToDelete.includes(url)) {
                this.imagesToDelete.push(url);
            }
            this.existingImages = this.existingImages.filter(image => image !== url);
        },
        removeNewImageUrl(index) {
            this.newImageUrls.splice(index, 1);
        },
        handleFileUpload(event) {
            const files = Array.from(event.target.files);
            if (files.length === 0) {
                alert("Không có tệp nào được chọn.");
                return;
            }
            this.newImageUrls.push(...files.map(file => {
                this.newImages.push(file);
                return URL.createObjectURL(file);
            }));
        },
        goBack() {
            this.$router.push('/admin/products');
        },
        async onChangeCategory() {
            await this.fetchSubcategories(this.product.CategoryId);
        }
    }
};
</script>

<style scoped>
.product-edit-container {
    padding: 3rem;
    background-color: #1e2b38;
    color: #ecf0f1;
    border-radius: 12px;
    max-width: 800px;
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

.form-group {
    margin-top: 1rem;
}

.form-label {
    color: #bdc3c7;
    font-weight: 500;
}

.form-row {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
}

.half-width {
    flex: 1;
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

.image-list {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.image-item {
    position: relative;
}

.image-item img {
    width: 120px;
    height: auto;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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

button {
    padding: 10px 20px;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 16px;
    margin-top: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
}

.save-button {
    background-color: #27ae60;
}

.back-button {
    background-color: #c0392b;
    width: 100%;
}

button:hover {
    opacity: 0.9;
}
</style>
