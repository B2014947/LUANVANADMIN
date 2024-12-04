<template>
    <div class="brand-list-container">
        <h2 class="title">Danh sách Thương Hiệu</h2>
        <button @click="navigateToCreate" class="action-button create-button">Thêm Thương Hiệu Mới</button>
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tên Thương Hiệu</th>
                        <th>Hành Động</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="brand in brands" :key="brand.BrandId">
                        <td>{{ brand.BrandId }}</td>
                        <td>{{ brand.BrandName }}</td>
                        <td>
                            <button @click="navigateToEdit(brand.BrandId)"
                                class="action-button edit-button">Sửa</button>
                            <button @click="deleteBrand(brand.BrandId)" class="action-button delete-button">Xóa</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>


<script>
import Swal from 'sweetalert2';

export default {
    data() {
        return {
            brands: []
        };
    },
    async created() {
        await this.fetchBrands();
    },
    methods: {
        async fetchBrands() {
            try {
                const response = await fetch("http://localhost:5000/api/brands");
                if (!response.ok) throw new Error("Lỗi khi tải danh sách thương hiệu.");
                this.brands = await response.json();
            } catch (error) {
                console.error("Lỗi khi tải danh sách thương hiệu:", error);
                alert("Không thể tải danh sách thương hiệu.");
            }
        },
        async deleteBrand(brandId) {
            // Sử dụng SweetAlert2 để xác nhận xóa
            const result = await Swal.fire({
                title: 'Bạn có chắc chắn muốn xóa thương hiệu này?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Xóa',
                cancelButtonText: 'Hủy'
            });

            // Nếu người dùng chọn "Xóa", tiếp tục thực hiện xóa
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`http://localhost:5000/api/brands/${brandId}`, {
                        method: "DELETE"
                    });
                    if (!response.ok) throw new Error("Lỗi khi xóa thương hiệu.");
                    await Swal.fire({
                        title: 'Xóa thành công!',
                        icon: 'success',
                        confirmButtonText: 'Đóng'
                    });
                    await this.fetchBrands();
                } catch (error) {
                    console.error("Lỗi khi xóa thương hiệu:", error);
                    await Swal.fire({
                        title: 'Không thể xóa thương hiệu.',
                        icon: 'error',
                        confirmButtonText: 'Đóng'
                    });
                }
            }
        },
        navigateToCreate() {
            this.$router.push("/admin/brand/add");
        },
        navigateToEdit(brandId) {
            this.$router.push(`/admin/brand/edit/${brandId}`);
        }
    }
};
</script>

<style scoped>
.brand-list-container {
    padding: 2rem;
    background-color: #ffffff;
    border-radius: 12px;
    max-width: 900px;
    margin: 2rem auto;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    font-family: "Roboto", sans-serif;
    color: #2c3e50;
}

.title {
    font-size: 24px;
    font-weight: bold;
    color: #27ae60;
    text-align: center;
    margin-bottom: 1.5rem;
}

.action-button {
    display: inline-block;
    padding: 10px 15px;
    margin: 0 5px;
    font-size: 14px;
    font-weight: bold;
    color: #fff;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.2s;
}

.create-button {
    display: block;
    margin: 1rem auto;
    background-color: #27ae60;
}

.edit-button {
    background-color: #2980b9;
}

.delete-button {
    background-color: #e74c3c;
}

.action-button:hover {
    opacity: 0.9;
    transform: scale(1.05);
}

.table-container {
    margin-top: 1rem;
    overflow-x: auto;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
    background-color: #f9f9f9;
}

table {
    width: 100%;
    border-collapse: collapse;
}

thead th {
    background-color: #27ae60;
    color: #ffffff;
    padding: 12px;
    text-align: left;
    font-weight: bold;
}

tbody td {
    padding: 12px;
    border-bottom: 1px solid #ddd;
}

tbody tr:hover {
    background-color: #e8f5e9;
}
</style>
