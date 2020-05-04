// 官方元件
import Vue from 'vue';
import VueRouter from 'vue-router';
import 'bootstrap';

// 自訂元件
import Login from '@/components/admin/Login';
import Dashboard from '@/components/admin/Dashboard';
import Products from '@/components/admin/pages/Products';
import CustomerOrder from '@/components/admin/pages/CustomerOrder';
import CustomerCheckout from '@/components/admin/pages/CustomerCheckout';
import Coupons from '@/components/admin/pages/Coupons';
import Orders from '@/components/admin/pages/Orders';
import Home from '@/components/shop/pages/Home';
import Shop from '@/components/shop/pages/Shop';
import ShopDashboard from '@/components/shop/ShopDashboard';
import ShopCart from '@/components/shop/pages/ShopCart';
import OrderConfirm from '@/components/shop/pages/OrderConfirm';
import Checkout from '@/components/shop/pages/Checkout';
import Product from '@/components/shop/pages/Product';
import Teach from '@/components/shop/pages/Teach';

// 啟用官方元件
Vue.use(VueRouter);

// 匯出給 entry 使用
export default new VueRouter({
  routes: [
    {
      path: '*',
      redirect: '/',
    },
    {
      name: 'Login',
      path: '/login',
      component: Login,
    },
    {
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
      path: '/',
      component: ShopDashboard,
      children: [
        {
          name: 'Home',
          path: '',
          component: Home,
        },
        {
          name: 'Teach',
          path: 'teach',
          component: Teach,
        },
        {
          name: 'Shops',
          path: 'shop',
          component: Shop,
        },
        {
          name: 'Shop',
          path: 'shop/:subItem',
          component: Shop,
        },
        {
          name: 'Product',
          path: 'shop/:subItem/:productId',
          component: Product,
        },
        {
          name: 'ShopCart',
          path: 'shop_cart',
          component: ShopCart,
        },
        {
          name: 'orderConfirm',
          path: 'order_confirm',
          component: OrderConfirm,
        },
        {
          name: 'checkout',
          path: 'checkout/:orderId',
          component: Checkout,
        },
      ],
    },
  ],
});
