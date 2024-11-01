<template>
    <div class="product-edit-container">
        <h2>Chỉnh sửa sản phẩm: {{ product.ProductName }}</h2>

        <form @submit.prevent="updateProduct">
            <div class="form-group">
                <label for="ProductName">Tên sản phẩm:</label>
                <input v-model="product.ProductName" type="text" id="ProductName" required />
            </div>

            <div class="form-group">
                <label for="ImageUrl">URL hình ảnh:</label>
                <input v-model="product.ImageUrl" type="text" id="ImageUrl" />
            </div>

            <div class="form-group">
                <label for="Description">Mô tả:</label>
                <textarea v-model="product.Description" id="Description" required></textarea>
            </div>

            <div class="form-group">
                <label for="Price">Giá (VND):</label>
                <input v-model="product.Price" type="number" id="Price" required />
            </div>

            <div class="form-group">
                <label for="SubCategoryId">Danh mục phụ:</label>
                <input v-model="product.SubCategoryId" type="text" id="SubCategoryId" />
            </div>

            <div class="form-group">
                <label for="CategoryId">Danh mục:</label>
                <input v-model="product.CategoryId" type="text" id="CategoryId" />
            </div>

            <div class="form-group">
                <label for="IsActive">Kích hoạt:</label>
                <select v-model="product.IsActive" id="IsActive">
                    <option :value="true">Có</option>
                    <option :value="false">Không</option>
                </select>
            </div>

            <h3>Thông số kỹ thuật</h3>

            <div class="form-group" v-if="productDetail">
                <label for="Brand">Thương hiệu:</label>
                <input v-model="productDetail.Brand" type="text" id="Brand" />
            </div>

            <div class="form-group">
                <label for="Processor">CPU:</label>
                <input v-model="productDetail.Processor" type="text" id="Processor" />
            </div>

            <div class="form-group">
                <label for="RAM">RAM:</label>
                <input v-model="productDetail.RAM" type="text" id="RAM" />
            </div>

            <div class="form-group">
                <label for="Storage">Lưu trữ:</label>
                <input v-model="productDetail.Storage" type="text" id="Storage" />
            </div>

            <!-- Thêm các trường chi tiết khác theo mẫu trên -->

            <button type="submit">Lưu thay đổi</button>
            <button type="button" @click="goBack">Hủy</button>
        </form>
    </div>
</template>

<script>
export default {
    name: 'ProductEdit',
    data() {
        return {
            product: {},
            productDetail: null,
            productId: this.$route.params.productId,
        };
    },
    async created() {
        await this.fetchProduct();
        await this.fetchProductDetails();
    },
    methods: {
        async fetchProduct() {
            try {
                const response = await fetch(`http://localhost:5000/api/Product/${this.productId}`);
                if (!response.ok) throw new Error('Lỗi khi tải sản phẩm');
                this.product = await response.json();
            } catch (error) {
                console.error(error);
                alert('Không thể tải sản phẩm.');
            }
        },
        async fetchProductDetails() {
            try {
                const response = await fetch(`http://localhost:5000/api/productdetails/product/${this.productId}`);
                if (!response.ok) throw new Error('Lỗi khi tải thông số kỹ thuật');
                const details = await response.json();
                this.productDetail = details[0];
            } catch (error) {
                console.error("Lỗi khi tải chi tiết:", error.message);
                alert("Không thể tải thông số kỹ thuật sản phẩm.");
            }
        },
        async updateProduct() {
            try {
                // Cập nhật thông tin cơ bản của sản phẩm
                const productResponse = await fetch(`http://localhost:5000/api/Product/${this.productId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(this.product),
                });
                if (!productResponse.ok) throw new Error('Lỗi khi cập nhật sản phẩm');

                // Cập nhật chi tiết kỹ thuật của sản phẩm
                const detailResponse = await fetch(`http://localhost:5000/api/productdetails/${this.productId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(this.productDetail),
                });
                if (!detailResponse.ok) throw new Error('Lỗi khi cập nhật chi tiết sản phẩm');

                alert('Cập nhật sản phẩm thành công');
                this.$router.push('/admin/products');
            } catch (error) {
                console.error("Lỗi cập nhật:", error.message);
                alert("Không thể cập nhật sản phẩm.");
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
    max-width: 800px;
    margin: 20px auto;
    padding: 20px;
    background-color: #f8fafc;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    font-family: 'Arial', sans-serif;
}

h2 {
    color: #34495e;
    font-size: 26px;
    text-align: center;
    margin-bottom: 20px;
}

.form-group {
    margin-bottom: 15px;
}

label {
    font-weight: bold;
    color: #333;
    display: block;
    margin-bottom: 5px;
}

input,
textarea,
select {
    width: 100%;
    padding: 8px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
}

button {
    padding: 10px 15px;
    font-size: 16px;
    font-weight: bold;
    color: #ffffff;
    background-color: #3498db;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    display: inline-block;
    margin-right: 10px;
}

button:hover {
    background-color: #2980b9;
}
</style>
