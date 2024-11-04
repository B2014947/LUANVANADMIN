<template>
    <div class="product-detail-container">
        <h2><i class="fas fa-box-open"></i> Chi tiết sản phẩm</h2>

        <!-- Carousel hiển thị nhiều hình ảnh sản phẩm -->
        <div v-if="product.images && product.images.length" class="carousel">
            <div class="carousel-inner">
                <div v-for="(image, index) in product.images" :key="index" class="carousel-item"
                    :class="{ active: currentIndex === index }">
                    <img :src="getImageUrl(image)" alt="Ảnh sản phẩm" />
                </div>
            </div>
            <button class="carousel-control prev" @click="prevImage">❮</button>
            <button class="carousel-control next" @click="nextImage">❯</button>
        </div>

        <div class="info-group">
            <p><strong><i class="fas fa-tag"></i> Tên sản phẩm:</strong> {{ product.ProductName }}</p>
            <p><strong><i class="fas fa-file-alt"></i> Mô tả:</strong> {{ product.Description }}</p>
            <p>
                <strong><i class="fas fa-money-bill-wave"></i> Giá:</strong>
                {{ product.Price ? product.Price.toLocaleString() : 'N/A' }} VND
            </p>
            <p><strong><i class="fas fa-boxes"></i> Số lượng trong kho:</strong> {{ product.StockQuantity }}</p>
            <p><strong><i class="fas fa-list-alt"></i> Danh mục phụ:</strong> {{ product.SubCategoryName || 'N/A' }}</p>
            <p><strong><i class="fas fa-sitemap"></i> Danh mục:</strong> {{ product.CategoryName || 'N/A' }}</p>
            <p>
                <strong><i class="fas fa-toggle-on"></i> Kích hoạt:</strong>
                <span :class="product.IsActive ? 'status-active' : 'status-inactive'">
                    {{ product.IsActive ? 'Có' : 'Không' }}
                </span>
            </p>
        </div>

        <!-- Hiển thị thông tin chi tiết sản phẩm -->
        <div class="detail-group">
            <h3>Thông số kỹ thuật</h3>
            <p v-if="productDetail"><strong><i class="fas fa-microchip"></i> CPU:</strong> {{ productDetail.Processor }}
            </p>
            <p v-if="productDetail"><strong><i class="fas fa-memory"></i> RAM:</strong> {{ productDetail.RAM }}</p>
            <p v-if="productDetail"><strong><i class="fas fa-hdd"></i> Lưu trữ:</strong> {{ productDetail.Storage }}</p>
            <p v-if="productDetail"><strong><i class="fas fa-desktop"></i> Màn hình:</strong> {{ productDetail.Display
                }}</p>
            <p v-if="productDetail"><strong><i class="fas fa-battery-full"></i> Pin:</strong> {{ productDetail.Battery
                }}</p>
            <p v-if="productDetail"><strong><i class="fas fa-mobile-alt"></i> Hệ điều hành:</strong> {{
                productDetail.OperatingSystem }}</p>
            <p v-if="productDetail"><strong><i class="fas fa-camera"></i> Camera:</strong> {{ productDetail.Camera }}
            </p>
            <p v-if="productDetail"><strong><i class="fas fa-ruler-combined"></i> Kích thước:</strong> {{
                productDetail.Dimensions }}</p>
            <p v-if="productDetail"><strong><i class="fas fa-weight"></i> Trọng lượng:</strong> {{ productDetail.Weight
                }}</p>
            <p v-if="productDetail"><strong><i class="fas fa-plug"></i> Kết nối:</strong> {{ productDetail.Connectivity
                }}</p>
            <p v-if="productDetail"><strong><i class="fas fa-paint-brush"></i> Tùy chọn màu:</strong> {{
                productDetail.ColorOptions }}</p>
            <p v-if="productDetail"><strong><i class="fas fa-calendar-alt"></i> Thời gian bảo hành:</strong> {{
                productDetail.WarrantyPeriod }}</p>
            <p v-if="productDetail"><strong><i class="fas fa-plus-square"></i> Đặc điểm bổ sung:</strong> {{
                productDetail.AdditionalFeatures }}</p>
        </div>

        <!-- Nút Quay lại và Cập nhật -->
        <div class="button-group">
            <button class="back-button" @click="goBack">
                <i class="fas fa-arrow-left"></i> Quay lại
            </button>
            <button class="edit-button" @click="editProduct">
                <i class="fas fa-edit"></i> Cập nhật sản phẩm
            </button>
        </div>
    </div>
</template>


