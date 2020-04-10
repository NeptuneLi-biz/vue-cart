// 官方元件
import Vue from 'vue';
import VueRouter from 'vue-router';
import 'bootstrap';

// 自訂元件
// import Home from '@/components/HelloWorld';
import Login from '@/components/pages/Login';
import Dashboard from '@/components/Dashboard';
import Products from '@/components/pages/Products';

// 啟用官方元件
Vue.use(VueRouter);

// 匯出給 entry 使用
export default new VueRouter({
  routes: [
    {
      path: '*',
      redirect: 'login',
    },
    // {
    //   name: '首頁', // 元件呈現的名稱
    //   path: '/', // 對應的虛擬路徑
    //   component: Home, // 對應的元件
    //   meta: { requiresAuth: true }, // 頁面需要驗證
    // },
    {
      name: 'Login',
      path: '/login',
      component: Login,
    },
    {
      name: 'Dashboard',
      path: '/admin',
      component: Dashboard,
      meta: { requiresAuth: true },
      children: [
        {
          name: 'Products',
          path: 'products',
          component: Products,
          meta: { requiresAuth: true },
        },
      ],
    },
  ],
});
