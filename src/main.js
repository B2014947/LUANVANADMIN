import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import Toast from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

// Import Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faUser, faEnvelope, faPhone, faMapMarkerAlt, faEdit, faShoppingCart, faHeart, faShippingFast } from '@fortawesome/free-solid-svg-icons';

// Thêm các icon cần sử dụng vào thư viện
library.add(faUser, faEnvelope, faPhone, faMapMarkerAlt, faEdit, faShoppingCart, faHeart, faShippingFast);

const app = createApp(App);
app.use(store);  // Đăng ký Vuex store

app.use(router);

app.use(Toast);
// Đăng ký FontAwesomeIcon như một component toàn cục
app.component('font-awesome-icon', FontAwesomeIcon);

app.mount('#app');
