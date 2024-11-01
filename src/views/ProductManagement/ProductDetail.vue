<template>
    <div class="product-detail-container">
        <h2>Chi tiết sản phẩm: {{ product.ProductName }}</h2>

        <!-- Hiển thị hình ảnh sản phẩm -->
        <div v-if="product.ImageUrl" class="product-image">
            <img :src="product.ImageUrl" alt="Ảnh sản phẩm" />
        </div>

        <p><strong>Mô tả:</strong> {{ product.Description }}</p>
        <p>
            <strong>Giá:</strong>
            {{ product.Price ? product.Price.toLocaleString() : 'N/A' }} VND
        </p>
        <p><strong>Danh mục phụ:</strong> {{ product.SubCategoryId }}</p>
        <p><strong>Danh mục:</strong> {{ product.CategoryId }}</p>
        <p><strong>Kích hoạt:</strong> {{ product.IsActive ? 'Có' : 'Không' }}</p>

        <div v-if="productDetail">
            <h3>Thông số kỹ thuật:</h3>
            <p><strong>Thương hiệu:</strong> {{ productDetail.Brand }}</p>
            <p><strong>CPU:</strong> {{ productDetail.Processor }}</p>
            <p><strong>RAM:</strong> {{ productDetail.RAM }}</p>
            <p><strong>Lưu trữ:</strong> {{ productDetail.Storage }}</p>
            <p><strong>Màn hình:</strong> {{ productDetail.Display }}</p>
            <p><strong>Pin:</strong> {{ productDetail.Battery }}</p>
            <p><strong>Hệ điều hành:</strong> {{ productDetail.OperatingSystem }}</p>
            <p><strong>Camera:</strong> {{ productDetail.Camera }}</p>
            <p><strong>Kích thước:</strong> {{ productDetail.Dimensions }}</p>
            <p><strong>Trọng lượng:</strong> {{ productDetail.Weight }}</p>
            <p><strong>Kết nối:</strong> {{ productDetail.Connectivity }}</p>
            <p><strong>Tùy chọn màu:</strong> {{ productDetail.ColorOptions }}</p>
            <p><strong>Thời gian bảo hành:</strong> {{ productDetail.WarrantyPeriod }} tháng</p>
            <p><strong>Đặc điểm bổ sung:</strong> {{ productDetail.AdditionalFeatures }}</p>
        </div>

        <!-- Nút Quay lại và Cập nhật -->
        <button @click="goBack">Quay lại danh sách</button>
        <button @click="editProduct">Cập nhật sản phẩm</button>
    </div>
</template>

<script>
export default {
    name: 'ProductDetail',
    data() {
        return {
            product: {},
            productDetail: null,
            productId: this.$route.params.productId, // productId
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
                if (!response.ok) throw new Error('Lỗi khi tải chi tiết sản phẩm');
                this.product = await response.json();
            } catch (error) {
                console.error(error);
                alert('Không thể tải chi tiết sản phẩm.');
            }
        },
        async fetchProductDetails() {
            try {
                const response = await fetch(`http://localhost:5000/api/productdetails/product/${this.productId}`);
                if (!response.ok) throw new Error('Lỗi khi tải thông số kỹ thuật sản phẩm');
                const details = await response.json();
                this.productDetail = details[0]; // Lấy chi tiết đầu tiên
            } catch (error) {
                console.error("Chi tiết lỗi khi tải:", error.message);
                alert("Không thể tải thông số kỹ thuật sản phẩm.");
            }
        },


        goBack() {
            this.$router.push('/admin/products');
        },
        editProduct() {
            this.$router.push({ name: 'ProductForm', params: { productId: this.productId } });
        }
    }
};
</script>

<style scoped>
.product-detail-container {
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

.product-image {
    text-align: center;
    margin-bottom: 20px;
}

.product-image img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

h3 {
    color: #3498db;
    font-size: 20px;
    margin-top: 15px;
}

p {
    font-size: 16px;
    color: #333;
    line-height: 1.6;
    margin: 8px 0;
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
    display: block;
    margin: 20px auto;
}

button:hover {
    background-color: #2980b9;
}
</style>
