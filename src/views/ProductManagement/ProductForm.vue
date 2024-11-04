<template>
    <div class="product-edit-container">
        <h2><i class="fas fa-edit"></i> Cập nhật thông tin sản phẩm</h2>

        <form @submit.prevent="updateProduct" class="product-form">
            <div v-if="product">
                <!-- Thông tin sản phẩm -->
                <div class="form-group">
                    <label for="ProductName"><strong><i class="fas fa-tag"></i> Tên sản phẩm:</strong></label>
                    <input type="text" id="ProductName" v-model="product.ProductName" required />
                </div>

                <div class="form-group">
                    <label for="Description"><strong><i class="fas fa-align-left"></i> Mô tả:</strong></label>
                    <textarea id="Description" v-model="product.Description" required></textarea>
                </div>

                <div class="form-row">
                    <div class="form-group half-width">
                        <label for="Price"><strong><i class="fas fa-dollar-sign"></i> Giá (VND):</strong></label>
                        <input type="number" id="Price" v-model="product.Price" required />
                    </div>
                    <div class="form-group half-width">
                        <label for="StockQuantity"><strong><i class="fas fa-boxes"></i> Số lượng trong
                                kho:</strong></label>
                        <input type="number" id="StockQuantity" v-model="product.StockQuantity" required />
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group half-width">
                        <label for="CategoryId"><strong><i class="fas fa-list"></i> Danh mục:</strong></label>
                        <select id="CategoryId" v-model="product.CategoryId" @change="onChangeCategory">
                            <option v-for="category in categories" :key="category.CategoryId"
                                :value="category.CategoryId">
                                {{ category.CategoryName }}
                            </option>
                        </select>
                    </div>
                    <div class="form-group half-width">
                        <label for="SubCategoryId"><strong><i class="fas fa-th-large"></i> Danh mục
                                phụ:</strong></label>
                        <select id="SubCategoryId" v-model="product.SubCategoryId">
                            <option v-for="subcategory in subcategories" :key="subcategory.SubcategoryId"
                                :value="subcategory.SubcategoryId">
                                {{ subcategory.Description }}
                            </option>
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label for="IsActive"><strong><i class="fas fa-toggle-on"></i> Kích hoạt:</strong></label>
                    <select id="IsActive" v-model="product.IsActive">
                        <option :value="true">Có</option>
                        <option :value="false">Không</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="BrandId"><strong><i class="fas fa-industry"></i> Thương hiệu:</strong></label>
                    <select id="BrandId" v-model="product.BrandId">
                        <option v-for="brand in brands" :key="brand.BrandId" :value="brand.BrandId">
                            {{ brand.BrandName }}
                        </option>
                    </select>
                </div>

                <h3><i class="fas fa-cogs"></i> Thông số kỹ thuật</h3>
                <div class="form-group">
                    <label for="Processor"><strong><i class="fas fa-microchip"></i> CPU:</strong></label>
                    <input type="text" id="Processor" v-model="product.Processor" />
                </div>
                <div class="form-group">
                    <label for="RAM"><strong><i class="fas fa-memory"></i> RAM:</strong></label>
                    <input type="text" id="RAM" v-model="product.RAM" />
                </div>
                <div class="form-group">
                    <label for="Storage"><strong><i class="fas fa-hdd"></i> Lưu trữ:</strong></label>
                    <input type="text" id="Storage" v-model="product.Storage" />
                </div>
                <div class="form-group">
                    <label for="Display"><strong><i class="fas fa-desktop"></i> Màn hình:</strong></label>
                    <input type="text" id="Display" v-model="product.Display" />
                </div>
                <div class="form-group">
                    <label for="Battery"><strong><i class="fas fa-battery-full"></i> Pin:</strong></label>
                    <input type="text" id="Battery" v-model="product.Battery" />
                </div>
                <div class="form-group">
                    <label for="OperatingSystem"><strong><i class="fas fa-laptop-code"></i> Hệ điều
                            hành:</strong></label>
                    <input type="text" id="OperatingSystem" v-model="product.OperatingSystem" />
                </div>
                <div class="form-group">
                    <label for="Camera"><strong><i class="fas fa-camera"></i> Camera:</strong></label>
                    <input type="text" id="Camera" v-model="product.Camera" />
                </div>
                <div class="form-group">
                    <label for="Dimensions"><strong><i class="fas fa-ruler"></i> Kích thước:</strong></label>
                    <input type="text" id="Dimensions" v-model="product.Dimensions" />
                </div>
                <div class="form-group">
                    <label for="Weight"><strong><i class="fas fa-weight"></i> Trọng lượng:</strong></label>
                    <input type="text" id="Weight" v-model="product.Weight" />
                </div>
                <div class="form-group">
                    <label for="Connectivity"><strong><i class="fas fa-wifi"></i> Kết nối:</strong></label>
                    <input type="text" id="Connectivity" v-model="product.Connectivity" />
                </div>
                <div class="form-group">
                    <label for="ColorOptions"><strong><i class="fas fa-palette"></i> Tùy chọn màu:</strong></label>
                    <input type="text" id="ColorOptions" v-model="product.ColorOptions" />
                </div>
                <div class="form-group">
                    <label for="WarrantyPeriod"><strong><i class="fas fa-calendar-check"></i> Thời gian bảo
                            hành:</strong></label>
                    <input type="text" id="WarrantyPeriod" v-model="product.WarrantyPeriod" />
                </div>
                <div class="form-group">
                    <label for="AdditionalFeatures"><strong><i class="fas fa-plus-circle"></i> Đặc điểm bổ
                            sung:</strong></label>
                    <textarea id="AdditionalFeatures" v-model="product.AdditionalFeatures"></textarea>
                </div>

                <!-- Phần hình ảnh hiện có -->
                <div class="form-group">
                    <label><strong><i class="fas fa-images"></i> Hình ảnh hiện có:</strong></label>
                    <button v-if="existingImages.length" class="delete-all-button" @click.prevent="deleteAllImages">
                        <i class="fas fa-trash-alt"></i> Xóa tất cả hình ảnh
                    </button>
                    <div class="image-list">
                        <div v-for="(url, index) in existingImages" :key="index" class="image-item">
                            <img :src="getImageUrl(url)" alt="Ảnh sản phẩm" />
                            <button class="delete-button" @click.prevent="addImageToDelete(url)">
                                <i class="fas fa-trash"></i> Xóa
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Thêm hình ảnh mới -->
                <div class="form-group">
                    <label><strong><i class="fas fa-upload"></i> Thêm hình ảnh mới:</strong></label>
                    <input type="file" name="images" ref="fileInput" @change="handleFileUpload" multiple />
                    <div class="image-list">
                        <div v-for="(newImageUrl, index) in newImageUrls" :key="index" class="image-item">
                            <img :src="newImageUrl" alt="Hình ảnh mới" />
                            <button class="delete-button" @click.prevent="removeNewImageUrl(index)">
                                <i class="fas fa-trash"></i> Xóa
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
            return url.startsWith('http') ? url : `http://localhost:5000/${url}`;
        }
        ,
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

                // Đảm bảo `imagesData.images` là một mảng và gán vào `existingImages`
                if (Array.isArray(imagesData.images)) {
                    this.existingImages = imagesData.images.map(image => this.getImageUrl(image));

                    // Thông báo nếu không có ảnh
                    if (this.existingImages.length === 0) {
                        alert("Không có hình ảnh nào cho sản phẩm này.");
                    }
                } else {
                    console.error('Dữ liệu hình ảnh không đúng định dạng:', imagesData);
                    alert('Đã xảy ra lỗi khi tải hình ảnh sản phẩm.');
                    this.existingImages = [];
                }
            } catch (error) {
                console.error('Lỗi khi tải hình ảnh:', error);
                alert('Đã xảy ra lỗi khi tải hình ảnh sản phẩm.');
                this.existingImages = [];
            }
        }


        ,
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

            // Thêm dữ liệu sản phẩm vào FormData
            for (const key in this.product) {
                if (this.product.hasOwnProperty(key)) {
                    formData.append(key, this.product[key]);
                }
            }

            // Thêm tệp hình ảnh mới vào FormData
            const input = this.$refs.fileInput;
            if (input && input.files.length > 0) {
                for (const file of input.files) {
                    formData.append('images', file); // 'images' là tên trường mà server đang nhận
                }
            }
            // Chuyển đổi imagesToDelete thành chuỗi JSON trước khi truyền đi
            formData.append('imagesToDelete', JSON.stringify(this.imagesToDelete));
            try {
                // Gửi yêu cầu PUT với FormData (không cần thiết lập Content-Type)
                const response = await fetch(`http://localhost:5000/api/Product/${this.productId}`, {
                    method: 'PUT',
                    body: formData
                });

                if (!response.ok) throw new Error('Lỗi khi cập nhật sản phẩm');

                const responseData = await response.json();

                // Thông báo nếu có hình ảnh đã xóa
                if (responseData.deletedImages && responseData.deletedImages.length > 0) {
                    alert(`Các hình ảnh sau đã được xóa: \n${responseData.deletedImages.join('\n')}`);
                } else {
                    alert('Cập nhật sản phẩm thành công, không có hình ảnh nào cần xóa.');
                }

                // Chuyển hướng về trang sản phẩm
                this.$router.push('/admin/products');
            } catch (error) {
                console.error("Lỗi cập nhật:", error.message);
                alert("Không thể cập nhật sản phẩm.");
            }
        }




        ,
        addImageToDelete(url) {
            const relativeUrl = url.replace('http://localhost:5000/', '');
            if (!this.imagesToDelete.includes(relativeUrl)) {
                this.imagesToDelete.push(relativeUrl);
            }
            this.existingImages = this.existingImages.filter(image => image !== url);
            console.log("Danh sách imagesToDelete:", this.imagesToDelete);
        },
        deleteAllImages() {
            this.imagesToDelete = [...this.existingImages.map(url => url.replace('http://localhost:5000/', ''))];
            this.existingImages = [];
            console.log("Danh sách tất cả imagesToDelete:", this.imagesToDelete);
        },
        removeNewImageUrl(index) {
            this.newImageUrls.splice(index, 1);
            this.newImages.splice(index, 1); // Xóa file khỏi newImages
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
    padding: 2.5rem;
    background-color: #ffffff;
    /* Nền sáng */
    color: #2c3e50;
    /* Màu chữ tối */
    border-radius: 12px;
    max-width: 900px;
    margin: 40px auto;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    font-family: 'Roboto', sans-serif;
}

