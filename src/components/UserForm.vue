<template>
    <div>
        <h3>{{ isEdit ? 'Edit User' : 'Add New User' }}</h3>
        <form @submit.prevent="submitForm">
            <input v-model="user.Username" placeholder="Username" required />
            <input v-model="user.Password" placeholder="Password" v-if="!isEdit" required />
            <input v-model="user.FullName" placeholder="Full Name" />
            <input v-model="user.Email" placeholder="Email" required />
            <input v-model="user.PhoneNumber" placeholder="Phone Number" />
            <input v-model="user.Address" placeholder="Address" />
            <select v-model="user.Role">
                <option value="user">User</option>
                <option value="admin">Admin</option>
            </select>
            <button type="submit">{{ isEdit ? 'Update' : 'Create' }}</button>
            <button @click="clearForm">Cancel</button>
        </form>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    props: ['editUserData'],
    data() {
        return {
            user: {
                Username: '',
                Password: '',
                FullName: '',
                Email: '',
                PhoneNumber: '',
                Address: '',
                Role: 'user',
            },
            isEdit: false,
        };
    },
    watch: {
        editUserData: {
            immediate: true,
            handler(newVal) {
                if (newVal) {
                    this.user = { ...newVal };
                    this.isEdit = true;
                } else {
                    this.isEdit = false;
                    this.clearForm();
                }
            },
        },
    },
    methods: {
        async submitForm() {
            try {
                if (this.isEdit) {
                    await axios.put(`/api/users/${this.user.UserId}`, this.user);
                } else {
                    await axios.post('/api/users', this.user);
                }
                this.$emit('form-submitted');
                this.clearForm();
            } catch (error) {
                console.error('Error submitting form:', error);
            }
        },
        clearForm() {
            this.user = {
                Username: '',
                Password: '',
                FullName: '',
                Email: '',
                PhoneNumber: '',
                Address: '',
                Role: 'user',
            };
            this.isEdit = false;
            this.$emit('clear-form');
        },
    },
};
</script>