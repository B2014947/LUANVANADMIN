<template>
    <div class="brand-form-container">
        <h2 class="form-title">Thêm thương hiệu mới</h2>
        <form @submit.prevent="createBrand">
            <label>
                <strong>Tên thương hiệu:</strong>
                <input type="text" v-model="brandName" class="form-input" required />
            </label>
            <div class="button-group">
                <button type="submit" class="action-button submit-button">Thêm</button>
                <button type="button" @click="goBack" class="action-button cancel-button">Quay lại</button>
            </div>
        </form>
    </div>
</template>


<script>
export default {
    data() {
        return {
            brandName: ""
        };
    },
    methods: {
        async createBrand() {
            try {
                const response = await fetch("http://localhost:5000/api/brands", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        BrandName: this.brandName
                    })
                });

                if (!response.ok) throw new Error("Lỗi khi thêm thương hiệu.");
                alert("Thương hiệu đã được thêm thành công.");
                this.goBack();
            } catch (error) {
                console.error("Lỗi khi thêm thương hiệu:", error);
                alert("Không thể thêm thương hiệu.");
            }
        },
        goBack() {
            this.$router.push("/admin/brand");
        }
    }
};
</script>

<style scoped>
.brand-form-container {
    padding: 2.5rem;
    background-color: #ffffff;
    border-radius: 12px;
    max-width: 600px;
    margin: auto;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    font-family: "Roboto", sans-serif;
    color: #2c3e50;
}

.form-title {
    font-size: 24px;
    font-weight: bold;
    color: #27ae60;
    text-align: center;
    margin-bottom: 1.5rem;
}

label {
    display: block;
    margin-bottom: 1rem;
    font-size: 16px;
    color: #34495e;
}

.form-input {
    width: 100%;
    padding: 10px;
    margin-top: 5px;
    font-size: 16px;
    border: 1px solid #ddd;
    border-radius: 8px;
    outline: none;
    transition: border-color 0.3s ease;
}

.form-input:focus {
    border-color: #27ae60;
    box-shadow: 0 0 5px rgba(39, 174, 96, 0.4);
}

.button-group {
    display: flex;
    justify-content: space-between;
    margin-top: 1.5rem;
}

.action-button {
    padding: 10px 20px;
    font-size: 16px;
    font-weight: bold;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
}

.submit-button {
    background-color: #27ae60;
    color: #ffffff;
}

.cancel-button {
    background-color: #e74c3c;
    color: #ffffff;
}

.action-button:hover {
    opacity: 0.9;
    transform: scale(1.05);
}
</style>
