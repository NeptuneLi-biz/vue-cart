// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import App from './App';
import router from './router';
import './bus';
import currencyFilter from './filters/currency';
import date from './filters/date';
/* eslint-disable */
import { 
  ValidationProvider,
  extend,
  ValidationObserver,
} from 'vee-validate';
import { required, email } from 'vee-validate/dist/rules';
import { localize } from 'vee-validate';
import TW from 'vee-validate/dist/locale/zh_TW.json';
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'

Vue.config.productionTip = false;
Vue.use(VueAxios, axios);
axios.defaults.withCredentials = true;
Vue.component('Loading', Loading);
Vue.filter('currency', currencyFilter);
Vue.filter('date', date);
Vue.component('ValidationProvider', ValidationProvider);
Vue.component("ValidationObserver", ValidationObserver);
extend('email', email);
extend('required', {
  ...required,
  message: '必填欄位',
});
localize('zh_TW', TW);
Vue.component('swiper', swiper);
Vue.component("swiperSlide", swiperSlide);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>',
  router,
});

// Navigation Guards
router.beforeEach((to, from, next) => {
  // 這裡需要驗證
  if (to.meta.requiresAuth) {
    const api = `${process.env.API_PATH}/api/user/check`;
    axios.post(api).then((response) => {
      // 如果驗證過就不需要再登入
      if (response.data.success) {
        next();
      } else {
        next({
          path: '/login',
        });
      }
    });
  } else {
    next();
  }
});
