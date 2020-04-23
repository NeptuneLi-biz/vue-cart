// 官方元件
import Vue from 'vue';
import VueRouter from 'vue-router';
import 'bootstrap';

// 自訂元件
import Login from '@/components/pages/Login';
import Dashboard from '@/components/Dashboard';
import Products from '@/components/pages/Products';
import CustomerOrder from '@/components/pages/CustomerOrder';
import CustomerCheckout from '@/components/pages/CustomerCheckout';
import Coupons from '@/components/pages/Coupons';
import Orders from '@/components/pages/Orders';
import Home from '@/components/pages/Home';
import Shop from '@/components/pages/Shop';
import ShopDashboard from '@/components/ShopDashboard';
import ShopCart from '@/components/pages/ShopCart';

// 啟用官方元件
Vue.use(VueRouter);

// 匯出給 entry 使用
export default new VueRouter({
  routes: [
    {
      path: '*',
      redirect: 'home',
    },
    {
      name: 'Login',
      path: '/login',
      component: Login,
    },
    {
      name: 'Dashboard',
      path: '/admin',
      component: Dashboard,
      children: [
        {
          name: 'Products',
          path: 'products',
          component: Products,
          meta: { requiresAuth: true },
        },
        {
          name: 'Coupons',
          path: 'Coupons',
          component: Coupons,
          meta: { requiresAuth: true },
        },
        {
          name: 'Orders',
          path: 'Orders',
          component: Orders,
          meta: { requiresAuth: true },
        },
      ],
    },
    {
      name: 'Dashboard2',
      path: '/demo',
      component: Dashboard,
      children: [
        {
          name: 'CustomerOrder',
          path: 'customer_order',
          component: CustomerOrder,
        },
        {
          name: 'CustomerCheckout',
          path: 'customer_checkout/:orderId',
          component: CustomerCheckout,
        },
      ],
    },
    {
      name: 'ShopDashboard',
      path: '/',
      component: ShopDashboard,
      children: [
        {
          name: 'Home',
          path: 'home',
          component: Home,
        },
        {
          name: 'Shop',
          path: 'shop',
          component: Shop,
        },
        {
          name: 'ShopCart',
          path: 'shop_cart',
          component: ShopCart,
        },
      ],
    },
    // {
    //   name: 'Home',
    //   path: '/home',
    //   component: Home,
    // },
  ],
});
