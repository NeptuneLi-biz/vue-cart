<template>
  <div>
    <main>
      <nav class="navbar navbar-expand-lg navbar-dark text-white sticky-top"
          :class="{'bg-primary': !sentProps.isHome}"
          style="transform: translateZ(0);">
        <button class="navbar-toggler mobile-link" type="button" data-toggle="collapse"
              @click="openAside(true)">
          <span class="navbar-toggler-icon"></span>
        </button>
        <router-link class="navbar-brand text-light d-flex" to="/home">
          <img class="d-inline-block align-self-center"
              src="./../assets/images/logo.png"
              width="50" height="50" alt="">
          <div class="d-inline-block align-self-center ml-2">Neon Tattoo</div>
        </router-link>
        <div class="collapse navbar-collapse" id="navbarNavDropdown">
          <ul class="navbar-nav">
            <li class="nav-item"
                v-for="(item) in categories" :key="item.title"
                :class="{'dropdown': item.subcategories.length !== 0}">
              <router-link class="nav-link"
                          :class="{'dropdown-toggle': item.subcategories.length !== 0}"
                          :to="item.link">
                {{ item.title }}
              </router-link>
              <div class="dropdown-menu"
                  v-if="item.subcategories.length !== 0">
                <a class="dropdown-item" href="#"
                    v-for="(subItem, index) in item.subcategories"
                    :key="index">
                    {{ subItem }}
                </a>
              </div>
            </li>
          </ul>
        </div>
        <section class="ml-auto">
          <button class="btn btn-sm btn-cart">
            <i class="fas fa-user-circle text-white"></i>
          </button>
          <div class="dropdown d-inline-block">
            <button class="btn btn-sm btn-cart dropdown" dataToggle="dropdown">
            <i class="fa fa-shopping-cart text-white" aria-hidden="true"></i>
            <span class="badge badge-pill badge-danger"
                  v-if="sentProps.cartData.carts">
              {{ sentProps.cartData.carts.length }}
            </span>
          </button>
          <div class="dropdown-menu py-3 px-1 text-center dropdown-menu-right"
          style="width: 400px;">
            <h6>已選擇商品</h6>
            <table class="table mb-2">
              <thead>
                <tr>
                  <th width=10%>刪除</th>
                  <th>名稱</th>
                  <th width=20%>數量</th>
                  <th width=20%>金額</th>
                </tr>
              </thead>
              <tbody>
                <!-- TODO: 要有高度限制 -->
                  <tr v-for="item in sentProps.cartData.carts" :key="item.id">
                      <td class="align-middle text-center">
                          <button class="btn text-secondary" @click="removeCartItem(item.id)">
                              <i class="fas fa-trash-alt"></i>
                          </button>
                      </td>
                      <td class="align-middle">{{ item.product.title }}</td>
                      <td class="align-middle">{{ item.qty }} {{ item.product.unit }}</td>
                      <td class="align-middle text-right">{{ item.final_total | currency }}</td>
                  </tr>
              </tbody>
            </table>
            <div class="d-flex justify-content-around">
              <router-link class="btn btn-primary btn-sm" to="/shop_cart">結帳去</router-link>
            </div>
          </div>
          </div>
        </section>
      </nav>
      <router-view :sent-props="sentProps" @sent-carts="getCart()"></router-view>
    </main>
    <shopSidebar :sent-categories="categories" @close-aside="openAside(false)"></shopSidebar>
    <div class="bg-color" @click="openAside(false)"></div>
  </div>
</template>

<style scoped lang="scss">
  .dropdown:hover .dropdown-menu {
    display: block;
    top: 90%;
  }
  .navbar {
    transition: background-color 1s ease 0s;
  }
  .bg-color {
    transition: all .3s;
  }
</style>

<script>
import $ from 'jquery';
import shopSidebar from './ShopSidebar';

export default {
  components: {
    shopSidebar,
  },
  data() {
    return {
      sentProps: {
        isHome: true,
        cartData: {},
      },
      categories: [
        {
          title: '商品分類',
          subcategories: [],
          link: '/',
        },
        {
          title: '全部商品',
          subcategories: [],
          link: '/shop',
        },
        {
          title: '精選推薦',
          subcategories: [],
          link: '/',
        },
      ],
      products: {},
      coupon_code: '',
      swiperOption: {
        autoplay: {
          disableOnInteraction: false,
          delay: 3000,
        },
        speed: 500,
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      },
    };
  },
  methods: {
    openAside(open) {
      if (open) {
        $('body').addClass('open');
        $('.bg-color').addClass('modal-backdrop fade show');
      } else {
        $('body').removeClass('open');
        $('.bg-color').removeClass('modal-backdrop fade show');
      }
    },
    getProducts() {
      const vm = this;
      const api = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/products`;
      this.$http.get(api).then((response) => {
        vm.products = response.data.products;
        vm.products.forEach((item) => {
          if (item.category) {
            vm.categories[0].subcategories.push(item.category);
          }
        });
        vm.categories[0].subcategories = [...(new Set(vm.categories[0].subcategories))];
      });
    },
    getCart() {
      const vm = this;
      const url = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/cart`;
      vm.isLoading = true;
      this.$http.get(url).then((response) => {
        vm.sentProps.cartData = response.data.data;
        vm.isLoading = false;
      });
    },
    removeCartItem(id) {
      const vm = this;
      const url = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/cart/${id}`;
      vm.isLoading = true;
      this.$http.delete(url).then((response) => {
        if (response.data.success) {
          vm.$bus.$emit('message:push', response.data.message, 'success');
          vm.getCart();
        } else {
          vm.$bus.$emit('message:push', response.data.message, 'danger');
        }
        vm.isLoading = false;
      });
    },
    addCouponCode() {
      const vm = this;
      const url = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/coupon`;
      const coupon = {
        code: vm.coupon_code,
      };
      vm.isLoading = true;
      this.$http.post(url, { data: coupon }).then((response) => {
        if (response.data.success) {
          vm.$bus.$emit('message:push', response.data.message, 'success');
          vm.getCart();
        } else {
          vm.$bus.$emit('message:push', response.data.message, 'danger');
        }
        vm.isLoading = false;
      });
    },
    createOrder() {
      const vm = this;
      const url = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/order`;
      const order = vm.form;
      vm.isLoading = true;
      this.$refs.form.validate().then((success) => {
        if (success) {
          this.$http.post(url, { data: order }).then((response) => {
            if (response.data.success) {
              // vm.$bus.$emit('message:push', response.data.message, 'success');
              vm.$router.push(`/customer_checkout/${response.data.orderId}`);
              vm.getCart();
              order.user.name = '';
              order.user.email = '';
              order.user.tel = '';
              order.user.address = '';
              order.message = '';
              this.$nextTick(() => {
                this.$refs.form.reset();
              });
            } else {
              vm.$bus.$emit('message:push', response.data.message, 'danger');
            }
            vm.isLoading = false;
          });
        } else {
          vm.isLoading = false;
          vm.$bus.$emit('message:push', '欄位填寫不完整', 'danger');
        }
      });
    },
  },
  created() {
    this.getProducts();
    this.getCart();
    const vm = this;
    $(window).scroll(() => {
      if (vm.sentProps.isHome) {
        if (window.scrollY > 100) {
          $('.navbar').addClass('bg-primary');
        } else {
          $('.navbar').removeClass('bg-primary');
        }
      }
    });
  },
  updated() {
  },
};
</script>