<script>
export default {
    name: 'ProductDetail',
    data() {
        return {
            product: {
                images: [] // Đảm bảo rằng product chứa mảng images
            },
            productDetail: null,
            productId: this.$route.params.productId, // Lấy productId từ route params
            currentIndex: 0 // Chỉ số ảnh hiện tại trong carousel
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
                const productData = await response.json();

                // Gán dữ liệu cho product và đảm bảo images là một mảng
                this.product = {
                    ...productData,
                    images: productData.images || [] // Đảm bảo mảng images luôn tồn tại
                };
            } catch (error) {
                console.error('Lỗi:', error);
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
                console.error('Chi tiết lỗi khi tải:', error.message);
                alert('Không thể tải thông số kỹ thuật sản phẩm.');
            }
        },
        getImageUrl(image) {
            // Loại bỏ phần "uploads/products/" nếu tồn tại
            const cleanedPath = image.replace(/^uploads[\\/]+products[\\/]+/, '').replace(/\\/g, '/');

            // Kiểm tra nếu URL đã là URL đầy đủ
            if (cleanedPath.startsWith('http')) {
                return cleanedPath;
            }

            // Ghép đường dẫn gốc với đường dẫn đã chỉnh sửa
            return `http://localhost:5000/uploads/products/${cleanedPath}`;
        },
        goBack() {
            this.$router.push('/admin/products');
        },
        editProduct() {
            this.$router.push({ name: 'ProductForm', params: { productId: this.productId } });
        },
        nextImage() {
            if (this.currentIndex < this.product.images.length - 1) {
                this.currentIndex++;
            } else {
                this.currentIndex = 0;
            }
        },
        prevImage() {
            if (this.currentIndex > 0) {
                this.currentIndex--;
            } else {
                this.currentIndex = this.product.images.length - 1;
            }
        }
    }
};
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

.product-detail-container {
    padding: 2.5rem;
    background-color: var(--main-bg-color);
    color: var(--text-color);
    border-radius: 12px;
    max-width: 1100px;
    margin: 40px auto;
    box-shadow: 0 4px 12px var(--shadow-color);
    font-family: 'Roboto', sans-serif;
}

h2 {
    color: var(--highlight-color);
    text-align: center;
    margin-bottom: 1.5rem;
    font-weight: 700;
}

.carousel {
    position: relative;
    margin-bottom: 1.5rem;
    overflow: hidden;
    border-radius: 8px;
    width: 100%;
    max-height: 500px;
}

.carousel-inner {
    display: flex;
    transition: transform 0.5s ease-in-out;
}

.carousel-item {
    flex: 0 0 100%;
    opacity: 0;
    transition: opacity 0.5s ease-in-out;
    display: none;
}

.carousel-item.active {
    opacity: 1;
    display: block;
}

.carousel-item img {
    width: 100%;
    height: auto;
    max-height: 500px;
    object-fit: contain;
    display: block;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.carousel-control {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background-color: rgba(0, 0, 0, 0.5);
    border: none;
    color: #ffffff;
    padding: 10px 15px;
    cursor: pointer;
    font-size: 24px;
    z-index: 2;
    border-radius: 50%;
    outline: none;
}

.carousel-control.prev {
    left: 10px;
}

.carousel-control.next {
    right: 10px;
}

.info-group p {
    font-size: 16px;
    color: var(--text-color);
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
}

.info-group strong {
    font-weight: 600;
    margin-right: 5px;
}

.status-active {
    color: #2ecc71;
    font-weight: 600;
}

.status-inactive {
    color: #e74c3c;
    font-weight: 600;
}

.button-group {
    display: flex;
    gap: 15px;
    margin-top: 20px;
}

.back-button,
.edit-button {
    padding: 12px 20px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    color: #ffffff;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s ease, box-shadow 0.3s ease;
    box-shadow: 0 2px 6px var(--shadow-color);
}

.back-button {
    background-color: #2980b9;
}

.edit-button {
    background-color: #27ae60;
}

.back-button:hover {
    background-color: #3498db;
    box-shadow: 0 4px 8px rgba(41, 128, 185, 0.3);
}

.edit-button:hover {
    background-color: #2ecc71;
    box-shadow: 0 4px 8px rgba(39, 174, 96, 0.3);
}

.back-button i,
.edit-button i {
    margin-right: 8px;
}

.detail-group {
    margin-top: 1.5rem;
    padding: 1.5rem;
    background-color: var(--secondary-bg-color);
    border-radius: 12px;
    box-shadow: 0 4px 12px var(--shadow-color);
}
</style>