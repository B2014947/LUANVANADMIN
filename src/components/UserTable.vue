<template>
    <div>
        <h2>User Management</h2>
        <input v-model="searchQuery" placeholder="Search by username, email..." />
        <button @click="searchUsers">Search</button>
        <button @click="getAllUsers">Get All Users</button>

        <table>
            <thead>
                <tr>
                    <th>Username</th>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Phone Number</th>
                    <th>Address</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in users" :key="user.UserId">
                    <td>{{ user.Username }}</td>
                    <td>{{ user.FullName }}</td>
                    <td>{{ user.Email }}</td>
                    <td>{{ user.PhoneNumber }}</td>
                    <td>{{ user.Address }}</td>
                    <td>{{ user.Role }}</td>
                    <td>{{ user.IsActive ? 'Active' : 'Inactive' }}</td>
                    <td>
                        <button @click="editUser(user)">Edit</button>
                        <button @click="toggleUserStatus(user)">
                            {{ user.IsActive ? 'Disable' : 'Enable' }}
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            users: [],
            searchQuery: '',
        };
    },
    methods: {
        async getAllUsers() {
            try {
                const response = await axios.get('/api/users');
                this.users = response.data;
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        },
        async searchUsers() {
            try {
                const response = await axios.get(`/api/users/search`, {
                    params: { username: this.searchQuery },
                });
                this.users = response.data;
            } catch (error) {
                console.error('Error searching users:', error);
            }
        },
        async toggleUserStatus(user) {
            try {
                const action = user.IsActive ? 'disable' : 'enable';
                await axios.put(`/api/users/${user.UserId}/${action}`);
                this.getAllUsers();
            } catch (error) {
                console.error(`Error ${user.IsActive ? 'disabling' : 'enabling'} user:`, error);
            }
        },
        editUser(user) {
            this.$emit('edit-user', user);
        },
    },
    mounted() {
        this.getAllUsers();
    },
};
</script>