h2 {
    color: #27ae60;
    /* Màu nhấn */
    text-align: center;
    margin-bottom: 1.5rem;
    font-weight: 700;
}

.product-form {
    display: flex;
    flex-direction: column;
}

.form-group {
    margin-top: 1rem;
}

label {
    color: #2c3e50;
    /* Màu chữ tối */
    font-weight: 600;
}

input[type="text"],
input[type="number"],
textarea,
select {
    width: 100%;
    padding: 12px;
    margin-top: 5px;
    background-color: #ecf0f1;
    /* Nền sáng cho input */
    border: 1px solid #bdc3c7;
    /* Viền sáng */
    border-radius: 8px;
    color: #2c3e50;
    /* Màu chữ tối */
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

input:focus,
textarea:focus,
select:focus {
    border-color: #27ae60;
    /* Màu nhấn khi focus */
    box-shadow: 0 0 8px rgba(39, 174, 96, 0.3);
}

.form-row {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
}

.half-width {
    flex: 1;
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

.delete-button,
.delete-all-button {
    background-color: #e74c3c;
    /* Màu đỏ */
    color: #ffffff;
    border: none;
    padding: 5px 8px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.3s;
}

.delete-button:hover,
.delete-all-button:hover {
    background-color: #c0392b;
    /* Màu đỏ đậm khi hover */
}

button {
    padding: 10px 20px;
    color: #ffffff;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
    margin-top: 1rem;
    transition: background-color 0.3s ease, box-shadow 0.3s ease;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.save-button {
    background-color: #27ae60;
    /* Màu xanh lá */
}

.back-button {
    background-color: #2980b9;
    /* Màu xanh lam */
    width: 100%;
}

button:hover {
    background-color: #2ecc71;
    /* Màu xanh lá sáng */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.image-preview img {
    max-width: 100%;
    height: auto;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    margin-top: 0.5rem;
}
</style>
