<template>
    <div class="product-edit-container">
        <h2>Cập nhật thông tin sản phẩm</h2>

        <form @submit.prevent="updateProduct" class="product-form">
            <div v-if="product">
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
                        <label for="SubCategoryId"><strong>Danh mục phụ:</strong></label>
                        <input type="text" id="SubCategoryId" v-model="product.SubCategoryId" />
                    </div>

                    <div class="form-group half-width">
                        <label for="CategoryId"><strong>Danh mục:</strong></label>
                        <input type="text" id="CategoryId" v-model="product.CategoryId" />
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
                    <label><strong>Hình ảnh hiện có:</strong></label>
                    <div class="image-list">
                        <div v-for="(url, index) in existingImages" :key="index" class="image-item">
                            <img :src="url" alt="Ảnh sản phẩm" />
                            <button class="delete-button" @click.prevent="addImageToDelete(url)">
                                <i class="fas fa-trash"></i> Xóa
                            </button>
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <label><strong>Thêm URL hình ảnh mới:</strong></label>
                    <input type="text" v-model="newImageUrl" @keyup.enter="addImageUrl"
                        placeholder="Nhập URL và nhấn Enter" />
                </div>
                <ul class="url-list">
                    <li v-for="(url, index) in newImageUrls" :key="index">
                        {{ url }}
                        <button class="delete-button" @click.prevent="removeImageUrl(index)">
                            <i class="fas fa-times"></i> Xóa
                        </button>
                    </li>
                </ul>

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
            imagesToDelete: [],
            newImageUrl: '',
            productId: this.$route.params.productId,
        };
    },
    async created() {
        await this.fetchProduct();
    },
    methods: {
        async fetchProduct() {
            try {
                const response = await fetch(`http://localhost:5000/api/Product/${this.productId}`);
                if (!response.ok) throw new Error('Lỗi khi tải chi tiết sản phẩm');
                const productData = await response.json();
                this.product = productData;

                if (productData.productImages && Array.isArray(productData.productImages)) {
                    this.existingImages = productData.productImages;
                }
            } catch (error) {
                console.error(error);
                alert('Không thể tải chi tiết sản phẩm.');
            }
        },
        async updateProduct() {
            try {
                const payload = {
                    ...this.product,
                    newImageUrls: this.newImageUrls,
                    imagesToDelete: this.imagesToDelete,
                };
                const response = await fetch(`http://localhost:5000/api/Product/${this.productId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
                if (!response.ok) throw new Error('Lỗi khi cập nhật sản phẩm');
                alert('Cập nhật sản phẩm thành công');
                this.$router.push('/admin/products');
            } catch (error) {
                console.error("Lỗi cập nhật:", error.message);
                alert("Không thể cập nhật sản phẩm.");
            }
        },
        addImageUrl() {
            if (this.newImageUrl) {
                this.newImageUrls.push(this.newImageUrl);
                this.newImageUrl = '';
            }
        },
        removeImageUrl(index) {
            this.newImageUrls.splice(index, 1);
        },
        addImageToDelete(url) {
            if (!this.imagesToDelete.includes(url)) {
                this.imagesToDelete.push(url);
            }
        },
        goBack() {
            this.$router.push('/admin/products');
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
